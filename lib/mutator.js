var fs = require('fs');
var babylon = require('babylon');
var babelGenerator = require('babel-generator')['default'];
var babelTraverse = require('babel-traverse')['default'];
var booleanLiteralFlip = require('../plugins/mutations/boolean-literal-flip');

module.exports = function mutator(filename) {
    var code = fs.readFileSync(filename, 'utf8');
    var ast = babylon.parse(code);
    babelTraverse(ast, booleanLiteralFlip);
    return babelGenerator(ast, null, code).code;
};
