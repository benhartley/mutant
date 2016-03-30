const assign = require('lodash/assign');
const bluebird = require('bluebird');
const spawn = require('child_process').spawn;
const tapParser = require('tap-parser');
const config = require('./config');

function processTestCommand() {
    const [head, ...tail] = config.get('tests.run', '').split(' ');
    return [head, tail];
}

module.exports = env => {
    return new bluebird((resolve, reject) => {
        const testProcess = spawn.apply(null, processTestCommand(), assign(process.env, env));
        testProcess.stdout.pipe(tapParser(result => {
            return resolve(assign({tap: result}, env));
        }));
        testProcess.on('exit', code => {
            if (code !== 0) {return reject(`Test runner exited with: ${code}`);}
        });
    });
};
