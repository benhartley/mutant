module.exports = {
    BooleanLiteral(path) {
        path.node.value = !path.node.value;
    }
};
