const commander = require('commander');
const chalk = require('chalk');
const get = require('lodash/get');
const testRunner = require('./test-runner');
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

function main(testPath) {
    welcome();
    config.validate();
    return testRunner(testPath);
}

commander
    .version(get(packageJson, 'version'))
    .command('<testPath>', 'run Mutant against a single test file')
    .action(main)
    .parse(process.argv);

