const async = require('async');
const commander = require('commander');
const chalk = require('chalk');
const figures = require('figures');
const get = require('lodash/get');
const os = require('os');
const config = require('./config');
const didPass = require('./did-pass');
const fail = require('./fail');
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

function reportInitialRun(queue) {
    return (error, result) => {
        if (!didPass(result.tap)) {return fail('Initial test run failed - please check your tests are passing to begin.');}
        console.log(chalk.green(` ${figures.tick} Initial test run OK!\n`));
        queue.concurrency = os.cpus().length;
    };
}

function main(testPath) {
    welcome();
    config.validate();
    const queue = async.queue(testProcessCreator, 1);
    const mutations = config.get('mutations');
    const mutationTestRun = new MutationTestRun(queue, testPath, '1');
    queue.push({testPath}, reportInitialRun(queue));
    async.map(mutations, mutationTestRun.iteration.bind(mutationTestRun), reporter('default'));
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

