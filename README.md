# term-vector
A node.js module that turns that creates a term vector from a mixed text input. Supports stopword removal and customisable separators. Use `term-vector` when implementing a [vector space model](http://en.wikipedia.org/wiki/Vector_space_model)

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

See tests for more examples...
