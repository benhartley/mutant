const mutation = require('../../lib/mutation-plugin');

module.exports = stateMask => {
    return {
        BooleanLiteral(path) {
            if (mutation.shouldMutate(stateMask)) {
                path.node.value = !path.node.value;
            }
            mutation.increaseNodeCount();
        }
    };
};
