# Mutant
JavaScript Mutation Testing Framework

[![CI status](https://travis-ci.org/benhartley/mutant.svg?branch=master)](https://travis-ci.org/benhartley/mutant)
[![Code Climate](https://codeclimate.com/github/benhartley/mutant/badges/gpa.svg)](https://codeclimate.com/github/benhartley/mutant)
[![Test Coverage](https://codeclimate.com/github/benhartley/mutant/badges/coverage.svg)](https://codeclimate.com/github/benhartley/mutant/coverage)
[![npm](https://img.shields.io/npm/v/mutant-test.svg?maxAge=2000)](https://www.npmjs.com/package/mutant-test)
![Wat](https://img.shields.io/badge/badges-5-blue.svg)

**Note: this is very much at the proof-of-concept stage**

### Overview

`mutant` is a [mutation testing framework](https://en.wikipedia.org/wiki/Mutation_testing) designed to help evaluate the quality of test suites for JavaScript applications.

It works alongside any test framework that can output results in [TAP](https://testanything.org/) format, 

[`babel`](http://babeljs.io/) is used to parse and traverse your code, as well as to generate the mutants based on the [mutation plugins](src/plugins/mutations) you select.

It currently only supports running against a single test file at a time. 

### Purpose

Code coverage tools are useful to give an idea of how much of your code runs when your tests run, giving an overview of areas that may have been overlooked.

However, they do not provide a great deal of insight into how closely the code behaviour _matches_ that which is delineated in the tests. A test simply triggering a code path is not enough to be confident the test adequately defines the required behaviour to an acceptable level of detail.

Mutation testing, on the other hand, is designed to test how far the code can stray from the original while the tests still pass. It does this by making incremental modifications to the code under test, and then repeatedly running the test suite against the new versions produced. If the tests pass for a mutated version, we may gain some insight into where there might be gaps in how the tests are designed.

# Install

You can install `mutant` globally, but the preferred way is to install it as a local dev-dependency:

``` sh
npm i -D mutant-test
```

# Usage

### 1. Config
Add a config file in `.mutant/config.js` ([example](.mutant/config.js)) in the root of your project.

#### `config.tests.run`
This file should contain a `tests.run` property that tells `mutant` how to run a single file from your test suite, producing [TAP](https://testanything.org/) output, e.g.:

``` javascript
{
  tests:  {
    run: 'mocha --reporter tap $FILE'
  }
}
```

Some examples for popular frameworks:

``` sh
mocha --reporter tap $FILE
ava --tap $FILE
tap $FILE
tape $FILE
```

The `$FILE` placeholder will be replaced by the path to the individual test file that you supply to `mutant` at runtime.

#### `config.mutations`
You can also select which [mutation plugins](src/plugins/mutations) you want to use via the `mutations` config property array. This may become useful as the list of mutation plugins grows.


### 2. Register
For any file you are intending to run `mutant` against, you need to include the register, e.g.:

``` javascript
require('mutant-test/register');
```

So if you are intending to run `mutant test/module-x.js`, the file at `test/module-x.js` will need to include the register.

### 3. Run `mutant` against a single test file
You can then use `mutant` via a script in `package.json`:

``` json
{
  "scripts": {
    "mutant": "mutant"
  }
}
```

And then run it as follows:

``` sh
npm run mutant path/to/test/file.js
```

Or if you prefer you can just access the local binary directly using

``` sh
./node_modules/.bin/mutant path/to/test/file.js
```

### 4. Output
Test result output is provided by [reporter plugins](src/plugins/reporters). This is pretty bare-bones at the moment - there is a single reporter that lists out the mutations that ran and shows which ones were killed by the tests and which ones survived.

