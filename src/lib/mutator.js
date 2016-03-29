const fs = require('fs');
const babylon = require('babylon');
const babelGenerator = require('babel-generator')['default'];
const babelTraverse = require('babel-traverse')['default'];
const config = require('./config');

const mutations = config.get('mutations', [])
    .reduce((acc, mutation) => {
        acc[mutation] = require('../plugins/mutations/' + mutation);
        return acc;
    }, {});

module.exports = filename => {
    const code = fs.readFileSync(filename, 'utf8');
    const ast = babylon.parse(code);
    babelTraverse(ast, mutations['boolean-literal-flip']('01'));
    return babelGenerator(ast, null, code).code;
};

