"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _net = _interopRequireDefault(require("net"));

var _pino = _interopRequireDefault(require("pino"));

var _bl = _interopRequireDefault(require("bl"));

var _uuid = require("uuid");

var _msg_request = require("./abci/msg_request");

var _msg_response = require("./abci/msg_response");

var logger = (0, _pino["default"])().child({
  module: 'abci-server'
});

var ABCIHandler = function ABCIHandler(handlers) {
  var route = /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(msgType, msgVal) {
      var result;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(typeof handlers[msgType] === 'undefined')) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return", {});

            case 2:
              _context.next = 4;
              return handlers[msgType](msgVal);

            case 4:
              result = _context.sent;
              return _context.abrupt("return", result);

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function route(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();

  return {
    route: route
  };
};

var ABCIConnection = function ABCIConnection(msgHandler) {
  return function (c) {
    var connId = (0, _uuid.v4)();
    logger.info({
      connId: connId,
      mode: 'established',
      peerIP: c.remoteAddress,
      peerPort: c.remotePort
    });
    var recvBuf = new _bl["default"]();
    var isWaiting = false;

    var writeData = function writeData(dataBuf) {
      c.write(dataBuf, function (err) {
        if (err) c.emit('error', err);
      });
    };

    var processRecvData = /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        var _decodePadding, msgLen, msgLenRead, totalLen, msgBytes, _reqDecode, msgType, msgVal, respBuf, _respBuf, handlerResp, _respBuf2;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _decodePadding = (0, _msg_request.decodePadding)(recvBuf), msgLen = _decodePadding.msgLen, msgLenRead = _decodePadding.msgLenRead;
                totalLen = msgLen + msgLenRead;

                if (!(recvBuf.length < totalLen)) {
                  _context2.next = 4;
                  break;
                }

                return _context2.abrupt("return");

              case 4:
                // Buffering
                msgBytes = recvBuf.slice(msgLenRead, totalLen);
                recvBuf.consume(totalLen);
                _reqDecode = (0, _msg_request.decode)(msgBytes, false), msgType = _reqDecode.msgType, msgVal = _reqDecode.msgVal;
                c.pause();
                isWaiting = true;

                if (!(msgType === 'echo')) {
                  _context2.next = 14;
                  break;
                }

                // Echo back the message
                respBuf = (0, _msg_response.encode)({
                  msgType: 'echo',
                  msgVal: {
                    message: msgVal.message
                  }
                });
                writeData(respBuf);
                c.emit('evt-done');
                return _context2.abrupt("return");

              case 14:
                if (!(msgType === 'flush')) {
                  _context2.next = 19;
                  break;
                }

                // Reply Flush
                _respBuf = (0, _msg_response.encode)({
                  msgType: 'flush',
                  msgVal: {}
                });
                writeData(_respBuf);
                c.emit('evt-done');
                return _context2.abrupt("return");

              case 19:
                _context2.prev = 19;
                _context2.next = 22;
                return msgHandler.route(msgType, msgVal);

              case 22:
                handlerResp = _context2.sent;
                _respBuf2 = (0, _msg_response.encode)({
                  msgType: msgType,
                  msgVal: handlerResp
                });
                writeData(_respBuf2);
                c.emit('evt-done');
                _context2.next = 31;
                break;

              case 28:
                _context2.prev = 28;
                _context2.t0 = _context2["catch"](19);

                if (_context2.t0) {
                  c.emit('error', _context2.t0);
                }

              case 31:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[19, 28]]);
      }));

      return function processRecvData() {
        return _ref2.apply(this, arguments);
      };
    }();

    c.on('evt-done', function () {
      if (recvBuf.length > 0) {
        processRecvData();
        return;
      }

      isWaiting = false;
      c.resume();
    });
    c.on('data', function (rawData) {
      recvBuf.append(rawData);
      if (isWaiting === true) return;
      processRecvData()["catch"](function (procErr) {
        if (procErr) {
          c.emit('error', procErr);
        }
      });
    });
    return {
      writeData: writeData
    };
  };
};

var ABCIServer = function ABCIServer(appHandler) {
  var app = ABCIHandler(appHandler);
  var connector = ABCIConnection(app);

  var server = _net["default"].createServer(connector);

  return server;
};

var _default = ABCIServer;
exports["default"] = _default;
//# sourceMappingURL=server.js.map
