module.exports = (stateMask, n) => {
    return stateMask.substr(n, 1) === '1';
};
