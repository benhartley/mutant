export default {
    BooleanLiteral(path) {
        path.node.value = !path.node.value;
    }
};
