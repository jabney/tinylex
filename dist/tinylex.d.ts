export declare type Match = RegExpExecArray;
export declare type Token = [string, string];
export interface Rule {
    regex: RegExp;
    onRule?: (match: Match, tokens: Token[], chunk: string) => number;
}
export declare type RuleMatch = [Rule, Match];
export declare type Ruleset = Rule[];
export interface Options {
    throwOnMismatch: boolean;
}
export declare class TinyLex {
    _code: string;
    _rules: Rule[];
    _options: any;
    _start: number;
    _tokens: Token[];
    constructor(code: string, rules: Ruleset, options?: Options);
    done(): boolean;
    lex(): Token;
    private _scan();
    tokenize(): Token[];
    next(): {
        next: () => {
            done: boolean;
            value: [string, string];
        };
    };
    [Symbol.iterator](): {
        next: () => {
            done: boolean;
            value: [string, string];
        };
    };
    private _testRuleSet(chunk);
    private _handleMatches(rule, match, chunk);
    private _currentLine();
    private _destroy();
}
