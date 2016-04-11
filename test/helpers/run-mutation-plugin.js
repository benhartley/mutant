var babylon = require('babylon');
var babelGenerator = require('babel-generator')['default'];
var babelTraverse = require('babel-traverse')['default'];

module.exports = function(input, mutation, stateMask) {
    var ast = babylon.parse(input);
    babelTraverse(ast, mutation(stateMask));
    return babelGenerator(ast, null, input).code;
};
