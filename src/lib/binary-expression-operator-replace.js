const shouldMutate = require('./should-mutate');
const increaseNodeCount = require('./increase-node-count');

module.exports = (from, to, stateMask, n, path) => {
    if (path.node.operator === from) {
        if (shouldMutate(stateMask, n)) {
            path.node.operator = to;
        }
        n = increaseNodeCount(n);
    }
    return n;
};

