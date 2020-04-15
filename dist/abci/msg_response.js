"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodePadding = exports.decode = exports.encode = void 0;

var _protocolBuffersEncodings = require("protocol-buffers-encodings");

var _types_pb = require("../../gen/types_pb");

var encodePadding = function encodePadding(abciResp) {
  var msgBytes = Buffer.from(abciResp.serializeBinary());
  var msgLenBytes = Buffer.from(_protocolBuffersEncodings.varint.encode(msgBytes.length << 1));
  return Buffer.concat([msgLenBytes, msgBytes]);
};

var decodePadding = function decodePadding(rawBytes) {
  var maxLenBuf = Buffer.alloc(8);
  rawBytes.copy(maxLenBuf, 0, 0, 8);
  var msgLen = _protocolBuffersEncodings.varint.decode(maxLenBuf, 0) >> 1;
  var msgLenRead = _protocolBuffersEncodings.varint.decode.bytes;
  return {
    msgLen: msgLen,
    msgLenRead: msgLenRead
  };
};

exports.decodePadding = decodePadding;

var wrapResponse = function wrapResponse(msgType, abciMsg) {
  var abciResp = new _types_pb.Response();
  if (msgType === 'echo') abciResp.setEcho(abciMsg);
  if (msgType === 'flush') abciResp.setFlush(abciMsg);
  if (msgType === 'info') abciResp.setInfo(abciMsg);
  if (msgType === 'commit') abciResp.setCommit(abciMsg);
  if (msgType === 'checkTx') abciResp.setCheckTx(abciMsg);
  if (msgType === 'deliverTx') abciResp.setDeliverTx(abciMsg);
  if (msgType === 'beginBlock') abciResp.setBeginBlock(abciMsg);
  if (msgType === 'initChain') abciResp.setInitChain(abciMsg);
  if (msgType === 'endBlock') abciResp.setEndBlock(abciMsg);
  if (msgType === 'query') abciResp.setQuery(abciMsg);
  return encodePadding(abciResp);
};

var RespEcho = {};

RespEcho.encode = function () {
  var msgVal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var wrapResp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var echoResp = new _types_pb.ResponseEcho();
  if (typeof msgVal.message !== 'undefined') echoResp.setMessage(msgVal.message);
  if (wrapResp === false) return echoResp;
  return wrapResponse('echo', echoResp);
};

RespEcho.decode = function (rawBytes) {
  var abciResp = _types_pb.ResponseEcho.deserializeBinary(rawBytes);

  return {
    msgType: 'echo',
    msgVal: abciResp.toObject()
  };
};

RespEcho.decodeResp = function (abciResp) {
  var msgObj = abciResp.getEcho();
  return {
    msgType: 'echo',
    msgVal: msgObj.toObject()
  };
};

var RespFlush = {};

RespFlush.encode = function () {
  var msgVal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var wrapResp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var flushResp = new _types_pb.ResponseFlush();
  if (wrapResp === false) return flushResp;
  return wrapResponse('flush', flushResp);
};

var RespInfo = {};

RespInfo.encode = function () {
  var msgVal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var wrapResp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var infoResp = new _types_pb.ResponseInfo();
  var data = msgVal.data,
      version = msgVal.version,
      appVersion = msgVal.appVersion,
      lastBlockHeight = msgVal.lastBlockHeight,
      lastBlockAppHash = msgVal.lastBlockAppHash;
  if (typeof data !== 'undefined') infoResp.setData(data);
  if (typeof version !== 'undefined') infoResp.setVersion(version);
  if (typeof appVersion !== 'undefined') infoResp.setAppVersion(appVersion);
  if (typeof lastBlockHeight !== 'undefined') infoResp.setLastBlockHeight(lastBlockHeight);
  if (typeof lastBlockAppHash !== 'undefined') infoResp.setLastBlockAppHash(lastBlockAppHash);
  if (wrapResp === false) return infoResp;
  return wrapResponse('info', infoResp);
};

var RespCommit = {};

RespCommit.encode = function () {
  var msgVal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var wrapResp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var commitResp = new _types_pb.ResponseCommit();
  var data = msgVal.data;
  if (typeof data !== 'undefined') commitResp.setData(data);
  if (wrapResp === false) return commitResp;
  return wrapResponse('commit', commitResp);
};

var RespCheckTx = {};

RespCheckTx.encode = function () {
  var msgVal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var wrapResp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var checkTxResp = new _types_pb.ResponseCheckTx();
  var code = msgVal.code,
      data = msgVal.data,
      log = msgVal.log,
      info = msgVal.info,
      gasWanted = msgVal.gasWanted,
      gasUsed = msgVal.gasUsed,
      events = msgVal.events,
      codespace = msgVal.codespace;
  if (typeof code !== 'undefined') checkTxResp.setCode(code);
  if (typeof data !== 'undefined') checkTxResp.setData(data);
  if (typeof log !== 'undefined') checkTxResp.setLog(log);
  if (typeof info !== 'undefined') checkTxResp.setInfo(info);
  if (typeof gasWanted !== 'undefined') checkTxResp.setGasWanted(gasWanted);
  if (typeof gasUsed !== 'undefined') checkTxResp.setGasWanted(gasUsed);
  if (typeof events !== 'undefined') checkTxResp.setEvents(events);
  if (typeof codespace !== 'undefined') checkTxResp.setCodespace(codespace);
  if (wrapResp === false) return checkTxResp;
  return wrapResponse('checkTx', checkTxResp);
};

var RespDeliverTx = {};

