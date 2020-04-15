"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _events = _interopRequireDefault(require("events"));

var ServerConnection = function ServerConnection(serverHandler) {
  return function (evtHandler) {
    evtHandler.on('data', function (rawData) {
      console.log(rawData);
    });
  };
};

var _default = ServerConnection;
exports["default"] = _default;
//# sourceMappingURL=server_connection.js.map
