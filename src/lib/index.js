require('source-map-support').install();
const commander = require('commander');
const chalk = require('chalk');
const figures = require('figures');
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

function handleInitialTestRun(response) {
    if (get(response, 'tap.ok') && !has(response, 'tap.failures')) {
        return console.log(` ${chalk.green(figures.tick)} Initial test run OK!`);
    }
    return fail('Initial test run failed - please check your tests are passing to begin.');
}

function main(testPath) {
    welcome();
    config.validate();
    return testRunner(testPath)
        .then(handleInitialTestRun)
        .then(() => {
            // get num cpus here and do map.concurrency
            return testRunner(testPath, {
                MUTATION: 'boolean-literal-flip',
                STATEMASK: '01'
            });
        })
        .then(response => {
            console.log(response);
        })
        .catch(fail);
}

commander
    .version(get(packageJson, 'version'))
    .command('<testPath>', 'run Mutant against a single test file')
    .action(main)
    .parse(process.argv);

