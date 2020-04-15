"use strict";

var _chai = require("chai");

var _msg_response = require("../../abci/msg_response");

describe('# ABCI Response Messages', function () {
  describe('# echo Message', function () {
    it('should encode an echo message', function () {
      var encoded = (0, _msg_response.encode)({
        msgType: 'echo',
        msgVal: {
          message: 'hi'
        }
      });

      _chai.assert.equal(encoded.toString('hex'), '0c12040a026869');
    });
    it('should decode an echo message');
  });
  describe('# flush Message', function () {
    it('should encode a flush message');
  });
});
//# sourceMappingURL=test_msg_response.js.map
