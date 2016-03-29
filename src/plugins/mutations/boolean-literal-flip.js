let n = 0;

module.exports = stateMask => {
    return {
        BooleanLiteral(path) {
            if (stateMask.substr(n, 1) === '1') {
                path.node.value = !path.node.value;
            }
            n++;
        }
    };
};
