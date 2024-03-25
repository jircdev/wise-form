import { TokenType } from './types';

/**
 * The Token class now includes a stringValue property for storing the original string value
 * of the expression inside the parentheses and an optional parent property for storing the parent token.
 */
export /*bundle*/ class Token {
	type: TokenType;
	value: string;
	stringValue?: string;
	children?: Token[];
	parent?: Token;

	constructor(type: TokenType, value: string, stringValue?: string, children?: Token[], parent?: Token) {
		this.type = type;
		this.value = value;
		this.stringValue = stringValue;
		this.children = children;
		this.parent = parent;
	}
}
