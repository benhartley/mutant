const chalk = require('chalk');
const figures = require('figures');
const get = require('lodash/get');
const has = require('lodash/has');
const testRunner = require('./test-runner');
const fail = require('./fail');

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

function main() {
    welcome();
    return testRunner()
        .then(handleInitialTestRun)
        .then(() => {
            // get num cpus here and do map.concurrency
            return testRunner({
                MUTATION: 'boolean-literal-flip',
                STATEMASK: '01'
            });
        })
        .then(response => {
            console.log(response);
        })
        .catch(fail);
}

main();

