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
var _FormulaPerValue_plugin, _FormulaPerValue_emptyValue, _FormulaPerValue_specs, _FormulaPerValue_value, _FormulaPerValue_observers, _FormulaPerValue_parent, _FormulaPerValue_parsers, _FormulaPerValue_mainFields, _FormulaPerValue_isNotListenToChanges;
import { EvaluationsManager } from '../helpers/evaluations';
import { parse } from 'mathjs';
export class FormulaPerValue {
    get formula() {
        return __classPrivateFieldGet(this, _FormulaPerValue_specs, "f").formula;
    }
    get value() {
        return __classPrivateFieldGet(this, _FormulaPerValue_value, "f");
    }
    get name() {
        return __classPrivateFieldGet(this, _FormulaPerValue_specs, "f").name;
    }
    get observers() {
        return __classPrivateFieldGet(this, _FormulaPerValue_observers, "f");
    }
    /**
     *  Represents the fields defined in the plugin settings
     */
    get fields() {
        const formula = this.formula;
        return typeof formula?.fields === 'string' ? [formula?.fields] : formula?.fields;
    }
    get conditions() {
        if (typeof __classPrivateFieldGet(this, _FormulaPerValue_specs, "f").formula === 'string')
            return;
        const formula = __classPrivateFieldGet(this, _FormulaPerValue_specs, "f").formula;
        return formula.conditions;
    }
    constructor(parent, plugin, specs) {
        _FormulaPerValue_plugin.set(this, void 0);
        _FormulaPerValue_emptyValue.set(this, void 0);
        _FormulaPerValue_specs.set(this, void 0);
        _FormulaPerValue_value.set(this, void 0);
        _FormulaPerValue_observers.set(this, void 0);
        _FormulaPerValue_parent.set(this, void 0);
        _FormulaPerValue_parsers.set(this, void 0);
        _FormulaPerValue_mainFields.set(this, void 0);
        _FormulaPerValue_isNotListenToChanges.set(this, false);
        __classPrivateFieldSet(this, _FormulaPerValue_parent, parent, "f");
        __classPrivateFieldSet(this, _FormulaPerValue_plugin, plugin, "f");
        __classPrivateFieldSet(this, _FormulaPerValue_specs, specs, "f");
        __classPrivateFieldSet(this, _FormulaPerValue_observers, specs.formula.observers, "f");
        __classPrivateFieldSet(this, _FormulaPerValue_isNotListenToChanges, specs.isNotListenToChanges, "f");
    }
    initialize() {
        const { form } = __classPrivateFieldGet(this, _FormulaPerValue_plugin, "f");
        const fields = new Set();
        __classPrivateFieldSet(this, _FormulaPerValue_mainFields, __classPrivateFieldGet(this, _FormulaPerValue_parent, "f").getModels(this.fields), "f");
        /**
         * The method will iterate over the conditions to get the parser for each value
         * and get access to the fields that are part of the formula and be able to evaluate it
         * changes.
         */
        const conditionsArray = Array.isArray(this.conditions) ? this.conditions : [];
        conditionsArray.forEach(condition => {
            if (!condition.condition) {
                throw new Error('the formula per value must contain a condition property in the condition`s item');
            }
            if (!condition.values) {
                throw new Error('the formula per value must contain a values property in the condition`s item');
            }
            const parsers = condition.values.map(item => __classPrivateFieldGet(this, _FormulaPerValue_parent, "f").getParser(item));
            __classPrivateFieldSet(this, _FormulaPerValue_parsers, parsers, "f");
            parsers.forEach(parser => {
                parser.tokens.filter(token => token.type === 'variable').forEach(token => fields.add(token.value));
            });
        });
        fields.forEach(field => {
            const model = form.getField(field);
            if (model)
                model.on('change', this.listenConditionals.bind(this));
        });
        this.listenConditionals();
        if (!__classPrivateFieldGet(this, _FormulaPerValue_isNotListenToChanges, "f"))
            __classPrivateFieldGet(this, _FormulaPerValue_mainFields, "f").forEach(item => item.on('change', this.calculate.bind(this)));
        if (!__classPrivateFieldGet(this, _FormulaPerValue_isNotListenToChanges, "f"))
            if (__classPrivateFieldGet(this, _FormulaPerValue_observers, "f") && Array.isArray(__classPrivateFieldGet(this, _FormulaPerValue_observers, "f")) && !!__classPrivateFieldGet(this, _FormulaPerValue_observers, "f").length) {
                const fields = __classPrivateFieldGet(this, _FormulaPerValue_parent, "f").getModels(__classPrivateFieldGet(this, _FormulaPerValue_observers, "f"));
                fields.forEach(field => {
                    if (!field)
                        return;
                    field.on('change', this.calculateAll.bind(this));
                });
            }
    }
    calculateAll() {
        __classPrivateFieldGet(this, _FormulaPerValue_mainFields, "f").forEach(field => this.calculate(field));
    }
    listenConditionals() {
        __classPrivateFieldGet(this, _FormulaPerValue_mainFields, "f").forEach(field => {
            if (!field)
                return;
            field.on('change', this.calculate.bind(this));
        });
    }
    async calculate(field) {
        if (!field)
            return;
        const { form } = __classPrivateFieldGet(this, _FormulaPerValue_plugin, "f");
        const formula = this.evaluate(field.value);
        if (!formula)
            return;
        const variables = formula.tokens.filter(token => token.type === 'variable').map(item => item.value);
        const params = await __classPrivateFieldGet(this, _FormulaPerValue_parent, "f").getParams(variables);
        const formulaField = form.getField(this.name);
        try {
            const keys = Object.keys(params);
            const result = keys.length === 1 ? params[keys[0]] : parse(formula.formula).evaluate(params);
            __classPrivateFieldSet(this, _FormulaPerValue_value, [-Infinity, Infinity, undefined, null, NaN].includes(result)
                ? __classPrivateFieldGet(this, _FormulaPerValue_emptyValue, "f")
                : Number(result.toFixed(2)), "f");
            formulaField && formulaField.set({ value: __classPrivateFieldGet(this, _FormulaPerValue_value, "f") });
            __classPrivateFieldGet(this, _FormulaPerValue_parent, "f").trigger('change');
        }
        catch (e) {
            console.log(e);
            throw new Error('Error calculating the formula');
        }
    }
    evaluate(value) {
        let formula = undefined;
        if ([null, undefined].includes(value)) {
            return;
        }
        const conditionsArray = Array.isArray(this.conditions) ? this.conditions : [];
        conditionsArray.forEach(item => {
            const { condition, values } = item;
            if (!condition) {
                throw new Error('the formula per value must contain a condition property in the condition`s item');
            }
            if (!values) {
                throw new Error('the formula per value must contain a values property in the condition`s item');
            }
            const index = values.findIndex(item => EvaluationsManager.validate(condition, value, item.value));
            if (index > -1)
                formula = __classPrivateFieldGet(this, _FormulaPerValue_parent, "f").getParser(values[index]);
        });
        return formula;
    }
}
_FormulaPerValue_plugin = new WeakMap(), _FormulaPerValue_emptyValue = new WeakMap(), _FormulaPerValue_specs = new WeakMap(), _FormulaPerValue_value = new WeakMap(), _FormulaPerValue_observers = new WeakMap(), _FormulaPerValue_parent = new WeakMap(), _FormulaPerValue_parsers = new WeakMap(), _FormulaPerValue_mainFields = new WeakMap(), _FormulaPerValue_isNotListenToChanges = new WeakMap();
//# sourceMappingURL=per-value.js.map