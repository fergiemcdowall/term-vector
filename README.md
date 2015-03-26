[![NPM version][npm-version-image]][npm-url] [![NPM downloads][npm-downloads-image]][npm-url] [![MIT License][license-image]][license-url] [![Build Status][travis-image]][travis-url]

# term-vector
A node.js module that creates a term vector from a mixed text input. Supports customisable stopwords and separators. Use `term-vector` when implementing a [vector space model](http://en.wikipedia.org/wiki/Vector_space_model)

**Works with non-ascii (European) chars!**

**Specify your own separator!**


## Usage

```javascript
var vec = tv.getVector('This is a really, really cool vector. I like this VeCTor');
```

...`vec` is now:

```javascript
[ [ 'cool', 1 ], [ 'really', 2 ], [ 'vector', 2 ] ]
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
var stp = tv.getStopwords();
stp.push('ståle');
var text = 'some|words|like ståle synnøve Kjærsti|Gerät Kjærsti Grünnerløkka Kjærsti';
var vec = tv.getVector(text, {separator:/[\|'\.,\-|(\n)]+/, stopwords: stp});
```

...which in this case removes 'ståle' to give:

```javascript
[ [ 'gerät', 1 ],
  [ 'grünnerløkka', 1 ],
  [ 'kjærsti', 3 ],
  [ 'synnøve', 1 ],
  [ 'words', 1 ] ]
```

See [tests](https://github.com/fergiemcdowall/term-vector/blob/master/test/test.js) for more examples...


## API

### getStopwords()

Returns an Array of the default stopwords.


### getVector(text [, options])

Returns a ducument vector for the given `text`. `options` is an object that can contain `stopwords` (Array) and/or `separator` (RegExp)


[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE

[npm-url]: https://npmjs.org/package/term-vector
[npm-version-image]: http://img.shields.io/npm/v/term-vector.svg?style=flat
[npm-downloads-image]: http://img.shields.io/npm/dm/term-vector.svg?style=flat

[travis-url]: http://travis-ci.org/fergiemcdowall/term-vector
[travis-image]: http://img.shields.io/travis/fergiemcdowall/term-vector.svg?style=flat
