module.exports = {
    tests: {
        run: 'npm t -- --reporter tap',
        glob: './test/**/*.js'
    },
    mutations: [
        'boolean-literal-flip'
    ]
};
