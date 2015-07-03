var sw = require('stopword');
var _ = require('lodash');

exports.getVector = function(text, options) {
  if (typeof text != "string")
    throw new Error("error: input must be a string");
  var defaults = {
    nGramLength: 1,
    separator: /[\\., ]+/,
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
  //create ngrams of desired length
  var ngrams = [];
  for (var i = 0; i <= (tokens.length - options.nGramLength); i++) {
    ngrams.push(tokens.slice(i, i + options.nGramLength).join(' '));
  }
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


exports.getStopwords = function(lang) {
  return sw.getStopwords(lang);
}
