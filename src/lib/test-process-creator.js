const assign = require('lodash/assign');
const spawn = require('child_process').spawn;
const config = require('./config');
const Parser = require('./test-process-output-parser');

function getTestCommand(testPath) {
    return config
        .get('tests.run')
        .replace('$FILE', testPath)
        .split(' ');
}

module.exports = (params, callback) => {
    const [command, ...args] = getTestCommand(params.testPath);
    const testProcess = spawn(command, args, assign(process.env, params.env));
    const parser = new Parser();
    const testParser = parser.getTestParser(params, callback);
    testProcess.stdout.pipe(testParser);
    testProcess.on('exit', code => {
        if (code !== 0) {return callback(`Test runner exited with: ${code}`);}
    });
};
