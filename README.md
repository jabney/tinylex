# tinylex
A simple iterative lexer written in TypeScript

**Under development**

Install:

```bash
npm install tinylex
```

Import:

```javascript
const lexer = require('tinylex')
```

Code:

```javascript
const code = `
#
# Darklord source
#
summon "messenger"

forge harken(msg) {
  messenger(msg || 'All shall flee before me!')
}

craft lieutenants = 12
craft message = "I have " + leutenants + " servants"

harken.wield(message)
`
```

Rules:

```javascript
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
  [STRING_DOUBLE, 'STRING'],
  [STRING_SINGLE, 'STRING'],
  [WHITESPACE]
]
```

Instantiate:

```javascript
const lexer = new TinyLex(code, rules)
```

Consume:

```javascript
for (let token of lexer) {
  console.log(token)
}
```

or

```javascript
while(!lexer.done()) {
  console.log(lexer.lex())
}
```

or

```javascript
const tokens = [...lexer]
console.log(tokens)
```

or

```javascript
const tokens = lexer.tokenize()
console.log(tokens)
```

Result:

```javascript
// ------------------------------------------------------------------
// generated tokens
//
[ 'COMMENT', '#' ]
[ 'COMMENT', '# Darklord source' ]
[ 'COMMENT', '#' ]
[ 'SUMMON', 'summon' ]
[ 'STRING', 'messenger' ]
[ 'FORGE', 'forge' ]
[ 'IDENTIFIER', 'harken' ]
[ '(', '(' ]
[ 'IDENTIFIER', 'msg' ]
[ ')', ')' ]
[ '{', '{' ]
[ 'IDENTIFIER', 'messenger' ]
[ '(', '(' ]
[ 'IDENTIFIER', 'msg' ]
[ '||', '||' ]
[ 'STRING', 'All shall flee before me!' ]
[ ')', ')' ]
[ '}', '}' ]
[ 'CRAFT', 'craft' ]
[ 'IDENTIFIER', 'lieutenants' ]
[ '=', '=' ]
[ 'NUMBER', '12' ]
[ 'CRAFT', 'craft' ]
[ 'IDENTIFIER', 'message' ]
[ '=', '=' ]
[ 'STRING', 'I have ' ]
[ '+', '+' ]
[ 'IDENTIFIER', 'leutenants' ]
[ '+', '+' ]
[ 'STRING', ' servants' ]
[ 'IDENTIFIER', 'harken' ]
[ '.', '.' ]
[ 'WIELD', 'wield' ]
[ '(', '(' ]
[ 'IDENTIFIER', 'message' ]
[ ')', ')' ]
[ 'EOF', 'EOF' ]
```

## Rules

```javascript
const rules = [
  [COMMENT, 'COMMENT'],       // ['COMMENT', '# Darklord source']
  [KEYWORD, 0],               // ['SUMMON', 'summon']
  [IDENTIFIER, 'IDENTIFIER'], // ['IDENTIFIER', 'harken']
  [NUMBER, 'NUMBER'],         // ['NUMBER', '12']
  [LOGICAL, 0],               // ['||', '||']
  [STRING_DOUBLE, 'STRING'],  // ['STRING', 'messenger']
  [STRING_SINGLE, 'STRING'],  // ['STRING', 'All shall flee...']
  [WHITESPACE]
]
```

Rules can be specified in the form `[RegExp, string|number|function|null|undefined]`

`RegExp`: the match criteria specified as a regular expression object.

`string`: the name of the token, e.g., `'COMMENT'` as in `[COMMENT, 'COMMENT']`. The token content is taken from match group 0 (the lexeme) of the RegExp match object which produces the token `['COMMENT', '# Darklord source']`. If the RegExp contains a match group, then match group 1 is used, as is the case for the RegExp used for the string rules, e.g., `/^"([^"]*)"/`, which captures the portion of the match between the quotes. This only works for match group 1.

`number`: the number of the match group to use for both the token name and content, as in `[KEYWORD, 0]` which produces the token `['SUMMON', 'summon']`. This means that if your regular expression contains a match group, you can use it to geneerate the name and value for the token: `[SOME_REGEXP, 1]`.

`null|undefined`: no token should be created from the match - effectively discards the match altogether, as in `[WHITESPACE]` which swallows whitespace with no other effect. The cursor is advanced by the length of the lexeme (match group 0).

`function`: a function used to create the token, discard the match, and/or advance the cursor by some positive, non-zero integer amount (`TinyLex` advances the cursor to avoid infinite loops). Functions here can also push multiple tokens if desired. If the function returns `null` or `undefined`, the cursor is advanced by the length of the lexeme (match group 0). If the function returns a number <= 1, the cursor is advanced by one. The function's `this` context is set to the lexer instance.

```javascript
// We could use a function to swallow whitespace.
[WHITESPACE, function (match, tokens, chunk) {
  // Advance the cursor by one. If we don't return a number, the
  // cursor is advanced by the size of the lexeme (match group 0),
  // so in this case returning 1 is no different from returning
  // null or undefined.
  return 1
}]
```

```javascript
// We could use a function customize the token in some way.
[LOGICAL, function (match, tokens, chunk) {
  const lexeme = match[0]
  switch (lexeme) {
    case '&&': tokens.push(['OPERATOR', '&&']); break
    case '||': tokens.push(['OPERATOR', '||']); break
    default: tokens.push([lexeme, lexeme])
  }

  // We don't actually need to do this because by default the
  // cursor is advanced by the lexeme length (match group 0).
  return lexeme.length
}]
```

## The `onToken` Function

This function, if given, is called for every token. It can modify the contents of the token, return an entirely new token, or discard some or all tokens (except for the final `EOF` token). `onToken` can be utilized by calling `lexer.onToken` and passing a function definition. This function is called with its `this` context set to the lexer instance.

```javascript
const lexer = new TinyLex(code, rules)

// The callback function will have it's 'this' context set
// to the lexer instance.
lexer.onToken(function (token, match) {
  // We can return a new token, the original token, a modified
  // version of the given token, or nothing at all - in which case
  // the token will be discarded except for the EOF token.
  return token
})
```
