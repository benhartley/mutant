# Mutation plugins
Mutations are provided to `mutant` via plugins. These take the form of a module that exports a function that accepts a single `stateMask` argument and return a [visitor](link-to-babel-docs) that `babel-traverse` can use to modify the AST of the code being mutated.

# Currently available plugins

### `boolean-literal-flip`
Inverts the truthiness of the value of a `BooleanLiteral`

``` javascript
const trueThing = true;
// becomes:
const trueThing = false;
```

### `gt-to-gte`
Replaces an instance of the `BinaryExpression` operator `>` with `>=`

``` javascript
if (x > y) {}
// becomes:
if (x >= y) {}
```

### `gte-to-gt`
Replaces an instance of the `BinaryExpression` operator `>=` with `>`

``` javascript
if (x >= y) {}
// becomes:
if (x > y) {}
```

### `lt-to-lte`
Replaces an instance of the `BinaryExpression` operator `<` with `<=`

``` javascript
if (x < y) {}
// becomes:
if (x <= y) {}
```

### `lte-to-lt`
Replaces an instance of the `BinaryExpression` operator `<=` with `<`

``` javascript
if (x <= y) {}
// becomes:
if (x < y) {}
```

