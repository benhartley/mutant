const assign = require('lodash/assign');
const spawn = require('child_process').spawn;
const tapParser = require('tap-parser');
const config = require('./config');

function getTestCommand(testPath) {
    return config
        .get('tests.run')
        .replace('$FILE', testPath)
        .split(' ');
}

module.exports = (params, callback) => {
    const [command, ...args] = getTestCommand(params.testPath);
    const testProcess = spawn(command, args, assign(process.env, params.env));
    testProcess.stdout.pipe(tapParser(result => {
        return callback(null, assign(params, {tap: result}));
    }));
    testProcess.on('exit', code => {
        if (code !== 0) {return callback(`Test runner exited with: ${code}`);}
    });
};
