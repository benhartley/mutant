const assign = require('lodash/assign');
const get = require('lodash/get');
const spawn = require('child_process').spawn;
const tapParser = require('tap-parser');
const didPass = require('./did-pass');
const config = require('./config');

function getTestCommand(testPath) {
    return config
        .get('tests.run')
        .replace('$FILE', testPath)
        .split(' ');
}

function updateStateMask(params, result) {
    const stateMask = get(params, 'env.STATEMASK');
    if (!stateMask) {return;}
    return {
        stateMaskWithResult: didPass(result) ? stateMask.replace(/1$/, '0') : stateMask
    };
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
