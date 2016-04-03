const shouldMutate = require('../../lib/should-mutate');
const increaseNodeCount = require('../../lib/increase-node-count');

let n = 0;

module.exports = stateMask => {
    return {
        BooleanLiteral(path) {
            if (shouldMutate(stateMask, n)) {
                path.node.value = !path.node.value;
            }
            n = increaseNodeCount(n);
        }
    };
};
