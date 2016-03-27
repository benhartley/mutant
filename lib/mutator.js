// could get ENV variable here with mutation state
// babylon here?
// - based on ENV, compile AST, mutate, generate
//- then main `mutant` process would handle generating ENV and running tests

var babylon = require('babylon');
var babelTypes = require('babel-types')['default'];
var babelTraverse = require('babel-traverse')['default'];
var babelGenerator = require('babel-generator')['default'];
var fs = require('fs');

module.exports = function mutator(filename) {
    var code = fs.readFileSync(filename, 'utf8');
    var ast = babylon.parse(code);
    return babelGenerator(ast, null, code).code;
};
