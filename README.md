# Mutant

[![CI status](https://travis-ci.org/benhartley/mutant.svg?branch=master)](https://travis-ci.org/benhartley/mutant)
[![Code Climate](https://codeclimate.com/github/benhartley/mutant/badges/gpa.svg)](https://codeclimate.com/github/benhartley/mutant)
[![Test Coverage](https://codeclimate.com/github/benhartley/mutant/badges/coverage.svg)](https://codeclimate.com/github/benhartley/mutant/coverage)
[![npm](https://img.shields.io/npm/v/mutant-test.svg?maxAge=2592000)](https://www.npmjs.com/package/mutant-test)
![Wat](https://img.shields.io/badge/badges-5-blue.svg)

**Note: this is very much at the proof-of-concept stage**

### What is it?

`mutant` is a [mutation testing framework](https://en.wikipedia.org/wiki/Mutation_testing) designed to help evaluate the quality of test suites for JavaScript applications.

### How does it work?

Code coverage tools are useful to give an idea of how much of your code runs when your tests run, giving an overview of areas that may have been overlooked.

However, they do not provide a great deal of insight into how closely the code behaviour _matches_ that which is delineated in the tests. A test simply triggering a code path is not enough to be confident the test adequately defines the required behaviour to an acceptable level of detail.

Mutation testing, on the other hand, is designed to test how far the code can stray from the original while the tests still pass. It does this by making incremental modifications to the code under test, and then repeatedly running the test suite against the new versions produced. If the tests pass for a mutated version, we may gain some insight into where there might be gaps in how the tests are designed.

# Install

You can install `mutant` globally, but the preferred way is to install it as a local dev-dependency:

``` sh
npm i -D mutant-test
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

You can use `mutant` alongside any test framework that can output results in [TAP](https://testanything.org/) format.

Some examples for popular frameworks:

``` sh
mocha --reporter tap
ava --tap
```

Currently `mutant` only supports running against a single test file at a time, so your test framework will also need to support passing the path to run a subset of tests. Watch this space for the ability to run full test suites.

