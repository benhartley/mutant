const shouldMutate = require('./should-mutate');

module.exports = (from, to, stateMask, n, path) => {
    if (path.node.operator === from) {
        if (shouldMutate(stateMask, n)) {
            path.node.operator = to;
        }
        n++;
    }
    return n;
};

