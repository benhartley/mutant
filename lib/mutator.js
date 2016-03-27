var fs = require('fs');
var babylon = require('babylon');
var babelGenerator = require('babel-generator')['default'];
var babelTraverse = require('babel-traverse')['default'];
var config = require('./config');

var mutations = config.get('mutations', [])
    .reduce(function(acc, mutation) {
        acc[mutation] = require('../plugins/mutations/' + mutation);
        return acc;
    }, {});

module.exports = function mutator(filename) {
    var code = fs.readFileSync(filename, 'utf8');
    var ast = babylon.parse(code);
    babelTraverse(ast, mutations['boolean-literal-flip']);
    return babelGenerator(ast, null, code).code;
};
