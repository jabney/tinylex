const TinyLex = require('../index')

const KEYWORDS = ['def', 'class', 'if', 'while', 'true', 'false', 'nil']

const KEYWORD = new RegExp(`^(?:${KEYWORDS.join('|')})`)
const COMMENT = /^\s*(#.+)\n/
const IDENTIFIER = /^[a-z]\w*/
const CONSTANT = /^[A-Z]\w*/
const NUMBER = /^(?:\+|-)?(?:\.)?\d+\.?(?:\d+)?/
const STRING_SINGLE = /^'([^']*)'/
const STRING_DOUBLE = /^"([^"]*)"/
const BLOCK = /^:\n( +)/
const INDENT = /^\n( *)/
const LOGICAL = /^(?:\|\||&&|==|!=|<=|>=)/
const SPACE = /^ /
const SINGLE = /^[\S\s]/

/**
 * @typedef {RegExpMatchArray} Match
 * @typedef {[string, string]} Token
 *
 * @typedef {Object} Rule
 * @property {RegExp} regex
 * @property {(match: Match, tokens: Token[], chunk: string) => number} [onRule]
 */

/**
 * Lex Awesome
 *
 * @param {string} code
 */
function lexa(code) {
  const indentStack = []
  let currentIndent = 0

  const rules = [
    [COMMENT, 'COMMENT'],
    [KEYWORD, 0],
    [IDENTIFIER, 'IDENTIFIER'],
    [CONSTANT, 'CONSTANT'],
    [NUMBER, 'NUMBER'],
    [LOGICAL, 0],
    [STRING_SINGLE, 'STRING'],
    [STRING_DOUBLE, 'STRING'],
    [SPACE],

    [BLOCK, function (match, tokens) {
      const indent = match[1]
      if (indent.length <= currentIndent) {
        throw new Error(`Bad indent level: got ${indent.length} expected > ${currentIndent}`)
      }
      currentIndent = indent.length
      indentStack.push(currentIndent)
      tokens.push(['INDENT', indent.length.toString()])
    }],

    [INDENT, function (match, tokens) {
      const indent = match[1]
      if (indent.length === currentIndent) {
        tokens.push(['NEWLINE', '\n'])
      } else if (indent.length < currentIndent) {
        while (indent.length < currentIndent) {
          indentStack.pop()
          currentIndent = indentStack[indentStack.length -1] || 0
          tokens.push(['DEDENT', indent.length.toString()])
        }
        tokens.push(['NEWLINE', '\n'])
      } else {
        throw new Error(
          'Bad indent: cannot increase indent without block ":"')
      }
    }]
  ]

  const lexer = new TinyLex(code, rules, { throwOnMismatch: false })

  return lexer
}

module.exports = lexa
