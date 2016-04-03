const assign = require('lodash/assign');
const get = require('lodash/get');
const spawn = require('child_process').spawn;
const tapParser = require('tap-parser');
const didPass = require('./did-pass');
const config = require('./config');

let nodeCount;

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

function getParser(params, callback) {
    return tapParser(result => {
        return callback(null, assign(
            params,
            {tap: result},
            updateStateMask(params, result),
            {nodeCount: nodeCount}
        ));
    });
}

function parseNodeCount(extra) {
    const matchedNodeCount = extra.match(/Node count: (\d+)/);
    if (matchedNodeCount === null) {return;}
    nodeCount = +matchedNodeCount[1];
}

// feels like this should export a constructor so can be sure internal state not affected by others
module.exports = (params, callback) => {
    const [command, ...args] = getTestCommand(params.testPath);
    const testProcess = spawn(command, args, assign(process.env, params.env));
    const parser = getParser(params, callback);
    parser.on('extra', parseNodeCount);
    testProcess.stdout.pipe(parser);
    testProcess.on('exit', code => {
        if (code !== 0) {return callback(`Test runner exited with: ${code}`);}
    });
};
