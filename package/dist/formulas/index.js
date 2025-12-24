var k = (e) => {
  throw TypeError(e);
};
var A = (e, i, t) => i.has(e) || k("Cannot " + t);
var r = (e, i, t) => (A(e, i, "read from private field"), t ? t.call(e) : i.get(e)), o = (e, i, t) => i.has(e) ? k("Cannot add the same private member more than once") : i instanceof WeakSet ? i.add(e) : i.set(e, t), h = (e, i, t, s) => (A(e, i, "write to private field"), s ? s.call(e, t) : i.set(e, t), t), x = (e, i, t) => (A(e, i, "access private method"), t);
import { ReactiveModel as B } from "../node_modules/.pnpm/@beyond-js_reactive@2.2.0/node_modules/@beyond-js/reactive/dist/model/index/index.js";
import { Lexer as C } from "./helpers/lexer/index.js";
import { Parser as T } from "./helpers/parser/index.js";
import { FormulaBasic as j } from "./variants/basic/index.js";
import { FormulaConditional as M } from "./variants/conditional/index.js";
import { FormulaPerValue as N } from "./variants/per-value/index.js";
import { FormulaComparison as R } from "./variants/comparison/index.js";
import { FormulaArray as I } from "./variants/array-formula/index.js";
import { IterativeArrayFormula as L } from "./variants/iterative-array/index.js";
var d, b, w, n, p, g, v, m, u, l, F, E;
const P = class P extends B {
  constructor(t, s) {
    super();
    o(this, F);
    o(this, d, new C(!0));
    o(this, b);
    o(this, w);
    o(this, n);
    o(this, p);
    o(this, g);
    o(this, v, []);
    o(this, m, /* @__PURE__ */ new Map());
    o(this, u);
    o(this, l);
    h(this, u, t), h(this, n, s), x(this, F, E).call(this);
  }
  get tokens() {
    return r(this, b);
  }
  get parser() {
    return r(this, w);
  }
  get formula() {
    return r(this, n).formula;
  }
  get name() {
    return r(this, n).name;
  }
  get conditional() {
    return typeof r(this, n).formula == "object";
  }
  get conditions() {
    return typeof r(this, n).formula == "string" ? void 0 : r(this, n).formula.conditions;
  }
  /**
   *  Represents the fields defined in the plugin settings
   */
  get fields() {
    const t = this.formula;
    return typeof (t == null ? void 0 : t.fields) == "string" ? [t == null ? void 0 : t.fields] : t == null ? void 0 : t.fields;
  }
  get parsedBase() {
    return r(this, p);
  }
  get type() {
    return r(this, g);
  }
  get base() {
    return r(this, n).formula.base;
  }
  get variables() {
    return r(this, v);
  }
  get value() {
    return r(this, l).value;
  }
  initialize() {
    r(this, l).initialize();
  }
  /**
   * Returns the models that are part of the formula
   * The models could be fields or formulas
   * @param variables
   * @returns
   */
  getModels(t) {
    return (Array.isArray(t) ? t : [t]).map((a) => r(this, u).formulas.has(a) ? r(this, u).formulas.get(a) : r(this, u).form.getField(a));
  }
  getType() {
    const { type: t, formula: s } = r(this, n);
    if (t) return t;
    if (typeof s == "string") return "basic";
    if (s.conditions) return s.base ? "base-conditional" : "value-conditions";
  }
  processConditional() {
    this.formula, this.base && h(this, p, this.getParser({ formula: this.base }));
  }
  calculate() {
    !r(this, l) || r(this, l).calculate, r(this, l).calculate(), this.trigger("change");
  }
  /**
   * Returns the parser for the formula, if the parser is already created it will return the memoized parser
   *
   *
   * The formula is tokenized and parsed to create a parser instance
   * the object returned contains the tokens, the parser and the formula
   * @param data Receives the formula to be parsed
   * @returns
   */
  getParser(t) {
    if (!t.formula) throw new Error("To get a parser you must provide a formula");
    if (r(this, m).has(t.formula)) return r(this, m).get(t.formula);
    const s = r(this, d).tokenize(t.formula), a = new T(s), f = { tokens: s, parser: a, ...t };
    return r(this, m).set(t.formula, f), f;
  }
  async getParams(t) {
    const s = {}, { form: a, formulas: f } = r(this, u), $ = async (c) => {
      const y = f.has(c) ? f.get(c) : a.getField(c);
      if (!y)
        throw new Error(`Field ${c} used in formula ${this.name}, not found in form ${a.name}, `);
      await y.isReady, s[c] = [void 0, "", null, NaN].includes(y.value) ? 0 : y.value;
    };
    return t.forEach($), s;
  }
  /**
   * A form can have multiple formulas, this method will create an instance of the formula manager
   * and memoize it to avoid creating multiple instances of the same formula.
   * @param specs
   * @returns
   */
  static async create(t, s) {
    return new P(t, s);
  }
};
d = new WeakMap(), b = new WeakMap(), w = new WeakMap(), n = new WeakMap(), p = new WeakMap(), g = new WeakMap(), v = new WeakMap(), m = new WeakMap(), u = new WeakMap(), l = new WeakMap(), F = new WeakSet(), E = function() {
  h(this, g, this.getType());
  const t = {
    basic: j,
    "base-conditional": M,
    "value-conditions": N,
    comparison: R,
    array: I,
    "iterative-array": L
  };
  if (!t[this.type])
    throw new Error(`this type ${this.type} not found`);
  h(this, l, new t[this.type](this, r(this, u), r(this, n)));
};
let z = P;
export {
  z as FormulaManager
};
//# sourceMappingURL=index.js.map
