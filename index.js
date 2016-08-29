/**
 * search-index module.
 * @module term-vector
 */

const _isEqual = require('lodash.isequal')

exports.getVector = function (tokens, nGramLength) {
  nGramLength = nGramLength || 1
  if (Object.prototype.toString.call(tokens) !== '[object Array]') {
    throw new Error('error: input must be an Array')
  }
  if (nGramLength === 0) {
    throw new Error('error: nGramLength must be greater than 0')
  }
  var vec = []
  if (!isNaN(nGramLength)) {
    return getTermVectorForNgramLength(tokens, nGramLength)
  } else if (Object.prototype.toString.call(nGramLength) === '[object Array]') {
    for (var i = 0; i < nGramLength.length; i++) {
      vec = vec.concat(getTermVectorForNgramLength(tokens, nGramLength[i]))
    }
    return vec
  } else if (typeof (nGramLength) &&
    ((parseInt(nGramLength.gte) <=
    parseInt(nGramLength.lte)))) {
    var j = parseInt(nGramLength.gte)
    while (j <= nGramLength.lte && tokens[j - 1]) {
      vec = vec.concat(getTermVectorForNgramLength(tokens, j++))
    }
    return vec
  } else throw new Error('nGramLength seems to be maformed- see docs')
}

// create ngrams of desired length
var getTermVectorForNgramLength = function (tokens, nGramLength) {
  // cant make ngram if specified length is longer than token array
  if (nGramLength > tokens.length) {
    return []
  }

  var ngrams = []
  for (var i = 0; i <= (tokens.length - nGramLength); i++) {
    ngrams.push(tokens.slice(i, i + nGramLength))
  }
  // count ngrams
  ngrams = ngrams.sort()
  // special case- doc of array length 1
  if (ngrams.length === 1) return [[ngrams[0], 1]]
  var counter = 1
  var lastToken = ngrams[0]
  var vector = []
  for (var j = 1; j < ngrams.length; j++) {
    if (_isEqual(ngrams[j], lastToken)) {
      counter++
    } else {
      vector.push([lastToken, counter])
      counter = 1
      lastToken = ngrams[j]
    }
  }
  vector.push([ngrams[i - 1], counter])
  return vector
}
