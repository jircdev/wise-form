import { Lexer } from './lexer';
import { Parser } from './parser';
import { Token } from './token';

type ParserData = {
	parser: Parser;
	tokens: Token[];
	[key: string]: any;
};

export class Formula {
	#lexer = new Lexer();
	#parsers: Map<string, ParserData> = new Map();
	#tokens: Token[];
	constructor(data) {
		if (!data.formula) throw new Error('To get a parser you must provide a formula');
		// if (this.#parsers.has(data.formula)) return this.#parsers.get(data.formula);
		const tokens = this.#lexer.tokenize(data.formula);
		const parser = new Parser(tokens);
		const result = { tokens, parser, ...data };
		this.#parsers.set(data.formula, result);
		return result;
	}

	initialize() {}
}

