type TokenType = 'variable' | 'number' | 'operator';
type Token = { type: TokenType; value: string };

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
export /*bundle */ class Parser {
	private tokens: Token[];
	private currentTokenIndex: number;

	constructor(tokens: Token[]) {
		this.tokens = tokens;
		this.currentTokenIndex = 0;
	}

	public parse(): Token | undefined {
		return this.parseExpression();
	}

	private parseExpression(): Token | undefined {
		let token = this.tokens[this.currentTokenIndex];
		if (token && token.type === 'variable') {
			this.currentTokenIndex++;
			return token;
		} else if (token && token.type === 'number') {
			this.currentTokenIndex++;
			return token;
		} else if (token && token.value === '(') {
			this.currentTokenIndex++; // Skip '('
			let expr = this.parseExpression(); // Parse subexpression
			if (this.tokens[this.currentTokenIndex] && this.tokens[this.currentTokenIndex].value === ')') {
				this.currentTokenIndex++; // Skip ')'
				return expr;
			}
		}
		// TODO: Add cases for parsing different operations (like addition, multiplication etc.)
		// TODO: Implement precedence handling for different operations
		// This function should be extended to fully construct the AST.
		return undefined;
	}
}