RespDeliverTx.encode = function () {
  var msgVal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var wrapResp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var deliverTxResp = new _types_pb.ResponseDeliverTx();
  var code = msgVal.code,
      data = msgVal.data,
      log = msgVal.log,
      info = msgVal.info,
      gasWanted = msgVal.gasWanted,
      gasUsed = msgVal.gasUsed,
      events = msgVal.events,
      codespace = msgVal.codespace;
  if (typeof code !== 'undefined') deliverTxResp.setCode(code);
  if (typeof data !== 'undefined') deliverTxResp.setData(data);
  if (typeof log !== 'undefined') deliverTxResp.setLog(log);
  if (typeof info !== 'undefined') deliverTxResp.setInfo(info);
  if (typeof gasWanted !== 'undefined') deliverTxResp.setGasWanted(gasWanted);
  if (typeof gasUsed !== 'undefined') deliverTxResp.setGasWanted(gasUsed);
  if (typeof events !== 'undefined') deliverTxResp.setEvents(events);
  if (typeof codespace !== 'undefined') deliverTxResp.setCodespace(codespace);
  if (wrapResp === false) return deliverTxResp;
  return wrapResponse('deliverTx', deliverTxResp);
};

var RespBeginBlock = {};

RespBeginBlock.encode = function () {
  var msgVal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var wrapResp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var beginBlockResp = new _types_pb.ResponseBeginBlock();
  var events = msgVal.events;
  if (typeof events !== 'undefined') beginBlockResp.setEvents(events);
  if (wrapResp === false) return beginBlockResp;
  return wrapResponse('beginBlock', beginBlockResp);
};

var RespInitChain = {};

RespInitChain.encode = function () {
  var msgVal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var wrapResp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var initChainResp = new _types_pb.ResponseInitChain();
  var consensusParams = msgVal.consensusParams,
      validators = msgVal.validators;
  if (typeof consensusParams !== 'undefined') initChainResp.setConsensusParams(consensusParams);
  if (typeof validators !== 'undefined') initChainResp.setValidators(validators);
  if (wrapResp === false) return initChainResp;
  return wrapResponse('initChain', initChainResp);
};

var RespEndBlock = {};

RespEndBlock.encode = function () {
  var msgVal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var wrapResp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var endBlockResp = new _types_pb.ResponseEndBlock();
  var consensusParams = msgVal.consensusParams,
      validators = msgVal.validators,
      events = msgVal.events;
  if (typeof consensusParams !== 'undefined') endBlockResp.setConsensusParams(consensusParams);
  if (typeof validators !== 'undefined') endBlockResp.setValidators(validators);
  if (typeof events !== 'undefined') endBlockResp.setEvents(events);
  if (wrapResp === false) return endBlockResp;
  return wrapResponse('initChain', endBlockResp);
};

var RespQuery = {};

RespQuery.encode = function () {
  var msgVal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var wrapResp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var queryResp = new _types_pb.ResponseQuery();
  var code = msgVal.code,
      log = msgVal.log,
      info = msgVal.info,
      index = msgVal.index,
      key = msgVal.key,
      value = msgVal.value,
      proof = msgVal.proof,
      height = msgVal.height,
      codespace = msgVal.codespace;
  if (typeof code !== 'undefined') queryResp.setCode(code);
  if (typeof log !== 'undefined') queryResp.setLog(log);
  if (typeof info !== 'undefined') queryResp.setInfo(info);
  if (typeof index !== 'undefined') queryResp.setIndex(index);
  if (typeof key !== 'undefined') queryResp.setKey(key);
  if (typeof value !== 'undefined') queryResp.setValue(value);
  if (typeof proof !== 'undefined') queryResp.setProof(proof);
  if (typeof height !== 'undefined') queryResp.setHeight(height);
  if (typeof codespace !== 'undefined') queryResp.setCodespace(codespace);
  if (wrapResp === false) return queryResp;
  return wrapResponse('query', queryResp);
};

var msgMap = {
  echo: RespEcho,
  flush: RespFlush,
  info: RespInfo,
  commit: RespCommit,
  checkTx: RespCheckTx,
  deliverTx: RespDeliverTx,
  beginBlock: RespBeginBlock,
  initChain: RespInitChain,
  endBlock: RespEndBlock,
  query: RespQuery
};
var caseMap = {
  2: 'echo',
  3: 'flush',
  4: 'info',
  5: 'setOption',
  6: 'initChain',
  7: 'query',
  8: 'beginBlock',
  9: 'checkTx',
  19: 'deliverTx',
  11: 'endBlock',
  12: 'commit'
};

var encode = function encode(_ref) {
  var msgType = _ref.msgType,
      _ref$msgVal = _ref.msgVal,
      msgVal = _ref$msgVal === void 0 ? {} : _ref$msgVal;
  var wrapResp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var method = msgMap[msgType];

  if (method !== 'undefined') {
    var abciMsg = msgMap[msgType].encode(msgVal, false);
    if (wrapResp === true) return wrapResponse(msgType, abciMsg);
    return Buffer.from(abciMsg.serializeBinary());
  }

  return null;
};

exports.encode = encode;

var decode = function decode(rawBytes) {
  var hasPadding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var msgBytes = Buffer.concat([rawBytes]);

  if (hasPadding === true) {
    var _decodePadding = decodePadding(rawBytes),
        msgLen = _decodePadding.msgLen,
        msgLenRead = _decodePadding.msgLenRead;

    if (rawBytes.length < msgLen + msgLenRead) throw Error('Unable to decode incomplete msg');
    msgBytes = rawBytes.slice(msgLenRead, msgLenRead + msgLen);
  }

  var abciResp = _types_pb.Response.deserializeBinary(msgBytes);

  var msgEnum = caseMap[abciResp.getValueCase()];
  return msgMap[msgEnum].decodeResp(abciResp, false);
};

exports.decode = decode;
//# sourceMappingURL=msg_response.js.map
