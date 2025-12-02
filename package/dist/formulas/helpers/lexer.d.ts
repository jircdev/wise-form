import { Token } from './token';
export declare class Lexer {
    private tokenRegex;
    private flattenTokens;
    constructor(flattenTokens?: boolean);
    tokenize(formula: string): Token[];
    private determineTokenType;
    private flatten;
}
//# sourceMappingURL=lexer.d.ts.map