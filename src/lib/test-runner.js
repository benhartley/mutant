const async = require('async');
const chalk = require('chalk');
const figures = require('figures');
const os = require('os');
const get = require('lodash/get');
const config = require('./config');
const didPass = require('./did-pass');
const fail = require('./fail');
const testProcessCreator = require('./test-process-creator');

function didMutate(result) {
    return result.nodeCount > 0 && /1/.test(result.stateMaskWithResult);
}

function getMutationParams(testPath, mutation, stateMask) {
    return {
        testPath,
        env: {
            MUTATION: mutation,
            STATEMASK: stateMask
        }
    };
}

function initialTestRun(queue, testPath) {
    return queue.push({testPath}, (error, result) => {
        if (error) {return fail(error);}
        if (!didPass(result.tap)) {return fail('Initial test run failed - please check your tests are passing to begin.');}
        queue.concurrency = os.cpus().length;
        console.log(` ${chalk.green(figures.tick)} Initial test run OK!`);
    });
}

function mutationTestRun(queue, testPath) {
    return (mutation, mapCallback) => {
        let nodeCount = 1;
        let stateMask = '1';
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

function mergeMutations(error, results) {
    if (error) {return fail(error);}
    console.log('all done', results);
    const positives = results
        .filter(didMutate);
    console.log('positives', positives);
}

module.exports = (testPath) => {
    const queue = async.queue(testProcessCreator, 1);
    initialTestRun(queue, testPath);
    return async.map(config.get('mutations'), mutationTestRun(queue, testPath), mergeMutations);
};
