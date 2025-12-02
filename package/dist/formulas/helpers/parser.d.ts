import { Token } from './token';
/**
 * The Parser class is responsible for parsing a sequence of tokens into an abstract syntax tree (AST).
 * The tokens should be an array of objects with `type` and `value` properties.
 *
 * The Parser handles mathematical expressions and ensures that the tokens are in the correct order
 * for later evaluation. It understands variables, numbers, and parentheses, and is extendable to support
 * additional operations and precedence rules.
 *
 * Example usage:
 * ```
 * const tokens: Token[] = [...];
 * const parser = new Parser(tokens);
 * const ast = parser.parse();
 * ```
 */
export declare class Parser {
    private tokens;
    private currentTokenIndex;
    constructor(tokens: Token[]);
    parse(): Token | undefined;
    private parseExpression;
}
//# sourceMappingURL=parser.d.ts.map