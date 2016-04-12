module.exports = Object.create({
    n: 0,
    shouldMutate(stateMask) {
        return stateMask.substr(this.n, 1) === '1';
    },
    increaseNodeCount() {
        this.n += 1;
        return console.log(`Node count: ${this.n}`);
    }
});
