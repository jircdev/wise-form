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
var _FormulaArray_plugin, _FormulaArray_specs, _FormulaArray_value, _FormulaArray_emptyValue, _FormulaArray_variables, _FormulaArray_round, _FormulaArray_ceil, _FormulaArray_parent, _FormulaArray_formulaField;
import { EvaluationsManager } from '../helpers/evaluations';
import { parse } from 'mathjs';
export class FormulaArray {
    get formula() {
        return __classPrivateFieldGet(this, _FormulaArray_specs, "f").formula;
    }
    get base() {
        const formula = __classPrivateFieldGet(this, _FormulaArray_specs, "f").formula;
        return formula.base;
    }
    get value() {
        return __classPrivateFieldGet(this, _FormulaArray_value, "f");
    }
    get name() {
        return __classPrivateFieldGet(this, _FormulaArray_specs, "f").name;
    }
    /**
     *  Represents the fields defined in the plugin settings
     */
    get fields() {
        const formula = this.formula;
        return typeof formula?.fields === 'string' ? [formula?.fields] : formula?.fields;
    }
    get conditions() {
        if (typeof __classPrivateFieldGet(this, _FormulaArray_specs, "f").formula === 'string')
            return;
        const formula = __classPrivateFieldGet(this, _FormulaArray_specs, "f").formula;
        return formula.conditions;
    }
    get variables() {
        return __classPrivateFieldGet(this, _FormulaArray_variables, "f");
    }
    constructor(parent, plugin, specs) {
        _FormulaArray_plugin.set(this, void 0);
        _FormulaArray_specs.set(this, void 0);
        _FormulaArray_value.set(this, []);
        _FormulaArray_emptyValue.set(this, void 0);
        _FormulaArray_variables.set(this, []);
        _FormulaArray_round.set(this, void 0);
        _FormulaArray_ceil.set(this, void 0);
        _FormulaArray_parent.set(this, void 0);
        _FormulaArray_formulaField.set(this, void 0);
        this.evaluate = (data) => {
            const values = {};
            for (const formula of data.formulas) {
                let result;
                let formulaEvaluate = formula.formula;
                try {
                    if (formula.conditions) {
                        for (const condition of formula.conditions) {
                            const comparisonValue = { ...data.values, ...values }[condition.property];
                            let conditionMet = EvaluationsManager.validate(condition.condition, comparisonValue, condition.value);
                            if (conditionMet) {
                                formulaEvaluate = condition.formula;
                                break;
                            }
                        }
                    }
                    const attrs = this.sanitizeData({ ...data.values, ...values });
                    result = parse(formulaEvaluate).evaluate(attrs);
                }
                catch (error) {
                    console.log("Error evaluating formula:", formula.formula, "Error:", error);
                }
                const isInvalidResult = [-Infinity, Infinity, undefined, null, NaN].includes(result);
                if (formula.round && !isInvalidResult)
                    result = Math.round(result);
                if (formula.ceil && !isInvalidResult)
                    result = Math.ceil(result);
                result = isInvalidResult ? formula.emptyValue : Number(result.toFixed(2));
                values[formula.propertyToSet] = result;
            }
            return values;
        };
        __classPrivateFieldSet(this, _FormulaArray_parent, parent, "f");
        __classPrivateFieldSet(this, _FormulaArray_plugin, plugin, "f");
        __classPrivateFieldSet(this, _FormulaArray_specs, specs, "f");
        __classPrivateFieldSet(this, _FormulaArray_round, specs.round, "f");
        __classPrivateFieldSet(this, _FormulaArray_ceil, specs.ceil, "f");
        __classPrivateFieldGet(this, _FormulaArray_specs, "f").emptyValue = specs.emptyValue;
        __classPrivateFieldSet(this, _FormulaArray_formulaField, __classPrivateFieldGet(this, _FormulaArray_plugin, "f").form.getField(this.name), "f");
    }
    initialize() {
        __classPrivateFieldGet(this, _FormulaArray_formulaField, "f").on('change', this.calculate.bind(this));
    }
    ;
    async calculate() {
        const formulaField = __classPrivateFieldGet(this, _FormulaArray_plugin, "f").form.getField(this.name);
        if (!formulaField)
            return;
        const value = formulaField[__classPrivateFieldGet(this, _FormulaArray_specs, "f").propertyValue || 'entries'];
        if (!value || !Array.isArray(value) || !value.length) {
            formulaField.set({ [__classPrivateFieldGet(this, _FormulaArray_specs, "f").propertyValue]: [] });
            return;
        }
        ;
        const newValue = value.map(item => {
            let results = this.evaluate({ formulas: __classPrivateFieldGet(this, _FormulaArray_specs, "f").formulas, values: item });
            return {
                ...item,
                ...results
            };
        });
        __classPrivateFieldSet(this, _FormulaArray_value, newValue, "f");
        formulaField.set({ [__classPrivateFieldGet(this, _FormulaArray_specs, "f").propertyValue]: newValue });
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
_FormulaArray_plugin = new WeakMap(), _FormulaArray_specs = new WeakMap(), _FormulaArray_value = new WeakMap(), _FormulaArray_emptyValue = new WeakMap(), _FormulaArray_variables = new WeakMap(), _FormulaArray_round = new WeakMap(), _FormulaArray_ceil = new WeakMap(), _FormulaArray_parent = new WeakMap(), _FormulaArray_formulaField = new WeakMap();
//# sourceMappingURL=array-formula.js.map