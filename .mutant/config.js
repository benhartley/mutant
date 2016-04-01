module.exports = {
    tests: {
        run: 'npm t -- --reporter tap $FILE'
    },
    mutations: [
        'boolean-literal-flip',
        'lt-to-lte',
        'lte-to-lt',
        'gt-to-gte',
        'gte-to-gt',
    ]
};
