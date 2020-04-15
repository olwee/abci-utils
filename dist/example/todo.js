"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var crypto = require('crypto');

var msgpack = require('msgpack');

var axios = require('axios');

var _require = require('uuid'),
    uuidv4 = _require.v4;

var hashTx = function hashTx(txBytes) {
  return crypto.createHash('sha256').update(txBytes).digest('hex');
}; // const encodeTx = (tx) => msgpack.pack(tx);


var encodeTx = function encodeTx(txName, txVal) {
  var txBody = {
    type: 'todo/StdTx',
    value: {
      msg: {
        type: txName,
        value: txVal
      }
    }
  };
  return msgpack.pack(txBody);
};

var decodeTx = function decodeTx(txBytes) {
  try {
    var txObj = msgpack.unpack(Buffer.from(txBytes.toString('hex'), 'hex'));
    return txObj;
  } catch (err) {
    return null;
  }
};

var isDef = function isDef(x) {
  return typeof x !== 'undefined';
};

var Todo = function Todo(appData) {
  var add = {
    create: function create(name) {
      return encodeTx('add', name);
    },
    check: function check(msgVal) {
      return typeof msgVal === 'string';
    },
    deliver: function deliver(msgVal) {
      // Mutate the state
      var todoId = uuidv4();
      appData.todoList.push({
        id: todoId,
        name: msgVal,
        complete: false
      });
      return true;
    }
  };

  var edit = function edit() {};

  var remove = function remove() {};

  var complete = {
    create: function create(name) {
      return encodeTx('complete', name);
    },
    check: function check() {
      return true;
    },
    deliver: function deliver(msgVal) {
      // Mutate the state
      var txIdx = appData.todoList.findIndex(function (todo) {
        return todo.id === msgVal;
      });
      if (txIdx === -1) return false; // eslint-disable-next-line

      appData.todoList[txIdx] = _objectSpread({}, appData.todoList[txIdx], {
        complete: true
      });
      return true;
    }
  };
  return {
    add: add,
    edit: edit,
    remove: remove,
    complete: complete
  };
};

var unpackTx = function unpackTx(txObj) {
  var txType = txObj.type,
      txVal = txObj.value;
  if (!isDef(txType) || !isDef(txType)) return {
    code: 1,
    log: 'Fail to unpack tx contents'
  };

  if (txType === 'todo/StdTx') {
    var msg = txVal.msg;
    if (!isDef(msg)) return {
      code: 1,
      log: 'todo/StdTx is missing parameter msg'
    };
    var msgType = msg.type,
        msgVal = msg.value;
    return {
      msgType: msgType,
      msgVal: msgVal
    };
    /*
    const txRes = txSwitch[msgType][txOp](msgVal);
    if (txOp === 'check' && txRes === true) return { code: 0, log: '' };
    if (txOp === 'deliver' && txRes === true) return { code: 0, log: '' };
    */
  }

  return null; // return { code: 1, log: `No Handler found for tx ${txType}` };
};

var TodoApp = function TodoApp(state) {
  var todo = Todo(state.cache.appData);

  var checkTx = function checkTx(txBytes) {
    var txKey = hashTx(txBytes.toString('hex'));

    if (state.mempool.indexOf(txKey) === -1) {
      state.mempool.push(txKey);
      var txObj = decodeTx(txBytes);
      if (txObj === null) return {
        code: 1,
        log: 'Fail to unpack tx with msgpack'
      };

      var _unpackTx = unpackTx(txObj),
          msgType = _unpackTx.msgType,
          msgVal = _unpackTx.msgVal;

      var txRes = todo[msgType].check(msgVal);
      if (txRes === true) return {
        code: 0,
        log: ''
      };
      return {
        code: 1,
        log: 'Tx Check Failed'
      };
    }

    return {
      code: 1,
      log: 'Tx Exists In Mempool'
    };
  };

  var deliverTx = function deliverTx(txBytes) {
    var txKey = hashTx(txBytes);
    var memIdx = state.mempool.indexOf(txKey);
    state.mempool.splice(memIdx, 1); // Remove from mempool

    var txObj = decodeTx(txBytes);
    if (txObj === null) return {
      code: 1,
      log: 'Fail to unpack tx with msgpack'
    };

    var _unpackTx2 = unpackTx(txObj),
        msgType = _unpackTx2.msgType,
        msgVal = _unpackTx2.msgVal;

    var txRes = todo[msgType].deliver(msgVal);
    if (txRes === true) return {
      code: 0,
      log: ''
    };
    return {
      code: 1,
      log: 'Tx Deliver Failed'
    };
  };

  var broadcastTx = /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(msgType, msgVal) {
      var stdTx, txQuery, queryURL, broadcastResp;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              stdTx = todo[msgType].create(msgVal);
              txQuery = "0x".concat(stdTx.toString('hex'));
              queryURL = "http://127.0.0.1:26657/broadcast_tx_commit?tx=".concat(txQuery);
              _context.next = 5;
              return axios({
                headers: {
                  accept: 'application/json'
                },
                method: 'get',
                url: queryURL
              });

            case 5:
              broadcastResp = _context.sent;
              console.log(JSON.stringify(broadcastResp.data, null, 2));

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function broadcastTx(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();

  var queryCLI = /*#__PURE__*/function () {
    var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref2) {
      var path, height, data, queryURL, queryResp;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              path = _ref2.path, height = _ref2.height, data = _ref2.data;
              queryURL = 'http://127.0.0.1:26657/abci_query';
              _context2.next = 4;
              return axios({
                headers: {
                  accept: 'application/json'
                },
                method: 'get',
                params: {
                  path: "\"".concat(path, "\""),
                  height: height,
                  data: data
                },
                url: queryURL
              });

            case 4:
              queryResp = _context2.sent;
              console.log(JSON.stringify(queryResp.data, null, 2));

            case 6:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function queryCLI(_x3) {
      return _ref3.apply(this, arguments);
    };
  }();

  var query = function query(_ref4) {
    var data = _ref4.data,
        path = _ref4.path,
        height = _ref4.height,
        prove = _ref4.prove;
    console.log(req);

    if (path === '/todo') {}

    return {};
  };

  return {
    checkTx: checkTx,
    deliverTx: deliverTx,
    query: query,
    broadcastTx: broadcastTx,
    queryCLI: queryCLI
  };
};

module.exports = TodoApp;
//# sourceMappingURL=todo.js.map
