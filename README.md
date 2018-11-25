[![NPM version][npm-version-image]][npm-url] [![NPM downloads][npm-downloads-image]][npm-url] [![MIT License][license-image]][license-url] [![Build Status][travis-image]][travis-url]

# term-vector
A node.js module that creates a term vector from tokenized text. Use `term-vector` when implementing a [vector space model](http://en.wikipedia.org/wiki/Vector_space_model)

**Works with Unicode!**

**Does ngrams!**


```javascript

const tokens = 'this is really really really cool'.split(' ')

tv(tokens)

// [
//   { term: [ 'cool' ], positions: [ 5 ] },
//   { term: [ 'is' ], positions: [ 1 ] },
//   { term: [ 'really' ], positions: [ 2, 3, 4 ] },
//   { term: [ 'this' ], positions: [ 0 ] }
// ]

tv(tokens, { ngramLengths: [ 1, 2 ] })

// [
//   { term: [ 'cool' ], positions: [ 5 ] },
//   { term: [ 'is' ], positions: [ 1 ] },
//   { term: [ 'is', 'really' ], positions: [ 1 ] },
//   { term: [ 'really' ], positions: [ 2, 3, 4 ] },
//   { term: [ 'really', 'really' ], positions: [ 2, 3 ] },
//   { term: [ 'really', 'cool' ], positions: [ 4 ] },
//   { term: [ 'this' ], positions: [ 0 ] },
//   { term: [ 'this', 'is' ], positions: [ 0 ] }
// ]

```
