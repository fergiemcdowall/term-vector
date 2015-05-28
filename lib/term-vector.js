var stopwords = require('./stopwords_en.js');
var _ = require('lodash');

exports.getVector = function(text, options) {
  if (typeof text != "string")
    throw new Error("error: input must be a string");
  var defaults = {
    nGramLength: 1,
    separator: /[\\., ]+/,
    stopwords: stopwords.en
  }
  options = _.defaults(options || {}, defaults)
  if (options.nGramLength == 0)
    throw new Error("error: nGramLength must be greater than 0");
  var vector = [];
  var tokens = text.split(options.separator);
  //tokenise string, remove stopwords
  tokens = _.compact(tokens.map(function(value) {
    if (options.stopwords.indexOf(value.toLowerCase()) != -1) return '';
    return value.toLowerCase();
  }));
  //create ngrams of desired length
  var ngrams = [];
  for (var i = 0; i <= (tokens.length - options.nGramLength); i++) {
    var thisNGram = [];
    while (thisNGram.length < options.nGramLength) {
      thisNGram.push(tokens[i + thisNGram.length])
    }
    ngrams.push(thisNGram.join(' '));
  }
  //count ngrams
  ngrams = ngrams.sort();
  //special case- doc of array length 1
  if (ngrams.length == 1) return [[ngrams[0], 1]];
  var counter = 1;
  var lastToken = ngrams[0];
  for (var i = 1; i < ngrams.length; i++) {
    if (ngrams[i] == lastToken) {counter++}
    else if (ngrams[i] != lastToken) {
      vector.push([lastToken, counter]);
      counter = 1;
      lastToken = ngrams[i];
    }
    if (i == (ngrams.length - 1))
      vector.push([ngrams[i], counter]);
  }
  return vector;
}


exports.getStopwords = function() {
  return stopwords.en;
}
