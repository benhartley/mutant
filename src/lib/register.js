const has = require('lodash/get');
const mutator = require('./mutator');

function shouldRegister(filename) {
    return (has(process, 'env.MUTATION') && has(process, 'env.STATEMASK') && !/node_modules/.test(filename));
}

function main() {
    const jsHandler = require.extensions['.js'];
    require.extensions['.js'] = (m, filename) => {
        if (!shouldRegister(filename)) {return jsHandler(m, filename);}
        return m._compile(mutator(filename), filename);
    };
}

main();
