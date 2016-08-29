/* global describe */
/* global it */

var should = require('should')
var sw = require('stopword')
var tv = require('../')

// TODO: Test for ngram length = 1

describe('general term-vectoriness:', function () {
  it('should return throw an error if input is not an Array', function () {
    (function () { tv.getVector(12213412) }).should.throw()
  })

  it('should make nice term vectors for ascii text', function () {
    var text = 'This is a really, really cool vector. I like this VeCTor'.split(' ')
    var vec = tv.getVector(text)
    vec.should.eql(
      [ [ [ 'I' ], 1 ],
        [ [ 'This' ], 1 ],
        [ [ 'VeCTor' ], 1 ],
        [ [ 'a' ], 1 ],
        [ [ 'cool' ], 1 ],
        [ [ 'is' ], 1 ],
        [ [ 'like' ], 1 ],
        [ [ 'really' ], 1 ],
        [ [ 'really,' ], 1 ],
        [ [ 'this' ], 1 ],
        [ [ 'vector.' ], 1 ]
      ])
  })

  it('should make nice term vectors for ascii text', function () {
    var text = sw.removeStopwords(
      'This is a really, really cool vector. I like this VeCTor'.split(' ')
    )
    var vec = tv.getVector(text)
    vec.should.eql([
      [ [ 'VeCTor' ], 1 ],
      [ [ 'cool' ], 1 ],
      [ [ 'really' ], 1 ],
      [ [ 'really,' ], 1 ],
      [ [ 'vector.' ], 1 ]
    ])
  })

  it('should make nice term vectors for ascii text', function () {
    var text = sw.removeStopwords(
      'This is a really, really cool vector. I like this VeCTor'.split(/[ ,\.]+/)
    )
    var vec = tv.getVector(text)
    vec.should.eql([
      [ [ 'VeCTor' ], 1 ],
      [ [ 'cool' ], 1 ],
      [ [ 'really' ], 2 ],
      [ [ 'vector' ], 1 ]
    ])
  })

  it('should make nice term vectors for ascii text', function () {
    var text = sw.removeStopwords(
      'This is a really, really cool vector. I like this VeCTor'
        .toLowerCase()
        .split(/[ ,\.]+/)
    )
    var vec = tv.getVector(text)
    vec.should.eql([
      [ [ 'cool' ], 1 ],
      [ [ 'really' ], 2 ],
      [ [ 'vector' ], 2 ]
    ])
  })

  it('should make nice term vectors for ascii text when vector length is 1', function () {
    tv.getVector(
      sw.removeStopwords('This is cool'.split(' '))
    ).should.eql([
      [ [ 'cool' ], 1 ]
    ])
  })

  it('should handle words containing non-ascii chars used in european languages', function () {
    tv.getVector(
      sw.removeStopwords(
        'some words like ståle synnøve kjærsti gerät kjærsti grünnerløkka kjærsti'.split(' ')
      )
    ).should.eql([
      [ [ 'gerät' ], 1 ],
      [ [ 'grünnerløkka' ], 1 ],
      [ [ 'kjærsti' ], 3 ],
      [ [ 'ståle' ], 1 ],
      [ [ 'synnøve' ], 1 ],
      [ [ 'words' ], 1 ]
    ])
  })

  it('should be possible to get a vector from a string of only one token', function () {
    var text = '1999'.split(' ')
    tv.getVector(text).should.eql([
      [ [ '1999' ], 1 ]
    ])
  })

  it('should make a vector for a single token if ngram length is longer', function () {
    tv.getVector([ '1' ], {
      gte: 1,
      lte: 3
    }).should.eql([
      [ [ '1' ], 1 ]
    ])
  })

  it('should gracefully return an empty array if ngram length is longer than string length', function () {
    tv.getVector([ '1' ], 3).should.eql([])
  })

  it('should gracefully return an empty array if ngram length is longer than string length', function () {
    tv.getVector([ '1' ], [ 1, 3, 5 ]).should.eql([
      [ [ '1' ], 1 ]
    ])
  })
})

describe('error handling', function () {
  it('should return throw an error if nGramLength is 0', function () {
    (function () {
      var text = 'one two one two three two one three one two three four one two three four'
      var vec = tv.getVector(text, 0)
      should.exist(vec)
    }).should.throw()
  })
})

