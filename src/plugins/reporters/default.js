const chalk = require('chalk');
const figures = require('figures');

function getColour(result) {
    if (result.nodeCount === 0) {return 'grey';}
    if (/^0+$/.test(result.stateMaskWithResult)) {return 'green';}
    if (/^1+$/.test(result.stateMaskWithResult)) {return 'red';}
    return 'yellow';
}

function getMutationRepresentation(state) {
    if (state === '0') {return chalk.green(`${figures.tick}`);}
    return chalk.red(`${figures.cross}`);
}

function mutationIntro(result) {
    console.log(chalk.blue(`   ${figures.circleDouble} ${result.mutation}`));
}

function mutationResult(result) {
    process.stdout.write(chalk[getColour(result)](`     ${result.nodeCount}: `));
    if (result.nodeCount === 0) {return console.log();}
    result.stateMaskWithResult
        .split('')
        .map(state => process.stdout.write(getMutationRepresentation(state)));
    return console.log();
}

module.exports = results => {
    console.log(chalk.blue(' Results:'));
    results
        .map(result => {
            mutationIntro(result);
            mutationResult(result);
        });
    console.log();
};
