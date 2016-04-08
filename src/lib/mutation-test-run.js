const async = require('async');
const get = require('lodash/get');

const MutationTestRun = function(queue, testPath, stateMask) {
    this.queue = queue;
    this.testPath = testPath;
    this.stateMask = stateMask;
    this.nodeCount = 1;
    return this;
};

MutationTestRun.prototype.iteration = function(mutation, mapCallback) {
    return async.whilst(this.hasUnmutatedNodes.bind(this), this.mutateNode(mutation), mapCallback);
};

MutationTestRun.prototype.hasUnmutatedNodes = function() {
    return this.stateMask.length <= this.nodeCount;
};

MutationTestRun.prototype.mutateNode = function(mutation) {
    return whilstCallback => this.queue.push(this.getMutationParams(mutation), this.handleNodeMutationResult(whilstCallback));
};

MutationTestRun.prototype.getMutationParams = function(mutation) {
    return {
        testPath: this.testPath,
        env: {
            MUTATION: mutation,
            STATEMASK: this.stateMask
        }
    };
};

MutationTestRun.prototype.handleNodeMutationResult = function(whilstCallback) {
    return (error, result) => {
        this.nodeCount = get(result, 'nodeCount');
        this.stateMask = `${get(result, 'stateMaskWithResult')}1`;
        return whilstCallback(error, result);
    };
};

module.exports = MutationTestRun;
