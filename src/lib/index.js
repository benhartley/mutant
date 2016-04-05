const commander = require('commander');
const chalk = require('chalk');
const figures = require('figures');
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
    const mutations = config.get('mutations');
    testRunner(testPath, mutations);
    console.log(chalk.blue(` Test suite: ${testPath}\n`));
    console.log(chalk.grey(' Attempting to run the following mutations:'));
    mutations.map(mutation => console.log(chalk.grey(`   ${figures.play} ${mutation}`)));
    return console.log();
}

commander
    .version(get(packageJson, 'version'))
    .command('<testPath>', 'run Mutant against a single test file')
    .action(main)
    .parse(process.argv);

