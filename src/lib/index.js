require('source-map-support').install();
const bluebird = require('bluebird');
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

function runSingleMutation(testPath, previousState, previousResult) {
    console.log('previousResult', previousResult);
    return mutation => {
        return testRunner(testPath, {
            MUTATION: mutation,
            STATEMASK: '01'
        });
    };
}

function handleInitialTestRun(response) {
    if (get(response, 'tap.ok') && !has(response, 'tap.failures')) {
        return console.log(` ${chalk.green(figures.tick)} Initial test run OK!`);
    }
    return fail('Initial test run failed - please check your tests are passing to begin.');
}

function main(testPath) {
    const concurrency = {concurrency: os.cpus().length};
    welcome();
    config.validate();
    return testRunner(testPath)
        .then(handleInitialTestRun)
        .then(() => {
            return bluebird
                .map(config.get('mutations'), runSingleMutation(testPath, ''), concurrency)
                .map(console.log.bind(console, 'bluebird'));
        })
        .catch(fail);
}

commander
    .version(get(packageJson, 'version'))
    .command('<testPath>', 'run Mutant against a single test file')
    .action(main)
    .parse(process.argv);

