const get = require('lodash/get');
const has = require('lodash/has');

module.exports = result => !!get(result, 'ok') && !has(result, 'failures');
