const fs = require('fs');
const babylon = require('babylon');
const babelGenerator = require('babel-generator')['default'];
const babelTraverse = require('babel-traverse')['default'];
const get = require('lodash/get');
const isFunction = require('lodash/isFunction');
const config = require('./config');
const fail = require('./fail');

const mutations = config.get('mutations', [])
    .reduce((acc, mutation) => {
        try {
            acc[mutation] = require(`../plugins/mutations/${mutation}`);
        } catch (err) {
            fail(`Mutation plugin "${mutation}" does not exist. Please check your configuration.`);
        }
        return acc;
    }, {});

function getMutation() {
    const mutation = get(mutations, process.env.MUTATION);
    if (!isFunction(mutation)) {
        return fail(`Plugin "${process.env.MUTATION}" does not return a function`);
    }
    return mutation(process.env.STATEMASK);
}

module.exports = filename => {
    const code = fs.readFileSync(filename, 'utf8');
    const ast = babylon.parse(code);
    babelTraverse(ast, getMutation());
    return babelGenerator(ast, null, code).code;
};

