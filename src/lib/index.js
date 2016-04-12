const async = require('async');
const commander = require('commander');
const chalk = require('chalk');
const figures = require('figures');
const get = require('lodash/get');
const config = require('./config');
const initialTestRun = require('./initial-test-run');
const packageJson = require('../package');
const reporter = require('./reporter');
const testProcessCreator = require('./test-process-creator');
const MutationTestRun = require('./mutation-test-run');

require('source-map-support').install();

function welcome() {
    return console.log(chalk.green(`
   /\\/\\
  /    \\    Mutant
 / /\\/\\ \\   Mutation Testing Framework
 \\/    \\/
`));
}

function introduceTests(mutations, testPath) {
    console.log(chalk.blue(` Test suite: ${testPath}\n`));
    console.log(chalk.grey(' Attempting to run the following mutations:'));
    mutations.map(mutation => console.log(chalk.grey(`   ${figures.play} ${mutation}`)));
    return console.log();
}

function runTests(testPath) {
    const queue = async.queue(testProcessCreator, 1);
    const mutations = config.get('mutations');
    const mutationTestRun = new MutationTestRun(queue, testPath, '1');
    initialTestRun(queue, testPath);
    async.map(mutations, mutationTestRun.iteration.bind(mutationTestRun), reporter('default'));
    return introduceTests(mutations, testPath);
}

function main(testPath) {
    welcome();
    config.validate();
    return runTests(testPath);
}

commander
    .version(get(packageJson, 'version'))
    .command('<testPath>', 'run Mutant against a single test file')
    .action(main)
    .parse(process.argv);

