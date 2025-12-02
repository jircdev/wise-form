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
var _IterativeArrayFormula_plugin, _IterativeArrayFormula_specs, _IterativeArrayFormula_tokens, _IterativeArrayFormula_value, _IterativeArrayFormula_emptyValue, _IterativeArrayFormula_variables, _IterativeArrayFormula_round, _IterativeArrayFormula_ceil, _IterativeArrayFormula_parent, _IterativeArrayFormula_isNotListenToChanges;
import { EvaluationsManager } from '../helpers/evaluations';
import { parse } from 'mathjs';
export class IterativeArrayFormula {
    get formula() {
        return __classPrivateFieldGet(this, _IterativeArrayFormula_specs, "f").formula;
    }
    get base() {
        const formula = __classPrivateFieldGet(this, _IterativeArrayFormula_specs, "f").formula;
        return formula.base;
    }
    get value() {
        return __classPrivateFieldGet(this, _IterativeArrayFormula_value, "f");
    }
    get name() {
        return __classPrivateFieldGet(this, _IterativeArrayFormula_specs, "f").name;
    }
    /**
     *  Represents the fields defined in the plugin settings
     */
    get fields() {
        const formula = this.formula;
        return typeof formula?.fields === 'string' ? [formula?.fields] : formula?.fields;
    }
    get conditions() {
        if (typeof __classPrivateFieldGet(this, _IterativeArrayFormula_specs, "f").formula === 'string')
            return;
        const formula = __classPrivateFieldGet(this, _IterativeArrayFormula_specs, "f").formula;
        return formula.conditions;
    }
    get variables() {
        return __classPrivateFieldGet(this, _IterativeArrayFormula_variables, "f");
    }
    constructor(parent, plugin, specs) {
        _IterativeArrayFormula_plugin.set(this, void 0);
        _IterativeArrayFormula_specs.set(this, void 0);
        _IterativeArrayFormula_tokens.set(this, void 0);
        _IterativeArrayFormula_value.set(this, void 0);
        _IterativeArrayFormula_emptyValue.set(this, void 0);
        _IterativeArrayFormula_variables.set(this, []);
        _IterativeArrayFormula_round.set(this, void 0);
        _IterativeArrayFormula_ceil.set(this, void 0);
        _IterativeArrayFormula_parent.set(this, void 0);
        _IterativeArrayFormula_isNotListenToChanges.set(this, false);
        __classPrivateFieldSet(this, _IterativeArrayFormula_parent, parent, "f");
        __classPrivateFieldSet(this, _IterativeArrayFormula_plugin, plugin, "f");
        __classPrivateFieldSet(this, _IterativeArrayFormula_specs, specs, "f");
        __classPrivateFieldSet(this, _IterativeArrayFormula_round, specs.round, "f");
        __classPrivateFieldSet(this, _IterativeArrayFormula_ceil, specs.ceil, "f");
        __classPrivateFieldSet(this, _IterativeArrayFormula_emptyValue, __classPrivateFieldGet(this, _IterativeArrayFormula_specs, "f").emptyValue, "f");
        __classPrivateFieldSet(this, _IterativeArrayFormula_isNotListenToChanges, specs.isNotListenToChanges, "f");
    }
    initialize() {
        const fieldArray = __classPrivateFieldGet(this, _IterativeArrayFormula_plugin, "f").form.getField(__classPrivateFieldGet(this, _IterativeArrayFormula_specs, "f").arrayFieldName);
        if (!fieldArray) {
            console.error(`Field ${__classPrivateFieldGet(this, _IterativeArrayFormula_specs, "f").arrayFieldName} does NOT exist.`);
            return;
        }
        fieldArray.on('change', this.calculate.bind(this));
    }
    async calculate() {
        const formulaField = __classPrivateFieldGet(this, _IterativeArrayFormula_plugin, "f").form.getField(this.name);
        const fieldArray = __classPrivateFieldGet(this, _IterativeArrayFormula_plugin, "f").form.getField(__classPrivateFieldGet(this, _IterativeArrayFormula_specs, "f").arrayFieldName);
        if (!fieldArray) {
            console.error(`Field ${__classPrivateFieldGet(this, _IterativeArrayFormula_specs, "f").arrayFieldName} does NOT exist.`);
            return;
        }
        const entries = fieldArray[__classPrivateFieldGet(this, _IterativeArrayFormula_specs, "f").arrayFieldProperty];
        if (!Array.isArray(entries)) {
            console.error(`Property ${__classPrivateFieldGet(this, _IterativeArrayFormula_specs, "f").arrayFieldProperty} is not an array.`);
            return;
        }
        const empty = !entries.length;
        const formula = __classPrivateFieldGet(this, _IterativeArrayFormula_specs, "f").formula;
        let formulaEvaluate = formula?.formula || formula;
        if (empty) {
            // If all models are empty, set the input to empty if exists.
            if (formulaField)
                formulaField.set({ value: __classPrivateFieldGet(this, _IterativeArrayFormula_emptyValue, "f") !== undefined ? __classPrivateFieldGet(this, _IterativeArrayFormula_emptyValue, "f") : '' });
            __classPrivateFieldSet(this, _IterativeArrayFormula_value, undefined, "f");
            __classPrivateFieldGet(this, _IterativeArrayFormula_parent, "f").trigger('change');
            return;
        }
        try {
            let totalResult = 0;
            for (let item of entries) {
                if (formula.conditions) {
                    for (const condition of formula.conditions) {
                        const comparisonValue = item[condition.property];
                        let conditionMet = EvaluationsManager.validate(condition.condition, comparisonValue, condition.value);
                        if (conditionMet) {
                            formulaEvaluate = condition.formula;
                            break;
                        }
                        else {
                            formulaEvaluate = formula.base;
                        }
                    }
                }
                const attrs = this.sanitizeData(item);
                let result = parse(formulaEvaluate).evaluate(attrs);
                const isInvalidResult = [-Infinity, Infinity, undefined, null, NaN].includes(result);
                if (__classPrivateFieldGet(this, _IterativeArrayFormula_round, "f") && !isInvalidResult)
                    result = Math.round(result);
                if (__classPrivateFieldGet(this, _IterativeArrayFormula_ceil, "f") && !isInvalidResult)
                    result = Math.ceil(result);
                totalResult = isInvalidResult ? totalResult : Number(totalResult) + Number(result.toFixed(2));
            }
            const isInvalidResult = [-Infinity, Infinity, undefined, null, NaN, ''].includes(totalResult);
            __classPrivateFieldSet(this, _IterativeArrayFormula_value, isInvalidResult ? __classPrivateFieldGet(this, _IterativeArrayFormula_emptyValue, "f") : totalResult, "f");
            if (formulaField)
                formulaField.set({ value: __classPrivateFieldGet(this, _IterativeArrayFormula_value, "f") });
            __classPrivateFieldGet(this, _IterativeArrayFormula_parent, "f").trigger('change');
        }
        catch (e) {
            console.log('formula', this.name, this.formula);
            console.trace(e);
            throw new Error(`Error calculating the formula: ${e.message} ${this.name}`);
        }
    }
    ;
    sanitizeData(data) {
        if (Array.isArray(data)) {
            return data.map(item => this.sanitizeData(item));
        }
        else if (typeof data === 'object' && data !== null) {
            const sanitizedData = {};
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    sanitizedData[key] = this.sanitizeData(data[key]);
                }
            }
            return sanitizedData;
        }
        else {
            return this.sanitizeValue(data);
        }
    }
    sanitizeValue(value, defaultValue = 0) {
        return (value === null || value === undefined || isNaN(value)) ? defaultValue : Number(value);
    }
}
_IterativeArrayFormula_plugin = new WeakMap(), _IterativeArrayFormula_specs = new WeakMap(), _IterativeArrayFormula_tokens = new WeakMap(), _IterativeArrayFormula_value = new WeakMap(), _IterativeArrayFormula_emptyValue = new WeakMap(), _IterativeArrayFormula_variables = new WeakMap(), _IterativeArrayFormula_round = new WeakMap(), _IterativeArrayFormula_ceil = new WeakMap(), _IterativeArrayFormula_parent = new WeakMap(), _IterativeArrayFormula_isNotListenToChanges = new WeakMap();
//# sourceMappingURL=iterative-array.js.map