const fs = require('fs')
const lexd = require('./lexd')

const path = process.argv[2]

fs.readFile(path, (err, buffer) => {
  if (err) { return console.log(err) }
  const lexer = lexd(buffer.toString())
  const tokens = lexer.tokenize()
  print(tokens)
  // console.log(tokens)
})

function print(tokens) {
  tokens.forEach((token) => {
    console.log(token)
  })
}
