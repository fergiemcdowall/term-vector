[![NPM version][npm-version-image]][npm-url] [![NPM downloads][npm-downloads-image]][npm-url] [![MIT License][license-image]][license-url] [![Build Status][travis-image]][travis-url]

# term-vector
A node.js module that creates a term vector from a mixed text input. Supports customisable stopwords and separators. Use `term-vector` when implementing a [vector space model](http://en.wikipedia.org/wiki/Vector_space_model)

**Works with non-ascii (European) chars!**

**Specify your own separator!**

**Does ngrams!**


## Usage

```javascript
var vec = tv.getVector('This is a really, really cool vector. I like this VeCTor');
```

...`vec` is now:

```javascript
[ [ 'cool', 1 ],
  [ 'really', 2 ],
  [ 'vector', 2 ] ]
```

```javascript
var options = {nGramLength: {gte: 1, lte: 5}};
var vec = tv.getVector('This is a really, really cool vector. I like this VeCTor', options);
```

...`vec` is now:
```javascript
[ [ 'cool', 1 ],
  [ 'really', 2 ],
  [ 'vector', 2 ],
  [ 'cool vector', 1 ],
  [ 'really cool', 1 ],
  [ 'really really', 1 ],
  [ 'vector vector', 1 ],
  [ 'cool vector vector', 1 ],
  [ 'really cool vector', 1 ],
  [ 'really really cool', 1 ],
  [ 'really cool vector vector', 1 ],
  [ 'really really cool vector', 1 ],
  [ 'really really cool vector vector', 1 ] ]
```

```javascript
var options = {nGramLength: [1, 4]};
var vec = tv.getVector('This is a really, really cool vector. I like this VeCTor', options);
```

...`vec` is now:
```javascript
[ [ 'cool', 1 ],
  [ 'really', 2 ],
  [ 'vector', 2 ],
  [ 'really cool vector vector', 1 ],
  [ 'really really cool vector', 1 ] ]
```


Alternatively you can specify a [RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) in the standard [String.split()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split) format:

```javascript
var text = 'some|words|like ståle synnøve Kjærsti|Gerät Kjærsti Grünnerløkka Kjærsti';
var vec = tv.getVector(text, {separator:/[\| ]+/});
```

...which makes `vec`:

```javascript
[ [ 'gerät', 1 ],
  [ 'grünnerløkka', 1 ],
  [ 'kjærsti', 3 ],
  [ 'ståle', 1 ],
  [ 'synnøve', 1 ],
  [ 'words', 1 ] ]
```

You can also customise the stopword list:

```javascript
var text = "some.,|words|like\nståle-synnøve's Kjærsti,|.Gerät Kjærsti Grünnerløkka Kjærsti";
var options = {}
options.stp = tv.getStopwords();
options.stp.push('ståle');
options.separator = /[\|' \.,\-|(\n)]+/;
var vec = tv.getVector(text, options);
```

...which in this case removes 'ståle' to give:

```javascript
[ [ 'gerät', 1 ],
  [ 'grünnerløkka', 1 ],
  [ 'kjærsti', 3 ],
  [ 'synnøve', 1 ],
  [ 'words', 1 ] ]
```

Use `nGramLength` to specify an ngram length to do ngrams:

```javascript
var text = "one two one two three two one three one two three four one two three four";
var options = {}
options.stopwords = "";
options.nGramLength = 3;
var vec = tv.getVector(text, options);
```

to generate ngrams of length 3:

```javascript
[ [ 'four one two', 1 ],
  [ 'one three one', 1 ],
  [ 'one two one', 1 ],
  [ 'one two three', 3 ],
  [ 'three four one', 1 ],
  [ 'three one two', 1 ],
  [ 'three two one', 1 ],
  [ 'two one three', 1 ],
  [ 'two one two', 1 ],
  [ 'two three four', 2 ],
  [ 'two three two', 1 ] ]
```

See [tests](https://github.com/fergiemcdowall/term-vector/blob/master/test/test.js) for more examples...


## API

### getStopwords()

Usage
```javascript
getStopwords([language code])
```

returns an array of stopwords for the given language.

Supported languages (and potential values for `language code`): `en`, `es`, `fa`, `fr`, `it`, `ja`, `nl`, `no`, `pl`, `pt`, `ru`, `zh` (defaults to `en`)


### getVector(text [, options])

Returns a document vector for the given `text`. `options` is an object that can contain:

* `stopwords` (Array) An array of tokens that are ignored
* `separator` (RegExp) An expression for how tokens are separated in source files
* `nGramLength` (number/Array/Object) The length of the ngrams that should be generated
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
