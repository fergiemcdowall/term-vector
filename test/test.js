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
  })
})
