const chalk = require('chalk');
const figures = require('figures');
const didPass = require('./did-pass');
const fail = require('./fail');
const os = require('os');

function reportInitialRun(queue) {
    return (error, result) => {
        if (!didPass(result.tap)) {return fail('Initial test run failed - please check your tests are passing to begin.');}
        console.log(chalk.green(` ${figures.tick} Initial test run OK!\n`));
        queue.concurrency = os.cpus().length;
    };
}

module.exports = (queue, testPath) => queue.push({testPath}, reportInitialRun(queue));
