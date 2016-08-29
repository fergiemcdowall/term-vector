[![NPM version][npm-version-image]][npm-url] [![NPM downloads][npm-downloads-image]][npm-url] [![MIT License][license-image]][license-url] [![Build Status][travis-image]][travis-url]

# term-vector
A node.js module that creates a term vector from tokenized text. Use `term-vector` when implementing a [vector space model](http://en.wikipedia.org/wiki/Vector_space_model)

**Works with Unicode!**

**Does ngrams!**


## Usage

```javascript
var sw = require('stopword')
var tv = require('term-vector')
var text = sw.removeStopwords(
  'This is a really, really cool vector. I like this VeCTor'
    .toLowerCase()
    .split(/[ ,\.]+/)
)
var vec = tv.getVector(text)
```

...`vec` is now:

```javascript
[ [ [ 'cool' ], 1 ],
  [ [ 'really' ], 2 ],
  [ [ 'vector' ], 2 ] ]
```


Or you can specify a range of ngram lengths:

```javascript
var sw = require('stopword')
var tv = require('term-vector')
var text = sw.removeStopwords(
  'This is a really, really cool vector. I like this VeCTor'
    .toLowerCase()
    .split(/[ ,\.]+/)
)
var vec = tv.getVector(text, {gte: 1, lte: 5})
```

...`vec` is now:

```javascript
[ [ [ 'cool' ], 1 ],
  [ [ 'really' ], 2 ],
  [ [ 'vector' ], 2 ],
  [ [ 'cool', 'vector' ], 1 ],
  [ [ 'really', 'cool' ], 1 ],
  [ [ 'really', 'really' ], 1 ],
  [ [ 'vector', 'vector' ], 1 ],
  [ [ 'cool', 'vector', 'vector' ], 1 ],
  [ [ 'really', 'cool', 'vector' ], 1 ],
  [ [ 'really', 'really', 'cool' ], 1 ],
  [ [ 'really', 'cool', 'vector', 'vector' ], 1 ],
  [ [ 'really', 'really', 'cool', 'vector' ], 1 ],
  [ [ 'really', 'really', 'cool', 'vector', 'vector' ], 1 ] ]
```

Or you can choose specific ngram lengths:


```javascript
var sw = require('stopword')
var tv = require('term-vector')
var text = sw.removeStopwords(
  'This is a really, really cool vector. I like this VeCTor'
    .toLowerCase()
    .split(/[ ,\.]+/)
)
var vec = tv.getVector(text, [1, 4])
```

...`vec` is now:

```javascript
[ [ [ 'cool' ], 1 ],
  [ [ 'really' ], 2 ],
  [ [ 'vector' ], 2 ],
  [ [ 'really', 'cool', 'vector', 'vector' ], 1 ],
  [ [ 'really', 'really', 'cool', 'vector' ], 1 ] ]
```

See [tests](https://github.com/fergiemcdowall/term-vector/blob/master/test/test.js) for more examples...


## API

### getVector(text [, nGram])

* `text` A an array of words
* `nGram` (number/Array/Object) The length of the ngrams that should be generated
	* `Integer` (return one length of ngram): any number- returns ngrams of that length
	* `Array` (return ngrams of different, specified lengths): an `Array` of numbers- returns ngrams for each number in the array
	* `Object` (return ngrams within a range of ngram lengths): an object in the form of `{gte: 1, lte: 5}` where `gte` == "greater than or equal to" and `lte` == "less than or equal to". Returns ngrams of every length in the range.

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE

[npm-url]: https://npmjs.org/package/term-vector
[npm-version-image]: http://img.shields.io/npm/v/term-vector.svg?style=flat
[npm-downloads-image]: http://img.shields.io/npm/dm/term-vector.svg?style=flat

[travis-url]: http://travis-ci.org/fergiemcdowall/term-vector
[travis-image]: http://img.shields.io/travis/fergiemcdowall/term-vector.svg?style=flat


##Release Notes

0.0.14: `term-vector` returns ngrams as Arrays instead
of Strings to avoid separator ambiguity

0.1.1: Only accepts Arrays, tokenization and stopwording delegated to other packages
