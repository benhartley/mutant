const async = require('async');
const chalk = require('chalk');
const figures = require('figures');
const os = require('os');
const get = require('lodash/get');
const config = require('./config');
const didPass = require('./did-pass');
const fail = require('./fail');
const testProcessCreator = require('./test-process-creator');
const reporter = require('./reporter');

function getMutationParams(testPath, mutation, stateMask) {
    return {
        testPath,
        env: {
            MUTATION: mutation,
            STATEMASK: stateMask
        }
    };
}

function reportInitialRun(queue) {
    return (error, result) => {
        if (!didPass(result.tap)) {return fail('Initial test run failed - please check your tests are passing to begin.');}
        console.log(` ${chalk.green(figures.tick)} Initial test run OK!\n`);
        queue.concurrency = os.cpus().length;
    };
}

function mutationTestRun(queue, testPath, stateMask) {
    return (mutation, mapCallback) => {
        let nodeCount = 1;
        return async.whilst(
            () => stateMask.length <= nodeCount,
            whilstCallback => {
                return queue.push(
                    getMutationParams(testPath, mutation, stateMask),
                    (error, result) => {
                        nodeCount = get(result, 'nodeCount');
                        stateMask = `${get(result, 'stateMaskWithResult')}1`;
                        return whilstCallback(error, result);
                    }
                );
            },
            mapCallback
        );
    };
}

module.exports = (testPath) => {
    const queue = async.queue(testProcessCreator, 1);
    const mutations = config.get('mutations');
    queue.push({testPath}, reportInitialRun(queue));
    return async.map(mutations, mutationTestRun(queue, testPath, '1'), reporter('default'));
};
