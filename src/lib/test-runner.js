const assign = require('lodash/assign');
const spawn = require('child_process').spawn;
const tapParser = require('tap-parser');
const config = require('./config');

function processTestCommand(testPath) {
    const command = config.get('tests.run').replace('$FILE', testPath);
    const [head, ...tail] = command.split(' ');
    return [head, tail];
}

module.exports = (params, callback) => {
    const {testPath, env} = params;
    const testProcess = spawn.apply(
        null,
        processTestCommand(testPath),
        assign(process.env, env)
    );
    testProcess.stdout.pipe(tapParser(result => {
        return callback(null, assign(params, {tap: result}));
    }));
    testProcess.on('exit', code => {
        if (code !== 0) {return callback(`Test runner exited with: ${code}`);}
    });
};
