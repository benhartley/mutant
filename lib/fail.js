var chalk = require('chalk');
var figures = require('figures');

module.exports = function fail(message) {
    console.error(chalk.red(figures.cross + ' Error: ' + message + '\n'));
    return process.exit(1);
};

