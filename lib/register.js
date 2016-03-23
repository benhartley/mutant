var get = require('lodash/get');
var mutator = require('./mutator');

function shouldRegister(filename) {
    if (!get(process, 'env.MUTANT') || /node_modules/.test(filename)) {return false;}
    return true;
}

function main() {
    var jsHandler = require.extensions['.js'];
    require.extensions['.js'] = function(m, filename) {
        if (!shouldRegister(filename)) {return jsHandler(m, filename);}
        return m._compile(mutator(filename), filename);
    };
}

main();
