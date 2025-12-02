var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Formula_lexer, _Formula_parsers, _Formula_tokens;
import { Lexer } from './lexer';
import { Parser } from './parser';
export class Formula {
    constructor(data) {
        _Formula_lexer.set(this, new Lexer());
        _Formula_parsers.set(this, new Map());
        _Formula_tokens.set(this, void 0);
        if (!data.formula)
            throw new Error('To get a parser you must provide a formula');
        // if (this.#parsers.has(data.formula)) return this.#parsers.get(data.formula);
        const tokens = __classPrivateFieldGet(this, _Formula_lexer, "f").tokenize(data.formula);
        const parser = new Parser(tokens);
        const result = { tokens, parser, ...data };
        __classPrivateFieldGet(this, _Formula_parsers, "f").set(data.formula, result);
        return result;
    }
    initialize() { }
}
_Formula_lexer = new WeakMap(), _Formula_parsers = new WeakMap(), _Formula_tokens = new WeakMap();
//# sourceMappingURL=formula.js.map