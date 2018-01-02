const fs = require('fs')
const lexa = require('./lexa')

const path = process.argv[2]

const source = fs.readFile(path, (err, buffer) => {
  if (err) { return console.log(err) }
  const lexer = lexa(buffer.toString())
  const tokens = lexer.tokenize()
  print(tokens)
  // console.log(tokens)
})

function print(tokens) {
  let indent = 0

  tokens.forEach((token) => {
    if (token[0] === 'INDENT') {
      indent += 2
    } else if (token[0] === 'DEDENT') {
      indent -= 2
    }
    console.log(' '.repeat(indent), token)
  })
}