describe('non-english languages', function () {
  it('should be able to define stopwords in norwegian', function () {
    var text = sw.removeStopwords(
      'Ifølge den franske avisen får Astana heller ikke erstatte Boom med en annen sykkelrytter. Det irriterer Alexandre Vinokourov. – Enten aksepterer UCI (det internasjonale sykkelforbundet) at vi får med en annen rytter, eller så kjører Boom med oss, sier han.'
        .toLowerCase().split(/[\|– .,()]+/), sw.no
    )
    var vec = tv.getVector(text, 1)
    vec.should.eql([
      [ [ 'aksepterer' ], 1 ],
      [ [ 'alexandre' ], 1 ],
      [ [ 'annen' ], 2 ],
      [ [ 'astana' ], 1 ],
      [ [ 'avisen' ], 1 ],
      [ [ 'boom' ], 2 ],
      [ [ 'enten' ], 1 ],
      [ [ 'erstatte' ], 1 ],
      [ [ 'franske' ], 1 ],
      [ [ 'får' ], 2 ],
      [ [ 'heller' ], 1 ],
      [ [ 'ifølge' ], 1 ],
      [ [ 'internasjonale' ], 1 ],
      [ [ 'irriterer' ], 1 ],
      [ [ 'kjører' ], 1 ],
      [ [ 'rytter' ], 1 ],
      [ [ 'sier' ], 1 ],
      [ [ 'sykkelforbundet' ], 1 ],
      [ [ 'sykkelrytter' ], 1 ],
      [ [ 'uci' ], 1 ],
      [ [ 'vinokourov' ], 1 ]
    ])
  })

  it('should be able to define stopwords in norwegian and do ngrams', function () {
    var text = sw.removeStopwords(
      'Ifølge den franske avisen får Astana heller ikke erstatte Boom med en annen sykkelrytter. Det irriterer Alexandre Vinokourov. – Enten aksepterer UCI (det internasjonale sykkelforbundet) at vi får med en annen rytter, eller så kjører Boom med oss, sier han.'
        .toLowerCase().split(/[\|– .,()]+/), sw.no
    )
    var vec = tv.getVector(text, 3)
    vec.should.eql([
      [ [ 'aksepterer', 'uci', 'internasjonale' ], 1 ],
      [ [ 'alexandre', 'vinokourov', 'enten' ], 1 ],
      [ [ 'annen', 'rytter', 'kjører' ], 1 ],
      [ [ 'annen', 'sykkelrytter', 'irriterer' ], 1 ],
      [ [ 'astana', 'heller', 'erstatte' ], 1 ],
      [ [ 'avisen', 'får', 'astana' ], 1 ],
      [ [ 'boom', 'annen', 'sykkelrytter' ], 1 ],
      [ [ 'enten', 'aksepterer', 'uci' ], 1 ],
      [ [ 'erstatte', 'boom', 'annen' ], 1 ],
      [ [ 'franske', 'avisen', 'får' ], 1 ],
      [ [ 'får', 'annen', 'rytter' ], 1 ],
      [ [ 'får', 'astana', 'heller' ], 1 ],
      [ [ 'heller', 'erstatte', 'boom' ], 1 ],
      [ [ 'ifølge', 'franske', 'avisen' ], 1 ],
      [ [ 'internasjonale', 'sykkelforbundet', 'får' ], 1 ],
      [ [ 'irriterer', 'alexandre', 'vinokourov' ], 1 ],
      [ [ 'kjører', 'boom', 'sier' ], 1 ],
      [ [ 'rytter', 'kjører', 'boom' ], 1 ],
      [ [ 'sykkelforbundet', 'får', 'annen' ], 1 ],
      [ [ 'sykkelrytter', 'irriterer', 'alexandre' ], 1 ],
      [ [ 'uci', 'internasjonale', 'sykkelforbundet' ], 1 ],
      [ [ 'vinokourov', 'enten', 'aksepterer' ], 1 ]
    ])
  })
})

