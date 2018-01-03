export type Match = RegExpExecArray
export type Token = [string, string]
export type RuleFn = (match: Match, tokens: Token[], chunk: string) => number|void
export type Rule = [RegExp, string|number|RuleFn]|[RegExp]
export type RuleMatch = [Rule, Match]
export type Ruleset = Rule[]
export type OnToken = (token: Token) => void

export interface Options {
  throwOnMismatch: boolean
}

const opts: Options = {
  throwOnMismatch: false
}

export class TinyLex {
  private _code: string
  private _rules: Rule[]
  private _options: Options
  private _start: number
  private _tokens: Token[]
  private _onToken: OnToken

  constructor(code: string, rules: Ruleset, options: Options = opts) {
    if (!(Array.isArray(rules))) {
      throw new Error(
        'Invalid ruleset: rules must be a non-zero length array')
    }
    this._code = code
    this._rules = rules
    this._options = options
    this._start = 0
    this._tokens = []
    this._onToken = () => {}
  }

  onToken(fn: OnToken): this {
    this._onToken = fn
    return this
  }

  /**
   * Return true if the lexer is consumed.
   */
  done(): boolean {
    const _done = !this._code || this._start >= this._code.length
    if (_done) { this._destroy() }
    return _done
  }

  /**
   * Return a single lexer match or eof.
   */
  lex(): Token {
    while(!this.done()) {
      const token = this._scan()
      if (token) {
        this._onToken(token)
        return token
      }
    }
    const eofToken: Token = ['EOF', 'EOF']
    this._onToken(eofToken)
    return eofToken
  }

  /**
   * Consume the lexer and return a list of its tokens.
   */
  tokenize(): Token[] {
    return [...this]
  }

  /**
   * Lexer scan method.
   */
  private _scan(): Token {
    // Process input while there aren't any tokens and we
    // haven't reached the end.
    while(!this._tokens.length && this._start < this._code.length) {
      const chunk = this._code.slice(this._start)
      const len = this._rules.length

      const [rule, match] = this._testRuleSet(chunk)

      if (match) {
        if (!this._handleMatches(rule, match, chunk)) {
          return null
        }
      } else {
        if (this._options.throwOnMismatch) {
          throw new Error(`lex error:${this._currentLine()}`
            + `\n  match not found for chunk:`
            + ` "${chunk.replace(/\s+/g, ' ').slice(0, 32)}..."`)
        } else {
          const char = chunk.slice(0, 1)
          this._tokens.push([char.toLocaleUpperCase(), char])
          this._start += 1
        }
      }
    }

    if (this._tokens.length) {
      return this._tokens.pop()
    }
  }

  /**
   * Javascript iterator method.
   */
  next() {
    return {
      next: () => ({
        done: this.done(), value: !this.done() && this.lex()
      })
    }
  }

  /**
   * Javascript iterable protocol.
   */
  [Symbol.iterator]() { return this.next() }

  /**
   * Iterate the ruleset and return a match if found.
   */
  private _testRuleSet(chunk: string): RuleMatch {
    const len = this._rules.length
    // Process rules in order to find a match.
    for (let i = 0; i < len; i++) {
      const rule = this._rules[i]
      const match = rule[0].exec(chunk)
      if (match) { return [rule, match] }
    }
    return [null, null]
  }

  /**
   * Handle a lexer match.
   */
  private _handleMatches(rule: Rule, match: Match, chunk: string): boolean {
    const tokens = []
    const specifier = rule[1]

    if (typeof specifier === 'string') {
      tokens.push([specifier, match[1] != null ? match[1] : match[0]])
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
      this._start += typeof num === 'number'
        ? (Math.floor(Math.abs(num)) || size) : size
    }

    else if (specifier == null) {
      this._start += match[0].length
      // A token was not added.
      return false
    }

    this._tokens = this._tokens.concat(tokens.reverse())

    // A token may have been added.
    return tokens.length ? true : false
  }

  /**
   * Return the current line number based on the lexer progress.
   */
  private _currentLine(): number {
    const lines = this._code.slice(0, this._start)
      .split('\n')
    return lines.length
  }

  /**
   * Clear member variable referneces.
   */
  private _destroy(): void {
    this._code = this._rules = this._tokens = null
    this._onToken = null
  }
}
