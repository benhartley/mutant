const chalk = require('chalk');
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

function handleInitialTestRun(result) {
    if (result.ok && !has(result, 'failures')) {return;}
    return fail('Initial test run failed - please check your tests are passing to begin.');
}

function main() {
    welcome();
    return testRunner()
        .then(handleInitialTestRun)
        .catch(fail);
}

main();

