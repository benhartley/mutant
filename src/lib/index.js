const async = require('async');
const commander = require('commander');
const chalk = require('chalk');
const figures = require('figures');
const os = require('os');
const get = require('lodash/get');
const testRunner = require('./test-runner');
const didPass = require('./did-pass');
const fail = require('./fail');
const config = require('./config');
const packageJson = require('../package');

require('source-map-support').install();

function welcome() {
    return console.log(chalk.green(`
   /\\/\\
  /    \\    Mutant
 / /\\/\\ \\   Mutation Testing Framework
 \\/    \\/
`));
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
        let run = 0;
        let stateMask = '1';
        return async.whilst(
            () => run < 3,
            whilstCallback => {
                run += 1;
                return queue.push(
                    getMutationParams(testPath, mutation, stateMask),
                    (error, result) => {
                        stateMask = `${get(result, 'stateMaskWithResult')}1`;
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
            config.get('mutations'),
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

