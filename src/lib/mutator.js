const fs = require('fs');
const babylon = require('babylon');
const babelGenerator = require('babel-generator')['default'];
const babelTraverse = require('babel-traverse')['default'];
const get = require('lodash/get');
const isFunction = require('lodash/isFunction');
const config = require('./config');
const fail = require('./fail');

const plugins = config.get('mutations', [])
    .reduce((acc, mutation) => {
        try {
            acc[mutation] = require(`../plugins/mutations/${mutation}`);
        } catch (err) {
            fail(`Mutation plugin "${mutation}" does not exist. Please check your configuration.`);
        }
        return acc;
    }, {});

function getMutation(mutation, stateMask) {
    const plugin = get(plugins, mutation);
    if (isFunction(plugin)) {return plugin(stateMask);}
    return fail(`Plugin "${mutation}" does not return a function`);
}

function runMutations(ast) {
    const mutations = process.env.MUTATION.split(',');
    const stateMasks = process.env.STATEMASK.split(',');
    if (mutations.length !== stateMasks.length) {return fail('Mutation / State Mask mismatch');}
    return mutations
        .map((mutation, i) => babelTraverse(ast, getMutation(mutation, stateMasks[i])));
}

module.exports = filename => {
    const code = fs.readFileSync(filename, 'utf8');
    const ast = babylon.parse(code);
    runMutations(ast);
    return babelGenerator(ast, null, code).code;
};

