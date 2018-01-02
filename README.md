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
craft message: "I have " + leutenants + " servants"

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
  [STRING_SINGLE, 'STRING'],
  [STRING_DOUBLE, 'STRING'],
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
console.log([...lexer])
```

or

```javascript
lexer.tokenize()
```

Result:

```javascript
// --------------------------------------------------------------------
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
[ ':', ':' ]
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
