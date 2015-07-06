var sw = require('stopword');
var _ = require('lodash');

exports.getVector = function(text, options) {
  if (typeof text != "string")
    throw new Error("error: input must be a string");
  var defaults = {
    nGramLength: 1,
    separator: /[\|' \.,\-|(\n)]+/,
    stopwords: sw.getStopwords()
  }
  options = _.defaults(options || {}, defaults)
  if (options.nGramLength == 0)
    throw new Error("error: nGramLength must be greater than 0");
  //tokenise string, remove stopwords
  var tokens = sw.removeStopwords(text, {
    inputSeparator: options.separator,
    stopwords: options.stopwords
  }).split(' ');
  var vec = []
  if (!isNaN(options.nGramLength)) {
    return getTermVectorForNgramLength(tokens, options.nGramLength);
  }
  else if (options.nGramLength.constructor === Array) {
    for (var i = 0; i < options.nGramLength.length; i++)
      vec = vec.concat(getTermVectorForNgramLength(tokens, options.nGramLength[i]))
    return vec;
  }
  else if (typeof(options.nGramLength)
           && (parseInt(options.nGramLength.gte) <= parseInt(options.nGramLength.lte))) {
    var j = parseInt(options.nGramLength.gte);
    while (j <= options.nGramLength.lte) {
      vec = vec.concat(getTermVectorForNgramLength(tokens, j++))
    }
    return vec;
  }
  else throw new Error('nGramLength seems to be maformed- see docs');
}

exports.getStopwords = function(lang) {
  return sw.getStopwords(lang);
}


var getTermVectorForNgramLength = function (tokens, nGramLength) {
  //create ngrams of desired length
  var ngrams = [];
  for (var i = 0; i <= (tokens.length - nGramLength); i++)
    ngrams.push(tokens.slice(i, i + nGramLength).join(' '));
  //count ngrams
  ngrams = ngrams.sort();
  //special case- doc of array length 1
  if (ngrams.length == 1) return [[ngrams[0], 1]];
  var counter = 1;
  var lastToken = ngrams[0];
  var vector = [];
  for (var i = 1; i < ngrams.length; i++) {
    if (ngrams[i] == lastToken) {counter++}
    else if (ngrams[i] != lastToken) {
      vector.push([lastToken, counter]);
      counter = 1;
      lastToken = ngrams[i];
    }
  }
  vector.push([ngrams[i-1], counter]);
  return vector;
}
