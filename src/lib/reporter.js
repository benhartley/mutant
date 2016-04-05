const fail = require('./fail');

function loadPlugin(type) {
    let plugin;
    try {
        plugin = require(`../plugins/reporters/${type}`);
    } catch (error) {
        fail(`Reporter plugin "${type}" does not exist. Please check your configuration.`);
    }
    return plugin;
}

module.exports = type => (error, result) => {
    if (error) {return fail(error);}
    const plugin = loadPlugin(type);
    return plugin(result);
};
