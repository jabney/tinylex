const TinyLex = require('../index')

const KEYWORDS = [
  'summon', 'forge', 'craft', 'wield', 'if', 'while', 'true', 'false', 'nil'
]

const KEYWORD = new RegExp(`^(?:${KEYWORDS.join('|')})`)
const COMMENT = /^\s*(#.*)\n/
const IDENTIFIER = /^[a-z]\w*/
const NUMBER = /^(?:\+|-)?(?:\.)?\d+\.?(?:\d+)?/
const STRING_SINGLE = /^'([^']*)'/
const STRING_DOUBLE = /^"([^"]*)"/
const LOGICAL = /^(?:\|\||&&|==|!=|<=|>=)/
const WHITESPACE = /^\s/

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

  const rules = [
    [COMMENT, 'COMMENT'],
    [KEYWORD, 0],
    [IDENTIFIER, 'IDENTIFIER'],
    [NUMBER, 'NUMBER'],
    [LOGICAL, 0],
    [STRING_SINGLE, 'STRING'],
    [STRING_DOUBLE, 'STRING'],
    [WHITESPACE]
  ]

  const lexer = new TinyLex(code, rules, { throwOnMismatch: false })

  return lexer
}

module.exports = lexa
