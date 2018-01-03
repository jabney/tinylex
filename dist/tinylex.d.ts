export declare type Match = RegExpExecArray;
export declare type Token = [string, string];
export declare type RuleFn = (match: Match, tokens: Token[], chunk: string) => number | void;
export declare type Rule = [RegExp, string | number | RuleFn] | [RegExp];
export declare type RuleMatch = [Rule, Match];
export declare type Ruleset = Rule[];
export declare type OnToken = (token: Token, match: Match) => Token | string;
export declare type ErrorAction = 'throw' | 'tokenize' | 'ignore';
export interface Options {
    onError: ErrorAction;
}
export declare class TinyLex {
    private _code;
    private _rules;
    private _options;
    private _start;
    private _tokens;
    private _onToken;
    private _lastMatch;
    private _errorAction;
    constructor(code: string, rules: Ruleset, options?: Options);
    onToken(fn: OnToken): this;
    done(): boolean;
    lex(): Token | string;
    tokenize(): (Token | string)[];
    private _scan();
    next(): {
        next: () => {
            done: boolean;
            value: string | [string, string];
        };
    };
    [Symbol.iterator](): {
        next: () => {
            done: boolean;
            value: string | [string, string];
        };
    };
    private _testRuleSet(chunk);
    private _handleMatch(rule, match, chunk);
    private _handleError(chunk);
    private _tokenizeChar(chunk);
    private _getErrorStr(chunk);
    private _lineAndCol();
    private _destroy();
}
