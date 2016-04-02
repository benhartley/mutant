require('source-map-support').install();
const async = require('async');
const commander = require('commander');
const chalk = require('chalk');
const figures = require('figures');
const os = require('os');
const get = require('lodash/get');
const has = require('lodash/has');
const testRunner = require('./test-runner');
const fail = require('./fail');
const config = require('./config');
const packageJson = require('../package');

function welcome() {
    return console.log(chalk.green(`
   /\\/\\
  /    \\    Mutant
 / /\\/\\ \\   Mutation Testing Framework
 \\/    \\/
`));
}

function didPass(result) {
    return get(result, 'tap.ok') && !has(result, 'tap.failures');
}

function getNextStateMask(stateMask, result) {
    if (didPass(result)) {return `${stateMask}1`;}
    return stateMask.replace(/1$/, '01');
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
        if (!didPass(result)) {return fail('Initial test run failed - please check your tests are passing to begin.');}
        queue.concurrency = os.cpus().length;
        console.log(` ${chalk.green(figures.tick)} Initial test run OK!`);
    });
}

function mutationTestRun(queue, testPath) {
    return (mutation, mapCallback) => {
        let run = 0;
        let stateMask = '1';
        return async.whilst(
            () => run < 3,
            whilstCallback => {
                run += 1;
                return queue.push(
                    getMutationParams(testPath, mutation, stateMask),
                    (error, result) => {
                        // single run has finished
                        console.log(result);
                        stateMask = getNextStateMask(stateMask, result);
                        return whilstCallback(error, result);
                    }
                );
            },
            mapCallback
        );
    };
}

function getQueue() {
    const queue = async.queue(testRunner, 1);
    queue.empty = () => console.log('queue empty');
    queue.drain = () => console.log('queue drained');
    return queue;
}

function main(testPath) {
    welcome();
    config.validate();
    const queue = getQueue();
    initialTestRun(queue, testPath);
    return async
        .map(
            config.get('mutations', []),
            mutationTestRun(queue, testPath),
            (err, results) => {
                console.log('all done', results);
            }
        );
}

commander
    .version(get(packageJson, 'version'))
    .command('<testPath>', 'run Mutant against a single test file')
    .action(main)
    .parse(process.argv);

