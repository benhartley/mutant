# Reporter plugins

The reporter plugin API is designed to be as flexible as possible. You just need to return a function that accepts an array of mutation test results, e.g.:

``` javascript
[
  ...
  {
    mutation: 'boolean-literal-flip', // plugin name
    tap: {
      ok: true,
      count: 3,
      pass: 3,
      plan: ...
    },
    stateMaskWithResult: '0011', // test run results, see below
    nodeCount: 4 // the number of matching nodes
  }
  ...
]
```

And you can process that and return whatever you like.

### `stateMaskWithResult`
The `stateMaskWithResult` property of the result object represents the results of the test runs with the mutation applied to each of the matching nodes. So in the example above, we found 4 matching `BooleanLiteral` nodes. We ran the test suite 4 times, apply the mutation to the nodes in order. A `0` in the `stateMaskWithResult` means that that test run failed (thus the mutant was killed). A `1` means that the tests passed, so that mutant survived.
