const path = require('path');
const get = require('lodash/get');
const fail = require('./fail');

let config;

function init() {
    try {
        config = require(path.join(process.cwd(), '.mutant/config.js'));
    } catch (err) {
        return fail('Could not find .mutant/config.js file in current directory');
    }
    return config;
}

function validate() {
    const testCommand = get(config, 'tests.run');
    if (!testCommand) {return fail('Config missing tests.run command');}
    if (!/\$FILE/.test(testCommand)) {return fail('Config tests.run command missing $FILE placeholder');}
    return;
}

init();

module.exports = {
    get: get.bind(null, config),
    validate
};

