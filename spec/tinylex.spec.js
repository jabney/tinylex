'use strict'
var assert = require('assert')
var TinyLex = require('../index')
var code = require('./source/darklord')
var rules = require('./rules/darklord')
var keywords = require('./rules/darklord.keywords')

describe('TinyLex lexing', function () {
  var lexer

  beforeEach(function () {
    lexer = new TinyLex(code, rules)
  })

  it('produces thirty-seven tokens from darklord source', function () {
    var tokens = lexer.tokenize()
    assert.equal(tokens.length, 37)
  })

  it('produces three comment tokens', function () {
    var tokens = lexer.tokenize().filter(function (token) {
      return token[0] === 'COMMENT'
    })
    assert.equal(tokens.length, 3)
  })

  it ('produces four string tokens', function () {
    var tokens = lexer.tokenize().filter(function (token) {
      return token[0] === 'STRING'
    })
    assert.equal(tokens.length, 4)
  })

  it ('produces five keyword tokens', function () {
    var tokens = lexer.tokenize().filter(function (token) {
      return keywords.indexOf(token[0].toLowerCase()) >= 0
    })
    assert.equal(tokens.length, 5)
  })

  it ('produces nine identifier tokens', function () {
    var tokens = lexer.tokenize().filter(function (token) {
      return token[0] === 'IDENTIFIER'
    })
    assert.equal(tokens.length, 9)
  })

  it ('produces one number token', function () {
    var tokens = lexer.tokenize().filter(function (token) {
      return token[0] === 'NUMBER'
    })
    assert.equal(tokens.length, 1)
  })

  it ('produces two concatenation tokens', function () {
    var tokens = lexer.tokenize().filter(function (token) {
      return token[0] === '+'
    })
    assert.equal(tokens.length, 2)
  })

  it ('produces six paren tokens', function () {
    var tokens = lexer.tokenize().filter(function (token) {
      return token[0] === '(' || token[0] === ')'
    })
    assert.equal(tokens.length, 6)
  })

  it ('produces two bracket tokens', function () {
    var tokens = lexer.tokenize().filter(function (token) {
      return token[0] === '{' || token[0] === '}'
    })
    assert.equal(tokens.length, 2)
  })

  it ('produces two assignment tokens', function () {
    var tokens = lexer.tokenize().filter(function (token) {
      return token[0] === '='
    })
    assert.equal(tokens.length, 2)
  })
})

describe('TinyLex errors', function () {
  it('produces twenty-four tokens when onError is set to "ignore"', function () {
    var lexer = new TinyLex(code, rules, {onError: 'ignore'})
    var tokens = lexer.tokenize()
    assert.equal(tokens.length, 24)
  })

  it('throws when onError is set to "throw"', function () {
    var lexer = new TinyLex(code, rules, {onError: "throw"})
    assert.throws(function () { lexer.tokenize() })
  })

  it ('throws when lex is called on a consumed lexer', function () {
    var lexer = new TinyLex(code, rules, {onError: "ignore"})
    lexer.tokenize()
    assert.throws(function () { lexer.lex() })
    var lexer = new TinyLex(code, rules, {onError: "tokenize"})
    lexer.tokenize()
    assert.throws(function () { lexer.lex() })
  })

  it('does not crash when code and rules are omitted', function () {
    const lexer = new TinyLex()
    let tokens
    assert.doesNotThrow(function () { tokens = lexer.tokenize()})
    assert.equal(tokens.length, 0)
  })
})

describe('TinyLex rule function', function () {
  var altRules

  beforeEach(function () {
    altRules = rules.map(function (rule) {
      return [rule[0], rule[1]]
    })
  })

  it('can replace the contents of tokens', function () {
    var IDENTIFIER = 2
    // Replace the identifier rule specifier with a function.
    altRules[IDENTIFIER][1] = function (match, tokens, chunk) {
      tokens.push(['ID', match[0]])
      return match[0].length
    }
    var lexer = new TinyLex(code, altRules, {})
    var tokens = lexer.tokenize().filter(function (token) {
      return token[0] === 'ID'
    })
    assert.equal(tokens.length, 9)
  })

  it('ignores tokens with no specifier', function () {
    var COMMENT = 0
    altRules[COMMENT][1] = null
    var lexer = new TinyLex(code, altRules)
    var tokens = lexer.tokenize().filter(function (token) {
      return token[0] === 'COMMENT'
    })
    assert.equal(tokens.length, 0)
  })

  it('can remove a token with a function that returns undefined', function () {
    var KEYWORD = 1

    // Should equal 5 before modifying rule.
    var lexer = new TinyLex(code, altRules)
    var tokens = lexer.tokenize().filter(function (token) {
      return keywords.indexOf(token[0].toLowerCase()) >= 0
    })
    assert.equal(tokens.length, 5)

    // Set the keyword rule to a function that returns undefined.
    altRules[KEYWORD][1] = function () {}

    // Should equal 5 before modifying rule.
    var lexer = new TinyLex(code, altRules)
    var tokens = lexer.tokenize().filter(function (token) {
      return keywords.indexOf(token[0].toLowerCase()) >= 0
    })
    assert.equal(tokens.length, 0)
  })

  it('can insert multiple tokens', function () {
    var COMMENT = 0
    altRules[COMMENT][1] = function (match, tokens, chunk) {
      tokens.push(['COMMENT', 'COMMENT'])
      tokens.push(['COMMENT', 'COMMENT'])
    }
    var lexer = new TinyLex(code, altRules)
    var tokens = lexer.tokenize().filter(function (token) {
      return token[0] === 'COMMENT'
    })
    assert.equal(tokens.length, 6)
  })
})

describe('onToken function', function () {
  it('can replace the contents of tokens', function () {
    var lexer = new TinyLex(code, rules)

    lexer.onToken(function (token, match) {
      token[0] = 'REPLACED'
      return token
    })

    var tokens = lexer.tokenize()
    var replaced = tokens.filter(function (token) {
      return token[0] === 'REPLACED'
    })
    assert.equal(replaced.length, 37)
  })
})
