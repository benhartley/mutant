var path = require('path');
var chalk = require('chalk');

function log(message) {
    return process.stdout.write(message + '\n');
}

function welcome() {
    return log(chalk.green('\n\
      /\\/\\  \n\
     /    \\    Mutant\n\
    / /\\/\\ \\   Mutation Testing Framework\n\
    \\/    \\/\n\
    '));
}

function fail(message) {
    log(chalk.red('Error: ' + message));
    return process.exit(1);
}

function loadConfig() {
    try {
        var config = require(path.join(process.cwd(), '.mutant.config.js'));
    } catch (err) {
        return fail('Could not find .mutant.config.js file');
    }
    return config;
}

function main() {
    var config;
    welcome();
    config = loadConfig();
    chalk.green(config);
}

main();
