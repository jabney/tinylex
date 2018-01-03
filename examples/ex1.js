const TinyLex = require('../index')

const KEYWORDS = [
  'summon', 'forge', 'craft', 'wield',
  'if', 'while', 'true', 'false', 'null'
]

const KEYWORD = new RegExp(`^(?:${KEYWORDS.join('|')})`)
const COMMENT = /^\s*(#.*)\n/
const IDENTIFIER = /^[a-z]\w*/
const NUMBER = /^(?:\+|-)?(?:\.)?\d+\.?(?:\d+)?/
const STRING_SINGLE = /^'([^']*)'/
const STRING_DOUBLE = /^"([^"]*)"/
const LOGICAL = /^(?:\|\||&&|==|!=|<=|>=)/
const WHITESPACE = /^\s/

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

const code = `
#
# Darklord source
#
summon "messenger"

forge harken(msg) {
  messenger(msg || 'All shall flee before me!')
}

craft lieutenants = 12
craft message: "I have " + leutenants + " servants"

harken.wield(message)
`

const lexer = new TinyLex(code, rules)

lexer.onToken((token, match) => {
  // Intercept and modify tokens here or return a new one.
  // The EOF token cannot be modified and its match will be null.
  // if (token[0] === 'CRAFT') {
  //   return ['CRAFTY', 'crafty']
  // }
})

// Consume the lexer.
for (let token of lexer) {
  console.log(token)
}

// or

while(!lexer.done()) {
  console.log(lexer.lex())
}

// or

console.log([...lexer])

// or

console.log(lexer.tokenize())
