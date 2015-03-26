var stopwords = require('./stopwords_en.js');
var _ = require('lodash');

exports.getVector = function(text, options) {
  if (typeof text != "string")
    throw new Error("error: input must be a string");
  var defaults = {
    separator: /[\\., ]+/
  }
  options = _.defaults(options || {}, defaults)
  var vector = [];
  var tokens = text.split(options.separator);
  tokens = _.compact(tokens.map(function(value) {
    if (stopwords.en.indexOf(value.toLowerCase()) != -1) return '';
    return value.toLowerCase();
  })).sort();
  var counter = 1;
  var lastToken = tokens[0];
  for (var i = 1; i < tokens.length; i++) {
    if (tokens[i] == lastToken) {counter++}
    else if (tokens[i] != lastToken) {
      vector.push([lastToken, counter]);
      counter = 1;
      lastToken = tokens[i];
    }
    if (i == (tokens.length - 1))
      vector.push([tokens[i], counter]);
  }
  return vector;
}
