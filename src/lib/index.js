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

function reportResults(error, results) {
    console.log('all done', results);
}

function main(testPath) {
    welcome();
    config.validate();
    const queue = async.queue(testRunner, 1);
    initialTestRun(queue, testPath);
    return async.map(config.get('mutations'), mutationTestRun(queue, testPath), reportResults);
}

commander
    .version(get(packageJson, 'version'))
    .command('<testPath>', 'run Mutant against a single test file')
    .action(main)
    .parse(process.argv);

