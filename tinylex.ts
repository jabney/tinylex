export type Match = RegExpExecArray
export type Token = [string, string]

export interface Rule {
  regex: RegExp,
  onRule?: (match: Match, tokens: Token[], chunk: string) => number
}

export type Ruleset = Rule[]

export interface Options {
  throwOnMismatch: boolean
}

const opts: Options = {
  throwOnMismatch: false
}

export class TinyLex {
  public _code: string
  public _rules: Rule[]
  public _options: any
  public _start: number
  public _tokens: Token[]

  constructor(code: string, rules: Ruleset, options: Options = opts) {
    if (!(Array.isArray(rules) && rules.length)) {
      throw new Error(
        'Invalid ruleset: rules must be a non-zero length array')
    }
    this._code = code
    this._rules = rules
    this._options = options
    this._start = 0
    this._tokens = []
  }

  /**
   * Return true if the lexer is consumed.
   */
  done() {
    return !this._code || this._start >= this._code.length
  }

  lex() {
    if (this.done()) {
      throw new Error('lexer consumed')
    }

    if (this._tokens.length) {
      return this._tokens.pop()
    }

    // Process input while there aren't any tokens and we
    // haven't reached the end.
    while(!this._tokens.length && this._start < this._code.length) {
      const chunk = this._code.slice(this._start)
      const len = this._rules.length

      let rule, match
      // Process rules in order to find a match.
      for (let i = 0; i < len; i++) {
        rule = this._rules[i]
        match = rule[0].exec(chunk)
        if (match) { break }
      }

      if (match) {
        const tokens = []
        const specifier = rule[1]

        if (typeof specifier === 'string') {
          tokens.push([specifier, match[1] || match[0]])
          this._start += match[0].length
        }

        else if (typeof specifier === 'number') {
          const value = match[specifier]
          tokens.push([value.toLocaleUpperCase(), value])
          this._start += match[0].length
        }

        else if (typeof specifier === 'function') {
          const num = specifier(match, tokens, chunk)
          const size = match[0].length
          this._start += typeof num === 'number' ? (num || size) : size
        }

        else if (specifier == null) {
          this._start += match[0].length
        }
        this._tokens = tokens.reverse()
      }

      // Match not found.
      else {
        if (this._options.throwOnMismatch) {
          throw new Error('lex error: match not found for chunk:' + chunk.slice(0, 32))
        } else {
          const char = chunk.slice(0, 1)
          this._tokens.push([char.toLocaleLowerCase(), char])
          this._start += 1
        }
      }

      if (this._tokens.length) {
        return this._tokens.pop()
      }
    }
  }

  tokenize() {
    return [...this]
  }

  next() {
    return {
      next: () => ({
        done: this.done(), value: !this.done() && this.lex()
      })
    }
  }

  [Symbol.iterator]() { return this.next() }

  _currentLine() {
    const stripped = this._code.replace(/\n/g, '')
    return this._code.length - stripped.length + 1
  }
}
