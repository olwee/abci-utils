"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var crypto = require('crypto');

var fs = require('fs-extra');

var pino = require('pino');

var abciServer = require('../server')["default"];

var stringify = require('json-stable-stringify');

var TodoApp = require('./todo');

var logger = pino();

var State = function State() {
  // Mempool always starts blank
  var mempool = []; // Check State File Exists

  var stateExists = fs.pathExistsSync('state.json');

  if (!stateExists) {
    fs.writeJsonSync('state.json', {
      chainData: {
        lastBlockHeight: 0
      },
      appData: {}
    }, {
      spaces: 2
    });
  } // Read from file


  var cache = fs.readJsonSync('state.json');
  if (typeof cache.appData.todoList === 'undefined') cache.appData.todoList = [];

  var getAppHash = function getAppHash() {
    if (cache.chainData.lastBlockHeight === 0) return '';
    var hash = crypto.createHash('sha256');
    hash.update(stringify(cache.appData));
    return hash.digest('hex');
  };

  var updateChainData = function updateChainData(k, v) {
    cache.chainData[k] = v;
  };

  var persist = function persist() {
    fs.writeJsonSync('state.json', cache, {
      spaces: 2
    });
    return getAppHash();
  };

  return {
    updateChainData: updateChainData,
    getAppHash: getAppHash,
    persist: persist,
    cache: cache,
    mempool: mempool
  };
};

var state = State();
var todoApp = TodoApp(state);
var server = abciServer({
  info: function () {
    var _info = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", {
                data: 'Node.Js Todo-App',
                version: '0.0.0',
                appVersion: 0,
                lastBlockHeight: state.cache.chainData.lastBlockHeight,
                lastBlockAppHash: Buffer.from(state.getAppHash(), 'hex')
              });

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function info() {
      return _info.apply(this, arguments);
    }

    return info;
  }(),
  beginBlock: function () {
    var _beginBlock = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(request) {
      var rawHeight, nextHeight;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              rawHeight = request.header.height;
              nextHeight = Number(rawHeight.toString());
              state.updateChainData('lastBlockHeight', nextHeight);
              return _context2.abrupt("return", {});

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    function beginBlock(_x) {
      return _beginBlock.apply(this, arguments);
    }

    return beginBlock;
  }(),
  checkTx: function checkTx(request) {
    var txBytesRaw = request.tx; // Base64

    var txBytes = Buffer.from(txBytesRaw, 'base64');

    try {
      return todoApp.checkTx(txBytes);
    } catch (err) {
      console.log(err);
      return {
        code: 1,
        log: 'ABCI App Err'
      };
    }
  },
  deliverTx: function deliverTx(request) {
    var txBytesRaw = request.tx; // Base64

    var txBytes = Buffer.from(txBytesRaw, 'base64');

    try {
      return todoApp.deliverTx(txBytes);
    } catch (err) {
      console.log(err);
      return {
        code: 1,
        log: 'ABCI App Err'
      };
    }
  },
  commit: function commit() {
    // Here we persist the state to disk
    var appHash = state.persist();
    logger.info("Commited Height: ".concat(state.cache.chainData.lastBlockHeight, " AppHash: ").concat(appHash));
    return {
      data: Buffer.from(appHash, 'hex')
    };
  },
  query: function query(req) {
    return todoApp.query(req);
  }
});
server.listen(26658);
//# sourceMappingURL=index.js.map
