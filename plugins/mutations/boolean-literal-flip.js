module.exports = {
    BooleanLiteral: function(path) {
        path.node.value = !path.node.value;
    }
};
