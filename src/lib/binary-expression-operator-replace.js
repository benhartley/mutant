module.exports = (mutation, from, to) => stateMask => {
    return {
        BinaryExpression(path) {
            if (path.node.operator === from) {
                if (mutation.shouldMutate(stateMask)) {
                    path.node.operator = to;
                }
                mutation.increaseNodeCount();
            }
        }
    };
};

