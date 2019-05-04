export type Match = RegExpExecArray
export type Token = [string, string]
export type RuleFn = (match: Match, tokens: Token[], chunk: string) => number|void
export type Rule = [RegExp, string|number|RuleFn]|[RegExp]
export type RuleMatch = [Rule, Match]
export type Ruleset = Rule[]
export type OnToken = (token: Token, match: Match) => Token|string
export type ErrorAction = 'throw'|'tokenize'|'ignore'

export interface Options {
  onError: ErrorAction
}

const opts: Options = {
  onError: 'tokenize'
}

export class TinyLex {
  private _code: string
  private _rules: Rule[]
  private _options: Options
  private _cursor: number
  private _tokens: Token[]
  private _onToken: OnToken
  private _lastMatch: Match
  private _errorAction: ErrorAction
  private _done: boolean

  constructor(code: string, rules: Ruleset, options: Options = opts) {
    this._code = code || ''
    this._rules = rules || []
    this._cursor = 0
    this._tokens = []
    this._onToken = (token) => { return token }
    this._errorAction = options.onError || 'tokenize'
  }

  onToken(fn: OnToken): this {
    this._onToken = fn
    return this
  }

  /**
   * Return true if the lexer is consumed.
   */
  done(): boolean {
    return this._done
  }

  /**
   * Return a single lexer match or eof.
   */
  lex(): Token|string {
    if (this._done) {
      throw new Error('lexer is consumed')
    }

    while (!this._done) {
      const token = this._scan()
      if (token) {
        const _token = this._onToken(token, this._lastMatch)
        if (_token) { return _token }
      }

      // Check for done condition.
      if (this._cursor >= this._code.length && this._tokens.length === 0) {
        this._done = true
        const eofToken: Token = ['EOF', 'EOF']
        const newToken = this._onToken(eofToken, null)
        return newToken || null
      }
    }
  }

  /**
   * Consume the lexer and return a list of its tokens.
   */
  tokenize(): (Token|string)[] {
    return [...this]
  }

  /**
   * Lexer scan method.
   */
  private _scan(): Token {
    if (this._tokens.length) { return this._tokens.shift() }
    // Process input while there aren't any tokens and we
    // haven't reached the end.
    while(this._cursor < this._code.length) {
      const chunk = this._code.slice(this._cursor)

      const [rule, match] = this._testRuleSet(chunk)

      if (match) {
        this._lastMatch = match
        if (!this._handleMatch(rule, match, chunk)) {
          return null
        }
      } else {
        this._handleError(chunk)
      }
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
  private _handleMatch(rule: Rule, match: Match, chunk: string): boolean {
    const tokens = []
    const specifier = rule[1]

    if (typeof specifier === 'string') {
      tokens.push([specifier, match[1] != null ? match[1] : match[0]])
      this._cursor += match[0].length
    }

    else if (typeof specifier === 'number') {
      const value = match[specifier]
      tokens.push([value.toLocaleUpperCase(), value])
      this._cursor += match[0].length
    }

    else if (typeof specifier === 'function') {
      const num = specifier.call(this, match, tokens, chunk)
      const size = match[0].length
      this._cursor += typeof num === 'number'
        ? (Math.floor(Math.abs(num)) || size) : size
    }

    else if (specifier == null) {
      this._cursor += match[0].length
      // A token was not added.
      return false
    }

    this._tokens.push.apply(this._tokens, tokens)

    // A token may have been added.
    return tokens.length ? true : false
  }

  /**
   * Handle a lex error (no rule found).
   */
  private _handleError(chunk: string) {
    switch(this._errorAction) {
      case 'throw': throw new Error(this._getErrorStr(chunk))
      case 'ignore': this._cursor += 1; break
      default: this._tokenizeChar(chunk)
    }
  }

  /**
   * Tokenize the next single character in the current chunk.
   */
  private _tokenizeChar(chunk: string): void {
    const char = chunk.slice(0, 1)
    this._tokens.push([char.toLocaleUpperCase(), char])
    this._cursor += 1
  }

  /**
   * Get a lex error message.
   */
  private _getErrorStr(chunk: string): string {
    return `lex error:${this._lineAndCol()}`
    + `\n  match not found for chunk:`
    + ` "${chunk.replace(/\s+/g, ' ').slice(0, 32)}..."`
  }

  /**
   * Return the current line and column based on the lexer progress.
   */
  private _lineAndCol(): string {
    const lines = this._code.slice(0, this._cursor).split('\n')
    const col = lines[lines.length - 1].length + 1
    return `${lines.length}:${col}`
  }
}
