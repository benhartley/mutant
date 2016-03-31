const fs = require('fs');
const path = require('path');
const assign = require('lodash/assign');
const bluebird = require('bluebird');
const spawn = require('child_process').spawn;
const tapParser = require('tap-parser');
const config = require('./config');

function processTestCommand(testPath) {
    const command = config.get('tests.run').replace('$FILE', testPath);
    const [head, ...tail] = command.split(' ');
    return [head, tail];
}

module.exports = (testPath, env) => {
    return new bluebird((resolve, reject) => {
        fs.accessSync(path.join(__dirname, '..', testPath), fs.R_OK);
        const testProcess = spawn.apply(
            null,
            processTestCommand(testPath),
            assign(process.env, env)
        );
        testProcess.stdout.pipe(tapParser(result => {
            return resolve({tap: result, testPath, env});
        }));
        testProcess.on('exit', code => {
            if (code !== 0) {return reject(`Test runner exited with: ${code}`);}
        });
    });
};
