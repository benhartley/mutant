var chalk = require('chalk');
var has = require('lodash/has');
var testRunner = require('./test-runner');
var fail = require('./fail');

function welcome() {
    return console.log(chalk.green('\n\
  /\\/\\  \n\
 /    \\    Mutant\n\
/ /\\/\\ \\   Mutation Testing Framework\n\
\\/    \\/\n\
'));
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

