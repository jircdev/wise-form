var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _FormulaManager_instances, _FormulaManager_lexer, _FormulaManager_tokens, _FormulaManager_parser, _FormulaManager_specs, _FormulaManager_parsedBase, _FormulaManager_type, _FormulaManager_variables, _FormulaManager_parsers, _FormulaManager_plugin, _FormulaManager_instance, _FormulaManager_initialize;
import { ReactiveModel } from '@beyond-js/reactive/model';
import { Lexer } from './helpers/lexer';
import { Parser } from './helpers/parser';
import { FormulaBasic } from './variants/basic';
import { FormulaConditional } from './variants/conditional';
import { FormulaPerValue } from './variants/per-value';
import { FormulaComparison } from './variants/comparison';
import { FormulaArray } from './variants/array-formula';
import { IterativeArrayFormula } from './variants/iterative-array';
export class FormulaManager extends ReactiveModel {
    get tokens() {
        return __classPrivateFieldGet(this, _FormulaManager_tokens, "f");
    }
    get parser() {
        return __classPrivateFieldGet(this, _FormulaManager_parser, "f");
    }
    get formula() {
        return __classPrivateFieldGet(this, _FormulaManager_specs, "f").formula;
    }
    get name() {
        return __classPrivateFieldGet(this, _FormulaManager_specs, "f").name;
    }
    get conditional() {
        return typeof __classPrivateFieldGet(this, _FormulaManager_specs, "f").formula === 'object';
    }
    get conditions() {
        if (typeof __classPrivateFieldGet(this, _FormulaManager_specs, "f").formula === 'string')
            return;
        const formula = __classPrivateFieldGet(this, _FormulaManager_specs, "f").formula;
        return formula.conditions;
    }
    /**
     *  Represents the fields defined in the plugin settings
     */
    get fields() {
        const formula = this.formula;
        return typeof formula?.fields === 'string' ? [formula?.fields] : formula?.fields;
    }
    get parsedBase() {
        return __classPrivateFieldGet(this, _FormulaManager_parsedBase, "f");
    }
    get type() {
        return __classPrivateFieldGet(this, _FormulaManager_type, "f");
    }
    get base() {
        const formula = __classPrivateFieldGet(this, _FormulaManager_specs, "f").formula;
        return formula.base;
    }
    get variables() {
        return __classPrivateFieldGet(this, _FormulaManager_variables, "f");
    }
    get value() {
        return __classPrivateFieldGet(this, _FormulaManager_instance, "f").value;
    }
    constructor(plugin, specs) {
        super();
        _FormulaManager_instances.add(this);
        _FormulaManager_lexer.set(this, new Lexer(true));
        _FormulaManager_tokens.set(this, void 0);
        _FormulaManager_parser.set(this, void 0);
        _FormulaManager_specs.set(this, void 0);
        _FormulaManager_parsedBase.set(this, void 0);
        _FormulaManager_type.set(this, void 0);
        _FormulaManager_variables.set(this, []);
        _FormulaManager_parsers.set(this, new Map());
        _FormulaManager_plugin.set(this, void 0);
        _FormulaManager_instance.set(this, void 0);
        __classPrivateFieldSet(this, _FormulaManager_plugin, plugin, "f");
        __classPrivateFieldSet(this, _FormulaManager_specs, specs, "f");
        __classPrivateFieldGet(this, _FormulaManager_instances, "m", _FormulaManager_initialize).call(this);
    }
    initialize() {
        __classPrivateFieldGet(this, _FormulaManager_instance, "f").initialize();
    }
    /**
     * Returns the models that are part of the formula
     * The models could be fields or formulas
     * @param variables
     * @returns
     */
    getModels(variables) {
        const varsArray = Array.isArray(variables) ? variables : [variables];
        return varsArray.map(name => {
            if (__classPrivateFieldGet(this, _FormulaManager_plugin, "f").formulas.has(name))
                return __classPrivateFieldGet(this, _FormulaManager_plugin, "f").formulas.get(name);
            return __classPrivateFieldGet(this, _FormulaManager_plugin, "f").form.getField(name);
        });
    }
    getType() {
        const { type, formula } = __classPrivateFieldGet(this, _FormulaManager_specs, "f");
        if (type)
            return type;
        if (typeof formula === 'string')
            return 'basic';
        if (formula.conditions)
            return formula.base ? 'base-conditional' : 'value-conditions';
    }
    processConditional() {
        const formula = this.formula;
        if (this.base) {
            __classPrivateFieldSet(this, _FormulaManager_parsedBase, this.getParser({ formula: this.base }), "f");
        }
    }
    calculate() {
        if (!__classPrivateFieldGet(this, _FormulaManager_instance, "f") || __classPrivateFieldGet(this, _FormulaManager_instance, "f").calculate) {
        }
        __classPrivateFieldGet(this, _FormulaManager_instance, "f").calculate();
        this.trigger('change');
        return;
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
    getParser(data) {
        if (!data.formula)
            throw new Error('To get a parser you must provide a formula');
        if (__classPrivateFieldGet(this, _FormulaManager_parsers, "f").has(data.formula))
            return __classPrivateFieldGet(this, _FormulaManager_parsers, "f").get(data.formula);
        const tokens = __classPrivateFieldGet(this, _FormulaManager_lexer, "f").tokenize(data.formula);
        const parser = new Parser(tokens);
        const result = { tokens, parser, ...data };
        __classPrivateFieldGet(this, _FormulaManager_parsers, "f").set(data.formula, result);
        return result;
    }
    async getParams(variables) {
        const params = {};
        const { form, formulas } = __classPrivateFieldGet(this, _FormulaManager_plugin, "f");
        const build = async (value) => {
            /**
             * the value could be a formula or a field
             */
            const element = formulas.has(value) ? formulas.get(value) : form.getField(value);
            if (!element)
                throw new Error(`Field ${value} used in formula ${this.name}, not found in form ${form.name}, `);
            await element.isReady;
            params[value] = [undefined, '', null, NaN].includes(element.value) ? 0 : element.value;
        };
        variables.forEach(build);
        return params;
    }
    /**
     * A form can have multiple formulas, this method will create an instance of the formula manager
     * and memoize it to avoid creating multiple instances of the same formula.
     * @param specs
     * @returns
     */
    static async create(plugin, specs) {
        const instance = new FormulaManager(plugin, specs);
        // FormulaManager.instances.set(plugin.form.name, instance);
        return instance;
    }
}
_FormulaManager_lexer = new WeakMap(), _FormulaManager_tokens = new WeakMap(), _FormulaManager_parser = new WeakMap(), _FormulaManager_specs = new WeakMap(), _FormulaManager_parsedBase = new WeakMap(), _FormulaManager_type = new WeakMap(), _FormulaManager_variables = new WeakMap(), _FormulaManager_parsers = new WeakMap(), _FormulaManager_plugin = new WeakMap(), _FormulaManager_instance = new WeakMap(), _FormulaManager_instances = new WeakSet(), _FormulaManager_initialize = function _FormulaManager_initialize() {
    __classPrivateFieldSet(this, _FormulaManager_type, this.getType(), "f");
    const objects = {
        basic: FormulaBasic,
        'base-conditional': FormulaConditional,
        'value-conditions': FormulaPerValue,
        comparison: FormulaComparison,
        array: FormulaArray,
        'iterative-array': IterativeArrayFormula,
    };
    if (!objects[this.type]) {
        throw new Error(`this type ${this.type} not found`);
    }
    __classPrivateFieldSet(this, _FormulaManager_instance, new objects[this.type](this, __classPrivateFieldGet(this, _FormulaManager_plugin, "f"), __classPrivateFieldGet(this, _FormulaManager_specs, "f")), "f");
};
//# sourceMappingURL=index.js.map