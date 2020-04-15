"use strict";

var _chai = require("chai");

var _msg_request = require("../../abci/msg_request");

describe('# ABCI Request Messages', function () {
  describe('# echo Message', function () {
    it('should encode an echo message', function () {
      var encoded = (0, _msg_request.encode)({
        msgType: 'echo',
        msgVal: {
          message: 'hi'
        }
      });

      _chai.assert.equal(encoded.toString('hex'), '0c12040a026869');
    });
    it('should encode an echo message w/o wrapReq', function () {
      var encoded = (0, _msg_request.encode)({
        msgType: 'echo',
        msgVal: {
          message: 'hi'
        }
      }, false);

      _chai.assert.equal(encoded.toString('hex'), '0a026869');
    });
    it('should decode an echo message', function () {
      var decoded = (0, _msg_request.decode)(Buffer.from('0c12040a026869', 'hex'));

      _chai.assert.deepEqual(decoded, {
        msgType: 'echo',
        msgVal: {
          message: 'hi'
        }
      });
    });
    it('should decode an echo message w/o padding', function () {
      var decoded = (0, _msg_request.decode)(Buffer.from('12040a026869', 'hex'), false);

      _chai.assert.deepEqual(decoded, {
        msgType: 'echo',
        msgVal: {
          message: 'hi'
        }
      });
    });
  });
  describe('# flush Message', function () {
    it('should encode a flush message', function () {
      var encoded = (0, _msg_request.encode)({
        msgType: 'flush',
        msgVal: {}
      });

      _chai.assert.equal(encoded.toString('hex'), '041a00');
    });
  });
});
//# sourceMappingURL=test_msg_request.js.map
