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

init();

module.exports = {
    get(path, defaultValue) {
        return get(config, path, defaultValue);
    }
};

