import net from 'net';
import pino from 'pino';
import BL from 'bl';
import { v4 as uuidv4 } from 'uuid';
import { decode as reqDecode, decodePadding } from './abci/msg_request';
import { encode as respEncode } from './abci/msg_response';

const logger = pino().child({ module: 'abci-server' });

const ABCIHandler = (handlers) => {
  const route = async (msgType, msgVal) => {
    if (typeof handlers[msgType] === 'undefined') return {};
    const result = await handlers[msgType](msgVal);
    return result;
  };
  return {
    route,
  };
};

const ABCIConnection = (msgHandler) => (c) => {
  const connId = uuidv4();
  logger.info({
    connId,
    mode: 'established',
    peerIP: c.remoteAddress,
    peerPort: c.remotePort,
  });
  const recvBuf = new BL();
  let isWaiting = false;

  const writeData = (dataBuf) => {
    c.write(dataBuf, (err) => {
      if (err) c.emit('error', err);
    });
  };

  const processRecvData = async () => {
    const { msgLen, msgLenRead } = decodePadding(recvBuf);
    const totalLen = msgLen + msgLenRead;
    if (recvBuf.length < totalLen) return; // Buffering
    const msgBytes = recvBuf.slice(msgLenRead, totalLen);
    recvBuf.consume(totalLen);
    const {
      msgType,
      msgVal,
    } = reqDecode(msgBytes, false);

    c.pause();
    isWaiting = true;

    if (msgType === 'echo') {
      // Echo back the message
      const respBuf = respEncode({ msgType: 'echo', msgVal: { message: msgVal.message } });
      writeData(respBuf);
      c.emit('evt-done');
      return;
    }

    if (msgType === 'flush') {
      // Reply Flush
      const respBuf = respEncode({ msgType: 'flush', msgVal: {} });
      writeData(respBuf);
      c.emit('evt-done');
      return;
    }
    try {
      const handlerResp = await msgHandler.route(msgType, msgVal);
      const respBuf = respEncode({ msgType, msgVal: handlerResp });
      writeData(respBuf);
      c.emit('evt-done');
    } catch (handlerErr) {
      if (handlerErr) {
        c.emit('error', handlerErr);
      }
    }
  };

  c.on('evt-done', () => {
    if (recvBuf.length > 0) {
      processRecvData();
      return;
    }
    isWaiting = false;
    c.resume();
  });

  c.on('data', (rawData) => {
    recvBuf.append(rawData);
    if (isWaiting === true) return;
    processRecvData()
      .catch((procErr) => {
        if (procErr) {
          c.emit('error', procErr);
        }
      });
  });

  return {
    writeData,
  };
};

const ABCIServer = (appHandler) => {
  const app = ABCIHandler(appHandler);
  const connector = ABCIConnection(app);

  const server = net.createServer(connector);

  return server;
};

export default ABCIServer;
