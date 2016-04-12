const async = require('async');
const get = require('lodash/get');

module.exports = {
    nodeCount: 1,

    init(queue, testPath, stateMask) {
        this.queue = queue;
        this.testPath = testPath;
        this.stateMask = stateMask;
        return this;
    },

    iteration(mutation, mapCallback) {
        return async.whilst(this.hasUnmutatedNodes.bind(this), this.mutateNode(mutation), mapCallback);
    },

    hasUnmutatedNodes() {
        return this.stateMask.length <= this.nodeCount;
    },

    mutateNode(mutation) {
        return whilstCallback => this.queue.push(this.getMutationParams(mutation), this.handleNodeMutationResult(whilstCallback));
    },

    getMutationParams(mutation) {
        return {
            testPath: this.testPath,
            env: {
                MUTATION: mutation,
                STATEMASK: this.stateMask
            }
        };
    },

    handleNodeMutationResult(whilstCallback) {
        return (error, result) => {
            this.nodeCount = get(result, 'nodeCount');
            this.stateMask = `${get(result, 'stateMaskWithResult')}1`;
            return whilstCallback(error, result);
        };
    }

};
