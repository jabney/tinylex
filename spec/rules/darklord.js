var keywords = require('./darklord.keywords')

var KEYWORD = new RegExp(`^(?:${keywords.join('|')})`)
var COMMENT = /^\s*(#.*)\n/
var IDENTIFIER = /^[a-z]\w*/
var NUMBER = /^(?:\+|-)?(?:\.)?\d+\.?(?:\d+)?/
var STRING_SINGLE = /^'([^']*)'/
var STRING_DOUBLE = /^"([^"]*)"/
var LOGICAL = /^(?:\|\||&&|==|!=|<=|>=)/
var WHITESPACE = /^\s/

module.exports = [
  [COMMENT, 'COMMENT'],
  [KEYWORD, 0],
  [IDENTIFIER, 'IDENTIFIER'],
  [NUMBER, 'NUMBER'],
  [LOGICAL, 0],
  [STRING_SINGLE, 'STRING'],
  [STRING_DOUBLE, 'STRING'],
  [WHITESPACE]
]
