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
var _FormulaBasic_plugin, _FormulaBasic_specs, _FormulaBasic_tokens, _FormulaBasic_value, _FormulaBasic_emptyValue, _FormulaBasic_variables, _FormulaBasic_round, _FormulaBasic_ceil, _FormulaBasic_parent, _FormulaBasic_isNotListenToChanges;
import { parse } from 'mathjs';
export class FormulaBasic {
    get formula() {
        return __classPrivateFieldGet(this, _FormulaBasic_specs, "f").formula;
    }
    get base() {
        const formula = __classPrivateFieldGet(this, _FormulaBasic_specs, "f").formula;
        return formula.base;
    }
    get value() {
        return __classPrivateFieldGet(this, _FormulaBasic_value, "f");
    }
    get name() {
        return __classPrivateFieldGet(this, _FormulaBasic_specs, "f").name;
    }
    /**
     *  Represents the fields defined in the plugin settings
     */
    get fields() {
        const formula = this.formula;
        return typeof formula?.fields === 'string'
            ? [formula?.fields]
            : formula?.fields;
    }
    get conditions() {
        if (typeof __classPrivateFieldGet(this, _FormulaBasic_specs, "f").formula === 'string')
            return;
        const formula = __classPrivateFieldGet(this, _FormulaBasic_specs, "f").formula;
        return formula.conditions;
    }
    get variables() {
        return __classPrivateFieldGet(this, _FormulaBasic_variables, "f");
    }
    constructor(parent, plugin, specs) {
        _FormulaBasic_plugin.set(this, void 0);
        _FormulaBasic_specs.set(this, void 0);
        _FormulaBasic_tokens.set(this, void 0);
        _FormulaBasic_value.set(this, void 0);
        _FormulaBasic_emptyValue.set(this, void 0);
        _FormulaBasic_variables.set(this, []);
        _FormulaBasic_round.set(this, void 0);
        _FormulaBasic_ceil.set(this, void 0);
        _FormulaBasic_parent.set(this, void 0);
        _FormulaBasic_isNotListenToChanges.set(this, false);
        __classPrivateFieldSet(this, _FormulaBasic_parent, parent, "f");
        __classPrivateFieldSet(this, _FormulaBasic_plugin, plugin, "f");
        __classPrivateFieldSet(this, _FormulaBasic_specs, specs, "f");
        __classPrivateFieldSet(this, _FormulaBasic_round, specs.round, "f");
        __classPrivateFieldSet(this, _FormulaBasic_ceil, specs.ceil, "f");
        __classPrivateFieldSet(this, _FormulaBasic_emptyValue, specs.emptyValue, "f");
        __classPrivateFieldSet(this, _FormulaBasic_isNotListenToChanges, specs.isNotListenToChanges, "f");
    }
    initialize() {
        const { tokens } = __classPrivateFieldGet(this, _FormulaBasic_parent, "f").getParser(__classPrivateFieldGet(this, _FormulaBasic_specs, "f"));
        __classPrivateFieldSet(this, _FormulaBasic_tokens, tokens, "f");
        const variables = __classPrivateFieldGet(this, _FormulaBasic_tokens, "f")
            .filter((token) => token.type === 'variable')
            .map((item) => item.value);
        __classPrivateFieldSet(this, _FormulaBasic_variables, variables, "f");
        const models = __classPrivateFieldGet(this, _FormulaBasic_parent, "f").getModels(variables);
        if (!__classPrivateFieldGet(this, _FormulaBasic_isNotListenToChanges, "f"))
            models.forEach((model) => {
                if ([undefined].includes(model)) {
                    return;
                }
                model.on('change', this.calculate.bind(this));
            });
        if (!Array.isArray(__classPrivateFieldGet(this, _FormulaBasic_variables, "f")) || !__classPrivateFieldGet(this, _FormulaBasic_variables, "f").length) {
            __classPrivateFieldSet(this, _FormulaBasic_value, parse(this.formula).evaluate(), "f");
        }
    }
    async calculate() {
        const variables = __classPrivateFieldGet(this, _FormulaBasic_variables, "f");
        const formulaField = __classPrivateFieldGet(this, _FormulaBasic_plugin, "f").form.getField(this.name);
        let params = await __classPrivateFieldGet(this, _FormulaBasic_parent, "f").getParams(variables);
        const models = __classPrivateFieldGet(this, _FormulaBasic_parent, "f").getModels(variables);
        const empty = models.every((model) => [null, undefined, ''].includes(model.value));
        if (empty) {
            // If all models are empty, set the input to empty if exists.
            if (formulaField)
                formulaField.set({ value: __classPrivateFieldGet(this, _FormulaBasic_emptyValue, "f") || '' });
            __classPrivateFieldSet(this, _FormulaBasic_value, undefined, "f");
            return;
        }
        try {
            let result = models.length === 1 &&
                !['+', '-', '*', '/'].some((item) => this.formula.toString().includes(item))
                ? models[0].value
                : parse(this.formula).evaluate(params);
            const isInvalidResult = [
                -Infinity,
                Infinity,
                undefined,
                null,
                NaN,
            ].includes(result);
            if (__classPrivateFieldGet(this, _FormulaBasic_round, "f") && !isInvalidResult)
                result = Math.round(result);
            if (__classPrivateFieldGet(this, _FormulaBasic_ceil, "f") && !isInvalidResult)
                result = Math.ceil(result);
            __classPrivateFieldSet(this, _FormulaBasic_value, isInvalidResult
                ? __classPrivateFieldGet(this, _FormulaBasic_emptyValue, "f")
                : Number(result.toFixed(2)), "f");
            if (formulaField)
                formulaField.set({ value: __classPrivateFieldGet(this, _FormulaBasic_value, "f") });
            __classPrivateFieldGet(this, _FormulaBasic_parent, "f").trigger('change');
        }
        catch (e) {
            console.log('formula', this.name, this.formula, params);
            console.trace(e);
            throw new Error(`Error calculating the formula: ${e.message} ${this.name}`);
        }
    }
}
_FormulaBasic_plugin = new WeakMap(), _FormulaBasic_specs = new WeakMap(), _FormulaBasic_tokens = new WeakMap(), _FormulaBasic_value = new WeakMap(), _FormulaBasic_emptyValue = new WeakMap(), _FormulaBasic_variables = new WeakMap(), _FormulaBasic_round = new WeakMap(), _FormulaBasic_ceil = new WeakMap(), _FormulaBasic_parent = new WeakMap(), _FormulaBasic_isNotListenToChanges = new WeakMap();
//# sourceMappingURL=basic.js.map