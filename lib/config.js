var path = require('path');
var get = require('lodash/get');
var fail = require('./fail');

var config;

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
    get: function(path, defaultValue) {
        return get(config, path, defaultValue);
    }
};

