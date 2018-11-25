/**
 * search-index module.
 * @module term-vector
 */

module.exports = function (tokens, ops) {
  ops = Object.assign({}, {
    ngramLengths: [ 1 ]
  }, ops)
  const tokenMap = tokens.reduce((acc, cur, i, src) => {
    // register ngram of each given length
    ops.ngramLengths.forEach(ngl => {
      var ngram = src.slice(i, i + ngl)
      if (ngram.length !== ngl) return // at end of token array
      cur = JSON.stringify(ngram)
      acc[cur] = acc[cur] || []
      acc[cur].push(i)
    })
    return acc
  }, {})
  // turn token map into array
  return Object.keys(tokenMap).map(t => {
    return {
      term: JSON.parse(t),
      positions: tokenMap[t]
    }
  }).sort((a, b) => a.term[0] > b.term[0]) // sort alphabetically
}
