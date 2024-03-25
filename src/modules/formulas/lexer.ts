import { Token } from './token';
import { TokenType } from './types';

/**
 * The Lexer class has been updated to store the original string value of each parenthesis expression
 * and to correctly identify operator tokens.
 */
export /*bundle */ class Lexer {
	private tokenRegex: RegExp = /\s*(\(|\)|\+|\-|\*|\/|\d+\.\d+|\d+|[A-Za-z_][A-Za-z0-9_]*)\s*/g;

	tokenize(formula: string): Token[] {
		this.tokenRegex.lastIndex = 0; // Reset regex state
		const tokens: Token[] = [];
		const stack: Array<{ tokens: Token[]; stringValue: string }> = [{ tokens: [], stringValue: '' }]; // Stack to manage nested expressions
		let m: RegExpExecArray | null;

		while ((m = this.tokenRegex.exec(formula)) !== null) {
			let value = m[1];
			let type: TokenType = this.determineTokenType(value);

			if (type === 'parenthesis') {
				if (value === '(') {
					// Push a new object to the stack to hold the tokens for this subexpression
					stack.push({ tokens: [], stringValue: '' });
				} else {
					// Pop the last object from the stack, which represents the completed subexpression
					let subExpression = stack.pop();
					if (!subExpression) {
						throw new Error('Mismatched parentheses in the formula');
					}
					let stringValue = subExpression.stringValue;
					let subExpressionTokens = subExpression.tokens;
					// The full original string representation of the subexpression is captured in stringValue
					let parenthesisToken = new Token('parenthesis', '()', stringValue, subExpressionTokens);
					// Add the new parenthesis token to the current top of the stack
					stack[stack.length - 1].tokens.push(parenthesisToken);
				}
			} else {
				// Add the new token to the current top of the stack and append the string value if it's a subexpression
				let current = stack[stack.length - 1];
				current.tokens.push(new Token(type, value));
				current.stringValue += value;
			}
		}

		if (stack.length !== 1) {
			throw new Error('Mismatched parentheses in the formula');
		}

		return stack[0].tokens; // The first element in the stack is the array of tokens for the entire formula
	}

	private determineTokenType(value: string): TokenType {
		if (['+', '-', '*', '/'].includes(value)) {
			return 'operator';
		} else if (['(', ')'].includes(value)) {
			return 'parenthesis';
		} else if (!isNaN(parseFloat(value))) {
			return 'number';
		} else {
			return 'variable';
		}
	}
}
