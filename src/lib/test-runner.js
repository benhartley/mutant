const async = require('async');
const chalk = require('chalk');
const figures = require('figures');
const os = require('os');
const config = require('./config');
const didPass = require('./did-pass');
const fail = require('./fail');
const testProcessCreator = require('./test-process-creator');
const reporter = require('./reporter');
const MutationTestRun = require('./mutation-test-run');

function reportInitialRun(queue) {
    return (error, result) => {
        if (!didPass(result.tap)) {return fail('Initial test run failed - please check your tests are passing to begin.');}
        console.log(chalk.green(` ${figures.tick} Initial test run OK!\n`));
        queue.concurrency = os.cpus().length;
    };
}

module.exports = (testPath) => {
    const queue = async.queue(testProcessCreator, 1);
    const mutations = config.get('mutations');
    const mutationTestRun = new MutationTestRun(queue, testPath, '1');
    queue.push({testPath}, reportInitialRun(queue));
    return async.map(mutations, mutationTestRun.iteration.bind(mutationTestRun), reporter('default'));
};
