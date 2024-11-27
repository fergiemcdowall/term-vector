const test = require('tape')
const tv = require('../')

test('basic test', (t) => {
  t.plan(1)
  const tokens = 'this is really really really cool'.split(' ')
  t.deepEqual(tv(tokens), [
    { term: ['cool'], positions: [5] },
    { term: ['is'], positions: [1] },
    { term: ['really'], positions: [2, 3, 4] },
    { term: ['this'], positions: [0] }
  ])
})

test('basic test with ngrams', (t) => {
  t.plan(1)
  const tokens = 'this is really really really cool'.split(' ')
  t.deepEqual(tv(tokens, { ngramLengths: [1, 2] }), [
    { term: ['cool'], positions: [5] },
    { term: ['is'], positions: [1] },
    { term: ['is', 'really'], positions: [1] },
    { term: ['really'], positions: [2, 3, 4] },
    { term: ['really', 'cool'], positions: [4] },
    { term: ['really', 'really'], positions: [2, 3] },
    { term: ['this'], positions: [0] },
    { term: ['this', 'is'], positions: [0] }
  ])
})
