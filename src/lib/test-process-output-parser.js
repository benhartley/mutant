const assign = require('lodash/assign');
const get = require('lodash/get');
const tapParser = require('tap-parser');
const didPass = require('./did-pass');

function updateStateMask(params, result) {
    const stateMask = get(params, 'env.STATEMASK');
    if (!stateMask) {return;}
    return {
        stateMaskWithResult: didPass(result) ? stateMask : stateMask.replace(/1$/, '0')
    };
}

module.exports = {
    nodeCount: 0,

    getTestParser(params, callback) {
        const testParser = tapParser(result => {
            return callback(null, assign(
                {mutation: get(params, 'env.MUTATION')},
                {tap: result},
                updateStateMask(params, result),
                {nodeCount: this.nodeCount}
            ));
        });
        testParser.on('extra', this.parseNodeCount.bind(this));
        return testParser;
    },

    parseNodeCount(extra) {
        const matchedNodeCount = extra.match(/Node count: (\d+)/);
        if (matchedNodeCount === null) {return;}
        this.nodeCount = +matchedNodeCount[1];
    }

};
