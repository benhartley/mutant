const chalk = require('chalk');
const figures = require('figures');
const didPass = require('../../lib/did-pass');
const fail = require('../../lib/fail');

module.exports = result => {
    if (!didPass(result.tap)) {return fail('Initial test run failed - please check your tests are passing to begin.');}
    console.log(` ${chalk.green(figures.tick)} Initial test run OK!`);
};
