var babylon = require('babylon');
var babelGenerator = require('babel-generator')['default'];
var fs = require('fs');

module.exports = function mutator(filename) {
    var code = fs.readFileSync(filename, 'utf8');
    var ast = babylon.parse(code);
    return babelGenerator(ast, null, code).code;
};
