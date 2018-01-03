export declare type Match = RegExpExecArray;
export declare type Token = [string, string];
export declare type RuleFn = (match, tokens, chunk: string) => number | void;
export declare type Rule = [RegExp, string | number | RuleFn] | [RegExp];
export declare type RuleMatch = [Rule, Match];
export declare type Ruleset = Rule[];
export interface Options {
    throwOnMismatch: boolean;
}
export declare class TinyLex {
    private _code;
    private _rules;
    private _options;
    private _start;
    private _tokens;
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
