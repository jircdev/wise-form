// //your code here
// class Token {
// 	constructor(type, value) {
// 		this.type = type;
// 		this.value = value;
// 	}
// }

// class Lexer {
// 	constructor() {
// 		this.tokenRegex = /\s*(\(|\)|\+|\-|\*|\/|[A-Za-z_][A-Za-z0-9_]*|\d+)\s*/g;
// 	}

// 	tokenize(formula) {
// 		this.tokenRegex.lastIndex = 0; // Reset regex state
// 		let tokens = [];
// 		let m;
// 		while ((m = this.tokenRegex.exec(formula)) !== null) {
// 			let value = m[1];
// 			let type = isNaN(parseFloat(value)) ? 'variable' : 'number';
// 			if (['(', ')', '+', '-', '*', '/'].includes(value)) {
// 				type = 'operator';
// 			}
// 			tokens.push(new Token(type, value));
// 		}
// 		return tokens;
// 	}
// }

// class Parser {
// 	constructor(tokens) {
// 		this.tokens = tokens;
// 		this.currentTokenIndex = 0;
// 	}

// 	parse() {
// 		return this.parseExpression();
// 	}

// 	parseExpression() {
// 		let token = this.tokens[this.currentTokenIndex];
// 		if (token && token.type === 'variable') {
// 			this.currentTokenIndex++;
// 			return token;
// 		} else if (token && token.type === 'number') {
// 			this.currentTokenIndex++;
// 			return token;
// 		} else if (token && token.value === '(') {
// 			this.currentTokenIndex++; // Skip '('
// 			let expr = this.parseExpression(); // Parse subexpression
// 			if (this.tokens[this.currentTokenIndex].value === ')') {
// 				this.currentTokenIndex++; // Skip ')'
// 				return expr;
// 			}
// 		}
// 		// Add cases for parsing different operations (like addition, multiplication etc.)
// 		// You might need to implement a precedence handling for different operations
// 	}
// }

// // Usage
// const formula =
// 	'((totalGraphic * netGraphic) + (discountPercentGraphic * discountAuthorGraphic)) - ((totalDigital * netDigital) * discountPercentDigital)';
// const lexer = new Lexer();
// const tokens = lexer.tokenize(formula);
// const parser = new Parser(tokens);
// const parsedExpression = parser.parse();

// console.log(parsedExpression);
