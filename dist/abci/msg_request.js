"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodePadding = exports.decode = exports.encode = void 0;

var _protocolBuffersEncodings = require("protocol-buffers-encodings");

var _types_pb = require("../../gen/types_pb");

var encodePadding = function encodePadding(abciReq) {
  var msgBytes = Buffer.from(abciReq.serializeBinary());
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

var wrapRequest = function wrapRequest(msgType, abciMsg) {
  var abciReq = new _types_pb.Request();
  if (msgType === 'echo') abciReq.setEcho(abciMsg);
  if (msgType === 'flush') abciReq.setFlush(abciMsg);
  return encodePadding(abciReq);
};

var ReqEcho = {};

ReqEcho.encode = function () {
  var msgVal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var wrapReq = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var echoReq = new _types_pb.RequestEcho();
  if (typeof msgVal.message !== 'undefined') echoReq.setMessage(msgVal.message);
  if (wrapReq === false) return echoReq;
  return wrapRequest('echo', echoReq);
};

ReqEcho.decode = function (rawBytes) {
  var abciReq = _types_pb.RequestEcho.deserializeBinary(rawBytes);

  return {
    msgType: 'echo',
    msgVal: abciReq.toObject()
  };
};

ReqEcho.decodeReq = function (abciReq) {
  var msgObj = abciReq.getEcho();
  return {
    msgType: 'echo',
    msgVal: msgObj.toObject()
  };
};

var ReqFlush = {};

ReqFlush.encode = function () {
  var msgVal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var wrapReq = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var flushReq = new _types_pb.RequestFlush();
  if (wrapReq === false) return flushReq;
  return wrapRequest('flush', flushReq);
};

ReqEcho.decode = function (rawBytes) {
  var abciReq = _types_pb.RequestFlush.deserializeBinary(rawBytes);

  return {
    msgType: 'echo',
    msgVal: abciReq.toObject()
  };
};

ReqFlush.decodeReq = function (abciReq) {
  var msgObj = abciReq.getFlush();
  return {
    msgType: 'flush',
    msgVal: msgObj.toObject()
  };
};

var ReqInfo = {};

ReqInfo.decodeReq = function (abciReq) {
  var msgObj = abciReq.getInfo();
  return {
    msgType: 'info',
    msgVal: msgObj.toObject()
  };
};

var ReqCommit = {};

ReqCommit.decodeReq = function (abciReq) {
  var msgObj = abciReq.getCommit();
  return {
    msgType: 'commit',
    msgVal: msgObj.toObject()
  };
};

var ReqCheckTx = {};

ReqCheckTx.decodeReq = function (abciReq) {
  var msgObj = abciReq.getCheckTx();
  return {
    msgType: 'checkTx',
    msgVal: msgObj.toObject()
  };
};

var ReqDeliverTx = {};

ReqDeliverTx.decodeReq = function (abciReq) {
  var msgObj = abciReq.getDeliverTx();
  return {
    msgType: 'deliverTx',
    msgVal: msgObj.toObject()
  };
};

var ReqBeginBlock = {};

ReqBeginBlock.decodeReq = function (abciReq) {
  var msgObj = abciReq.getBeginBlock();
  return {
    msgType: 'beginBlock',
    msgVal: msgObj.toObject()
  };
};

var ReqInitChain = {};

ReqInitChain.decodeReq = function (abciReq) {
  var msgObj = abciReq.getInitChain();
  return {
    msgType: 'initChain',
    msgVal: msgObj.toObject()
  };
};

var ReqEndBlock = {};

ReqEndBlock.decodeReq = function (abciReq) {
  var msgObj = abciReq.getEndBlock();
  return {
    msgType: 'endBlock',
    msgVal: msgObj.toObject()
  };
};

var ReqQuery = {};

ReqQuery.decodeReq = function (abciReq) {
  var msgObj = abciReq.getQuery();
  return {
    msgType: 'query',
    msgVal: msgObj.toObject()
  };
};

var msgMap = {
  echo: ReqEcho,
  flush: ReqFlush,
  info: ReqInfo,
  initChain: ReqInitChain,
  query: ReqQuery,
  beginBlock: ReqBeginBlock,
  checkTx: ReqCheckTx,
  deliverTx: ReqDeliverTx,
  endBlock: ReqEndBlock,
  commit: ReqCommit
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
  var wrapReq = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var method = msgMap[msgType];

  if (method !== 'undefined') {
    var abciMsg = msgMap[msgType].encode(msgVal, false);
    if (wrapReq === true) return wrapRequest(msgType, abciMsg);
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

  var abciReq = _types_pb.Request.deserializeBinary(msgBytes);

  var msgEnum = caseMap[abciReq.getValueCase()];
  return msgMap[msgEnum].decodeReq(abciReq, false);
};

exports.decode = decode;
//# sourceMappingURL=msg_request.js.map
