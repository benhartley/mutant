const replace = require('../../lib/binary-expression-operator-replace');
const mutation = require('../../lib/mutation-plugin');

module.exports = replace(mutation, '<=', '<');
