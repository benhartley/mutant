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

function Parser() {
    return assign(this, {nodeCount: 0});
}

Parser.prototype.getTestParser = function(params, callback) {
    const testParser = tapParser(result => {
        return callback(null, assign(
            params,
            {tap: result},
            updateStateMask(params, result),
            {nodeCount: this.getNodeCount()}
        ));
    });
    testParser.on('extra', this.parseNodeCount.bind(this));
    return testParser;
};

Parser.prototype.parseNodeCount = function(extra) {
    const matchedNodeCount = extra.match(/Node count: (\d+)/);
    if (matchedNodeCount === null) {return;}
    this.nodeCount = +matchedNodeCount[1];
};

Parser.prototype.getNodeCount = function() {
    return this.nodeCount;
};

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
