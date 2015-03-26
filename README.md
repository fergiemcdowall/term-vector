# term-vector
A node.js module that turns that creates a term vector from a mixed text input. Supports stopword removal and customisable separators.

**Works with non-ascii (European) chars!**

**Specify your own separator!**


## Usage

```javascript
var vec = tv.getVector('This is a really, really cool vector. I like this VeCTor');
```

vec is now

```javascript
[ [ 'cool', 1 ], [ 'really', 2 ], [ 'vector', 2 ] ]
```

Alternatively

```javascript
var vec = tv.getVector('some|words|like ståle synnøve Kjærsti|Gerät Kjærsti Grünnerløkka Kjærsti', {separator:/[\| ]+/});
```

gives

```javascript
[ [ 'gerät', 1 ],
  [ 'grünnerløkka', 1 ],
  [ 'kjærsti', 3 ],
  [ 'ståle', 1 ],
  [ 'synnøve', 1 ],
  [ 'words', 1 ] ]
```

See tests for more examples...
