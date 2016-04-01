const replace = require('../../lib/binary-expression-operator-replace');

let n = 0;

module.exports = stateMask => {
    return {
        BinaryExpression(path) {
            n = replace('<', '<=', stateMask, n, path);
        }
    };
};
