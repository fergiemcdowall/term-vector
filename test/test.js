//force travis build

var should = require('should');
var tv = require('../lib/term-vector.js');

describe('Does term-vector play nice?', function(){
  describe('general term-vectoriness:', function(){
    it('should return throw an error if input is not a string', function(){
      (function(){ tv.getVector(12213412) }).should.throw();
    }),
    it('should make nice term vectors for ascii text', function(){
      var vec = tv.getVector('This is a really, really cool vector. I like this VeCTor');
      vec.should.be.instanceof(Array).and.have.lengthOf(3);
      vec[0].should.be.instanceof(Array).and.have.lengthOf(2);
      vec[0][0].should.be.exactly('cool');
      vec[0][1].should.be.exactly(1);
      vec[1].should.be.instanceof(Array).and.have.lengthOf(2);
      vec[1][0].should.be.exactly('really');
      vec[1][1].should.be.exactly(2);
      vec[2].should.be.instanceof(Array).and.have.lengthOf(2);
      vec[2][0].should.be.exactly('vector');
      vec[2][1].should.be.exactly(2);
    }),
    it('should remove stopwords', function(){
      var vec = tv.getVector('one of the best vectors that should exist');
      vec.should.be.instanceof(Array).and.have.lengthOf(4);
      vec[0][0].should.be.exactly('best');
      vec[1][0].should.be.exactly('exist');
      vec[2][0].should.be.exactly('one');
      vec[3][0].should.be.exactly('vectors');
    }),
    it('should return norwegian stopwords', function(){
      var vec = tv.getStopwords('no');
      vec.should.be.instanceof(Array).and.have.lengthOf(129);
      vec[0].should.be.exactly('og');
      vec[1].should.be.exactly('i');
      vec[2].should.be.exactly('jeg');
      vec[3].should.be.exactly('det');
    }),
    it('should handle words containing non-ascii chars used in european languages', function(){
      var vec = tv.getVector('some words like ståle synnøve Kjærsti Gerät Kjærsti Grünnerløkka Kjærsti');
      vec.should.be.instanceof(Array).and.have.lengthOf(6);
      vec[0][0].should.be.exactly('gerät');
      vec[1][0].should.be.exactly('grünnerløkka');
      vec[2][0].should.be.exactly('kjærsti');
      vec[3][0].should.be.exactly('ståle');
      vec[4][0].should.be.exactly('synnøve');
      vec[5][0].should.be.exactly('words');
    }),
    it('should be possible to customise seperators', function(){
      var text = 'some|words|like ståle synnøve Kjærsti|Gerät Kjærsti Grünnerløkka Kjærsti';
      var options = {}
      options.separator = /[\| ]+/;
      var vec = tv.getVector(text, options);
      vec[0][0].should.be.exactly('gerät');
      vec[1][0].should.be.exactly('grünnerløkka');
      vec[2][0].should.be.exactly('kjærsti');
      vec[3][0].should.be.exactly('ståle');
      vec[4][0].should.be.exactly('synnøve');
      vec[5][0].should.be.exactly('words');
    }),
    it('should be possible to customise seperators including newline', function(){
      var text = "some|words|like\nståle-synnøve's Kjærsti|Gerät Kjærsti Grünnerløkka Kjærsti";
      var options = {}
      options.separator = /[\|' \.,\-|(\n)]+/;
      var vec = tv.getVector(text, options);
      vec[0][0].should.be.exactly('gerät');
      vec[1][0].should.be.exactly('grünnerløkka');
      vec[2][0].should.be.exactly('kjærsti');
      vec[3][0].should.be.exactly('ståle');
      vec[4][0].should.be.exactly('synnøve');
      vec[5][0].should.be.exactly('words');
    })
    it('should be possible to customise seperators using more than one separator contiguaously', function(){
      var text = "some.,|words|like\nståle-synnøve's Kjærsti,|.Gerät Kjærsti Grünnerløkka Kjærsti";
      var options = {}
      options.separator = /[\|' \.,\-|(\n)]+/;
      var vec = tv.getVector(text, options);
      vec[0][0].should.be.exactly('gerät');
      vec[1][0].should.be.exactly('grünnerløkka');
      vec[2][0].should.be.exactly('kjærsti');
      vec[3][0].should.be.exactly('ståle');
      vec[4][0].should.be.exactly('synnøve');
      vec[5][0].should.be.exactly('words');
    })
    it('should be possible to manipulate stopwords', function() {
      var text = "some.,|words|like\nståle-synnøve's Kjærsti,|.Gerät Kjærsti Grünnerløkka Kjærsti";
      var options = {}
      options.stp = tv.getStopwords();
      options.stp.push('ståle');
      options.separator = /[\|' \.,\-|(\n)]+/;
      var vec = tv.getVector(text, options);
      vec[0][0].should.be.exactly('gerät');
      vec[1][0].should.be.exactly('grünnerløkka');
      vec[2][0].should.be.exactly('kjærsti');
      vec[3][0].should.be.exactly('synnøve');
      vec[4][0].should.be.exactly('words');
    })
    it('should be possible to get a vector from a string of only one token', function() {
      var text = "1999";
      var options = {}
      options.stp = tv.getStopwords();
      options.stp.push('ståle');
      options.separator = /[\|' \.,\-|(\n)]+/;
      var vec = tv.getVector(text, options);
      vec[0][0].should.be.exactly('1999');
      vec[0][1].should.be.exactly(1);
    })
    it('should be possible to do ngrams of length 2', function() {
      var text = "one two one two three two one three one two three four one two three four";
      var options = {}
      options.stopwords = "";
      options.nGramLength = 2;
      var vec = tv.getVector(text, options);
      vec[0][0].should.be.exactly('four one');
      vec[1][0].should.be.exactly('one three');
      vec[2][0].should.be.exactly('one two');
      vec[3][0].should.be.exactly('three four');
      vec[4][0].should.be.exactly('three one');
      vec[5][0].should.be.exactly('three two');
      vec[6][0].should.be.exactly('two one');
      vec[7][0].should.be.exactly('two three');
      vec[0][1].should.be.exactly(1);
      vec[1][1].should.be.exactly(1);
      vec[2][1].should.be.exactly(4);
      vec[3][1].should.be.exactly(2);
      vec[4][1].should.be.exactly(1);
      vec[5][1].should.be.exactly(1);
      vec[6][1].should.be.exactly(2);
      vec[7][1].should.be.exactly(3);
    })
    it('should be possible to do ngrams of length 3', function() {
      var text = "one two one two three two one three one two three four one two three four";
      var options = {}
      options.stopwords = "";
      options.nGramLength = 3;
      var vec = tv.getVector(text, options);
      vec[0][0].should.be.exactly('four one two');
      vec[1][0].should.be.exactly('one three one');
      vec[2][0].should.be.exactly('one two one');
      vec[3][0].should.be.exactly('one two three');
      vec[4][0].should.be.exactly('three four one');
      vec[5][0].should.be.exactly('three one two');
      vec[6][0].should.be.exactly('three two one');
      vec[7][0].should.be.exactly('two one three');
      vec[8][0].should.be.exactly('two one two');
      vec[9][0].should.be.exactly('two three four');
      vec[10][0].should.be.exactly('two three two');
      vec[0][1].should.be.exactly(1);
      vec[1][1].should.be.exactly(1);
      vec[2][1].should.be.exactly(1);
      vec[3][1].should.be.exactly(3);
      vec[4][1].should.be.exactly(1);
      vec[5][1].should.be.exactly(1);
      vec[6][1].should.be.exactly(1);
      vec[7][1].should.be.exactly(1);
      vec[8][1].should.be.exactly(1);
      vec[9][1].should.be.exactly(2);
      vec[10][1].should.be.exactly(1);
    })
  })
  describe('error handling', function(){
    it('should return throw an error if nGramLength is 0', function(){
      (function(){
        var text = "one two one two three two one three one two three four one two three four";
        var options = {}
        options.stopwords = "";
        options.nGramLength = 0;
        var vec = tv.getVector(text, options);
      }).should.throw();
    }),
    it('should return throw an error if specified language is not supported', function(){
      (function(){
        tv.getStopwords('xx')
      }).should.throw();
    })
  })
})
