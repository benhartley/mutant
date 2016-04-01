let n = 0;

module.exports = stateMask => {
    return {
        BinaryExpression(path) {
            if (stateMask.substr(n, 1) === '1' && path.node.operator === '<=') {
                path.node.operator = '<';
            }
            n++;
        }
    };
};
