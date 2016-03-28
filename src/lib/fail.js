const chalk = require('chalk');
const figures = require('figures');

module.exports = message => {
    console.error(chalk.red(`${figures.cross} Error: ${message}\n`));
    return process.exit(1);
};

