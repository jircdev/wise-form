import { Token } from './token';
import { TokenType } from '../types';

export class Lexer {
	private tokenRegex: RegExp = /\s*(\(|\)|\+|\-|\*|\/|\d+\.\d+|\d+|[A-Za-z_][A-Za-z0-9_]*)\s*/g;
	private flattenTokens: boolean;

	constructor(flattenTokens: boolean = false) {
		this.flattenTokens = flattenTokens;
	}

	tokenize(formula: string): Token[] {
		this.tokenRegex.lastIndex = 0;
		const tokens: Token[] = [];
		const stack: Array<Token[]> = [tokens]; // Stack to manage nested token lists
		let match: RegExpExecArray | null;

		while ((match = this.tokenRegex.exec(formula)) !== null) {
			const tokenValue = match[1];
			let tokenType: TokenType = this.determineTokenType(tokenValue);

			if (tokenType === 'parenthesis') {
				if (tokenValue === '(') {
					if (!this.flattenTokens) {
						// Start a new scope for tokens
						stack.push([]);
					}
				} else {
					if (!this.flattenTokens) {
						// End the current scope
						const subTokens = stack.pop();
						if (!subTokens) {
							throw new Error('Mismatched parentheses in the formula');
						}
						// Create a parenthesis token with these subtokens as children
						const parentTokens = stack[stack.length - 1];
						parentTokens.push(new Token('parenthesis', '()', null, subTokens));
					}
				}
			} else {
				// Add this token to the current scope
				stack[stack.length - 1].push(new Token(tokenType, tokenValue));
			}
		}

		if (stack.length !== 1) {
			throw new Error('Mismatched parentheses in the formula');
		}

		// If flattenTokens is true, flatten all tokens into a single array
		if (this.flattenTokens) {
			return this.flatten(tokens);
		}

		return tokens; // Return the outermost list of tokens
	}

	private determineTokenType(value: string): TokenType {
		const operators = {
			'+': 'operator',
			'-': 'operator',
			'*': 'operator',
			'/': 'operator',
			'(': 'parenthesis',
			')': 'parenthesis',
		};
		return operators[value] || (!isNaN(parseFloat(value)) ? 'number' : 'variable');
	}

	private flatten(tokens: Token[]): Token[] {
		const flatList: Token[] = [];
		for (const token of tokens) {
			if (token.type === 'parenthesis' && token.children) {
				flatList.push(...this.flatten(token.children)); // Flatten nested tokens
			} else {
				flatList.push(token);
			}
		}
		return flatList;
	}
}