describe('ngram stuff', function () {
  it('should be possible to do ngrams of length 2', function () {
    var text = 'one two one two three two one three one two three four one two three four'
      .split(' ')
    var vec = tv.getVector(text, 2)
    vec.should.eql([
      [ [ 'four', 'one' ], 1 ],
      [ [ 'one', 'three' ], 1 ],
      [ [ 'one', 'two' ], 4 ],
      [ [ 'three', 'four' ], 2 ],
      [ [ 'three', 'one' ], 1 ],
      [ [ 'three', 'two' ], 1 ],
      [ [ 'two', 'one' ], 2 ],
      [ [ 'two', 'three' ], 3 ]
    ])
  })

  it('should be possible to do ngrams of length 3', function () {
    var text = 'one two one two three two one three one two three four one two three four'
      .split(' ')
    var vec = tv.getVector(text, 3)
    vec.should.eql([
      [ [ 'four', 'one', 'two' ], 1 ],
      [ [ 'one', 'three', 'one' ], 1 ],
      [ [ 'one', 'two', 'one' ], 1 ],
      [ [ 'one', 'two', 'three' ], 3 ],
      [ [ 'three', 'four', 'one' ], 1 ],
      [ [ 'three', 'one', 'two' ], 1 ],
      [ [ 'three', 'two', 'one' ], 1 ],
      [ [ 'two', 'one', 'three' ], 1 ],
      [ [ 'two', 'one', 'two' ], 1 ],
      [ [ 'two', 'three', 'four' ], 2 ],
      [ [ 'two', 'three', 'two' ], 1 ]
    ])
  })

  it('should be able to return an ngrams for an array of ngram lengths with stopwords', function () {
    var text = sw.removeStopwords(
      'Ifølge den franske avisen får Astana heller ikke erstatte Boom med en annen sykkelrytter. Det irriterer Alexandre Vinokourov. – Enten aksepterer UCI (det internasjonale sykkelforbundet) at vi får med en annen rytter, eller så kjører Boom med oss, sier han'
        .toLowerCase()
        .split(/[\|– .,()$]+/),
      sw.no
    )
    var vec = tv.getVector(text, [1, 3])
    vec.should.eql([
      [ [ 'aksepterer' ], 1 ],
      [ [ 'alexandre' ], 1 ],
      [ [ 'annen' ], 2 ],
      [ [ 'astana' ], 1 ],
      [ [ 'avisen' ], 1 ],
      [ [ 'boom' ], 2 ],
      [ [ 'enten' ], 1 ],
      [ [ 'erstatte' ], 1 ],
      [ [ 'franske' ], 1 ],
      [ [ 'får' ], 2 ],
      [ [ 'heller' ], 1 ],
      [ [ 'ifølge' ], 1 ],
      [ [ 'internasjonale' ], 1 ],
      [ [ 'irriterer' ], 1 ],
      [ [ 'kjører' ], 1 ],
      [ [ 'rytter' ], 1 ],
      [ [ 'sier' ], 1 ],
      [ [ 'sykkelforbundet' ], 1 ],
      [ [ 'sykkelrytter' ], 1 ],
      [ [ 'uci' ], 1 ],
      [ [ 'vinokourov' ], 1 ],
      [ [ 'aksepterer', 'uci', 'internasjonale' ], 1 ],
      [ [ 'alexandre', 'vinokourov', 'enten' ], 1 ],
      [ [ 'annen', 'rytter', 'kjører' ], 1 ],
      [ [ 'annen', 'sykkelrytter', 'irriterer' ], 1 ],
      [ [ 'astana', 'heller', 'erstatte' ], 1 ],
      [ [ 'avisen', 'får', 'astana' ], 1 ],
      [ [ 'boom', 'annen', 'sykkelrytter' ], 1 ],
      [ [ 'enten', 'aksepterer', 'uci' ], 1 ],
      [ [ 'erstatte', 'boom', 'annen' ], 1 ],
      [ [ 'franske', 'avisen', 'får' ], 1 ],
      [ [ 'får', 'annen', 'rytter' ], 1 ],
      [ [ 'får', 'astana', 'heller' ], 1 ],
      [ [ 'heller', 'erstatte', 'boom' ], 1 ],
      [ [ 'ifølge', 'franske', 'avisen' ], 1 ],
      [ [ 'internasjonale', 'sykkelforbundet', 'får' ], 1 ],
      [ [ 'irriterer', 'alexandre', 'vinokourov' ], 1 ],
      [ [ 'kjører', 'boom', 'sier' ], 1 ],
      [ [ 'rytter', 'kjører', 'boom' ], 1 ],
      [ [ 'sykkelforbundet', 'får', 'annen' ], 1 ],
      [ [ 'sykkelrytter', 'irriterer', 'alexandre' ], 1 ],
      [ [ 'uci', 'internasjonale', 'sykkelforbundet' ], 1 ],
      [ [ 'vinokourov', 'enten', 'aksepterer' ], 1 ]
    ])
  })

  it('should be able to return an ngrams for an array of ngram lengths WITHOUT stopwords', function () {
    var text = 'Ifølge den franske avisen får Astana heller ikke erstatte Boom med en annen sykkelrytter. Det irriterer Alexandre Vinokourov. – Enten aksepterer UCI (det internasjonale sykkelforbundet) at vi får med en annen rytter, eller så kjører Boom med oss, sier han'
      .toLowerCase()
      .split(/[\|– .,()]+/)
    var vec = tv.getVector(text, [1, 3])
    vec.should.eql([
      [ [ 'aksepterer' ], 1 ],
      [ [ 'alexandre' ], 1 ],
      [ [ 'annen' ], 2 ],
      [ [ 'astana' ], 1 ],
      [ [ 'at' ], 1 ],
      [ [ 'avisen' ], 1 ],
      [ [ 'boom' ], 2 ],
      [ [ 'den' ], 1 ],
      [ [ 'det' ], 2 ],
      [ [ 'eller' ], 1 ],
      [ [ 'en' ], 2 ],
      [ [ 'enten' ], 1 ],
      [ [ 'erstatte' ], 1 ],
      [ [ 'franske' ], 1 ],
      [ [ 'får' ], 2 ],
      [ [ 'han' ], 1 ],
      [ [ 'heller' ], 1 ],
      [ [ 'ifølge' ], 1 ],
      [ [ 'ikke' ], 1 ],
      [ [ 'internasjonale' ], 1 ],
      [ [ 'irriterer' ], 1 ],
      [ [ 'kjører' ], 1 ],
      [ [ 'med' ], 3 ],
      [ [ 'oss' ], 1 ],
      [ [ 'rytter' ], 1 ],
      [ [ 'sier' ], 1 ],
      [ [ 'sykkelforbundet' ], 1 ],
      [ [ 'sykkelrytter' ], 1 ],
      [ [ 'så' ], 1 ],
      [ [ 'uci' ], 1 ],
      [ [ 'vi' ], 1 ],
      [ [ 'vinokourov' ], 1 ],
      [ [ 'aksepterer', 'uci', 'det' ], 1 ],
      [ [ 'alexandre', 'vinokourov', 'enten' ], 1 ],
      [ [ 'annen', 'rytter', 'eller' ], 1 ],
      [ [ 'annen', 'sykkelrytter', 'det' ], 1 ],
      [ [ 'astana', 'heller', 'ikke' ], 1 ],
      [ [ 'at', 'vi', 'får' ], 1 ],
      [ [ 'avisen', 'får', 'astana' ], 1 ],
      [ [ 'boom', 'med', 'en' ], 1 ],
      [ [ 'boom', 'med', 'oss' ], 1 ],
      [ [ 'den', 'franske', 'avisen' ], 1 ],
      [ [ 'det', 'internasjonale', 'sykkelforbundet' ], 1 ],
      [ [ 'det', 'irriterer', 'alexandre' ], 1 ],
      [ [ 'eller', 'så', 'kjører' ], 1 ],
      [ [ 'en', 'annen', 'rytter' ], 1 ],
      [ [ 'en', 'annen', 'sykkelrytter' ], 1 ],
      [ [ 'enten', 'aksepterer', 'uci' ], 1 ],
      [ [ 'erstatte', 'boom', 'med' ], 1 ],
      [ [ 'franske', 'avisen', 'får' ], 1 ],
      [ [ 'får', 'astana', 'heller' ], 1 ],
      [ [ 'får', 'med', 'en' ], 1 ],
      [ [ 'heller', 'ikke', 'erstatte' ], 1 ],
      [ [ 'ifølge', 'den', 'franske' ], 1 ],
      [ [ 'ikke', 'erstatte', 'boom' ], 1 ],
      [ [ 'internasjonale', 'sykkelforbundet', 'at' ], 1 ],
      [ [ 'irriterer', 'alexandre', 'vinokourov' ], 1 ],
      [ [ 'kjører', 'boom', 'med' ], 1 ],
      [ [ 'med', 'en', 'annen' ], 2 ],
      [ [ 'med', 'oss', 'sier' ], 1 ],
      [ [ 'oss', 'sier', 'han' ], 1 ],
      [ [ 'rytter', 'eller', 'så' ], 1 ],
      [ [ 'sykkelforbundet', 'at', 'vi' ], 1 ],
      [ [ 'sykkelrytter', 'det', 'irriterer' ], 1 ],
      [ [ 'så', 'kjører', 'boom' ], 1 ],
      [ [ 'uci', 'det', 'internasjonale' ], 1 ],
      [ [ 'vi', 'får', 'med' ], 1 ],
      [ [ 'vinokourov', 'enten', 'aksepterer' ], 1 ]
    ])
  })
})
