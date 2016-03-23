var assign = require('lodash/assign');
var bluebird = require('bluebird');
var tail = require('lodash/tail');
var spawn = require('child_process').spawn;
var tapParser = require('tap-parser');
var config = require('./config');

function processTestCommand() {
    var parts = config.get('tests.run', '').split(' ');
    return [parts[0], tail(parts)];
}

module.exports = function testRunner(env) {
    return new bluebird(function(resolve, reject) {
        var testProcess = spawn.apply(null, processTestCommand(), assign(process.env, env));
        testProcess.stdout.pipe(tapParser(resolve));
        testProcess.on('exit', function(code) {
            if (code !== 0) {return reject();}
        });
    });
};
