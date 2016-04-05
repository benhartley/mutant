# Mutant

### What is it?

`mutant` is a [mutation testing framework](https://en.wikipedia.org/wiki/Mutation_testing) designed to help evaluate the quality of test suites for JavaScript applications.

### How does it work?

Code coverage tools are useful to give an idea of how much of your code runs when your tests run, giving an overview of areas that may have been overlooked.

However, they do not provide a great deal of insight into how closely the code behaviour _matches_ that delineated in the tests. A test simply triggering a code path is not enough to be confident the test adequately defines the required behaviour to an acceptable level of detail.

Mutation testing, on the other hand, is designed to test how far the code can stray from the original while the tests still pass. It does this by making incremental modifications to the code under test, and then repeatedly running the test suite against the new versions produced. If the tests pass for a mutated version, we may gain some insight into where there might be gaps in how the tests are designed.

# Install

You can install `mutant` globally, but the preferred way is to install it as a local dev-dependency:

``` sh
npm i -D mutant
```

You can then use it via a script in `package.json`:

``` json
{
  "scripts": {
    "mutant": "mutant"
  }
}
```

Or access the local binary directly using

``` sh
./node_modules/.bin/mutant /path/to/test/file.js
```


# Usage
