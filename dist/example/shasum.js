"use strict";

var crypto = require('crypto');

var txData = Buffer.from('gqR0eXBlqnRvZG8vU3RkVHildmFsdWWBo21zZ4KkdHlwZah0b2RvL2FkZKV2YWx1ZaVoZWxsbw==', 'base64');
console.log(txData);
var digest = crypto.createHash('sha256').update(txData).digest('hex');
console.log(digest);
//# sourceMappingURL=shasum.js.map
