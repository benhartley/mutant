const get = require('lodash/get');
const mutator = require('./mutator');

function shouldRegister(filename) {
    if (!get(process, 'env.MUTANT') || /node_modules/.test(filename)) {return false;}
    return true;
}

function main() {
    const jsHandler = require.extensions['.js'];
    require.extensions['.js'] = (m, filename) => {
        if (!shouldRegister(filename)) {return jsHandler(m, filename);}
        return m._compile(mutator(filename), filename);
    };
}

main();
