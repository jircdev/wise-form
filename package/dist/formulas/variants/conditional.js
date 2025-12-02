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
var _FormulaConditional_plugin, _FormulaConditional_specs, _FormulaConditional_emptyValue, _FormulaConditional_value, _FormulaConditional_fields, _FormulaConditional_parent, _FormulaConditional_ceil, _FormulaConditional_round, _FormulaConditional_isNotListenToChanges;
import { conditionsTypes } from '../helpers/condition-types';
import { EvaluationsManager } from '../helpers/evaluations';
import { parse } from 'mathjs';
export class FormulaConditional {
    get formula() {
        return __classPrivateFieldGet(this, _FormulaConditional_specs, "f").formula;
    }
    get base() {
        const formula = __classPrivateFieldGet(this, _FormulaConditional_specs, "f").formula;
        return formula.base;
    }
    get value() {
        return __classPrivateFieldGet(this, _FormulaConditional_value, "f");
    }
    get name() {
        return __classPrivateFieldGet(this, _FormulaConditional_specs, "f").name;
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
        if (typeof __classPrivateFieldGet(this, _FormulaConditional_specs, "f").formula === 'string')
            return;
        const formula = __classPrivateFieldGet(this, _FormulaConditional_specs, "f").formula;
        return formula.conditions;
    }
    constructor(parent, plugin, specs) {
        _FormulaConditional_plugin.set(this, void 0);
        _FormulaConditional_specs.set(this, void 0);
        _FormulaConditional_emptyValue.set(this, void 0);
        _FormulaConditional_value.set(this, void 0);
        /**
         * FormField type
         */
        _FormulaConditional_fields.set(this, void 0);
        _FormulaConditional_parent.set(this, void 0);
        _FormulaConditional_ceil.set(this, void 0);
        _FormulaConditional_round.set(this, void 0);
        _FormulaConditional_isNotListenToChanges.set(this, false);
        __classPrivateFieldSet(this, _FormulaConditional_parent, parent, "f");
        __classPrivateFieldSet(this, _FormulaConditional_plugin, plugin, "f");
        __classPrivateFieldSet(this, _FormulaConditional_specs, specs, "f");
        __classPrivateFieldSet(this, _FormulaConditional_round, specs.round, "f");
        __classPrivateFieldSet(this, _FormulaConditional_ceil, specs.ceil, "f");
        __classPrivateFieldSet(this, _FormulaConditional_emptyValue, specs.emptyValue, "f");
        if (specs.isNotListenToChanges)
            __classPrivateFieldSet(this, _FormulaConditional_isNotListenToChanges, specs.isNotListenToChanges, "f");
    }
    initialize() {
        try {
            const { form } = __classPrivateFieldGet(this, _FormulaConditional_plugin, "f");
            if (!this.fields) {
                throw new Error(`Fields not found in formula ${this.name}`);
            }
            const fields = this.fields.map((name) => {
                const formula = __classPrivateFieldGet(this, _FormulaConditional_plugin, "f").formulas.get(name);
                if (formula)
                    return formula;
                const field = form.getField(name);
                return field;
            });
            __classPrivateFieldSet(this, _FormulaConditional_fields, fields, "f");
            if (this.name === 'costoTotalGrafico') {
                console.log('fields', fields);
            }
            if (!__classPrivateFieldGet(this, _FormulaConditional_isNotListenToChanges, "f"))
                fields.forEach((field) => {
                    if (!field) {
                        throw new Error(`Field ${this.name} not found in form ${form.name}`);
                    }
                    field.on('change', this.calculate.bind(this));
                });
        }
        catch (e) { }
    }
    evaluate() {
        const formula = __classPrivateFieldGet(this, _FormulaConditional_specs, "f").formula;
        let evaluatedFormula = { formula: formula.base }; // Use the base formula by default
        if (formula.conditions) {
            const conditionsArray = Array.isArray(formula.conditions) ? formula.conditions : [formula.conditions];
            for (const condition of conditionsArray) {
                let conditionMet = false;
                if (condition.conditions) {
                    // If there are nested conditions, all must be met
                    conditionMet = condition.conditions.every((subCondition) => {
                        const fieldValues = subCondition.fields.map((fieldName) => {
                            const field = __classPrivateFieldGet(this, _FormulaConditional_fields, "f").find((f) => f.name === fieldName);
                            return field
                                ? field.value
                                : __classPrivateFieldGet(this, _FormulaConditional_emptyValue, "f");
                        });
                        return EvaluationsManager.validateAll(subCondition.condition, fieldValues, subCondition.value);
                    });
                }
                else {
                    const fieldValues = condition.fields.map((fieldName) => {
                        const field = __classPrivateFieldGet(this, _FormulaConditional_fields, "f").find((f) => f.name === fieldName);
                        return field ? field.value : __classPrivateFieldGet(this, _FormulaConditional_emptyValue, "f");
                    });
                    const conditionType = !!condition.type && conditionsTypes[condition.type]
                        ? conditionsTypes[condition.type]
                        : conditionsTypes.some;
                    // Check if any of the specified fields meet the condition
                    conditionMet = EvaluationsManager[conditionType](condition.condition, fieldValues, condition.value);
                }
                if (conditionMet) {
                    evaluatedFormula.formula = condition.formula;
                    evaluatedFormula.fi = condition;
                    break;
                }
            }
        }
        return evaluatedFormula;
    }
    async calculate() {
        /**
         * the formula is taken from the evaluate method since the conditions are evaluated there and
         * can change the formula to be applied
         */
        const model = __classPrivateFieldGet(this, _FormulaConditional_plugin, "f").form.getField(this.name);
        const formula = this.evaluate();
        if (!formula.formula) {
            __classPrivateFieldSet(this, _FormulaConditional_value, __classPrivateFieldGet(this, _FormulaConditional_emptyValue, "f") !== undefined ? __classPrivateFieldGet(this, _FormulaConditional_emptyValue, "f") : '', "f");
            model && model.set({ value: __classPrivateFieldGet(this, _FormulaConditional_value, "f") });
            __classPrivateFieldGet(this, _FormulaConditional_parent, "f").trigger('change');
            return __classPrivateFieldGet(this, _FormulaConditional_value, "f");
        }
        // todo: Review if this section can be replaced by formulaManager.variables property.
        const { tokens } = __classPrivateFieldGet(this, _FormulaConditional_parent, "f").getParser(formula);
        const variables = tokens
            .filter((token) => token.type === 'variable')
            .map((item) => item.value);
        const params = await __classPrivateFieldGet(this, _FormulaConditional_parent, "f").getParams(variables);
        try {
            const keys = Object.keys(params);
            let result = keys.length === 1
                ? params[keys[0]]
                : parse(formula.formula).evaluate(params);
            const isInvalidResult = [
                -Infinity,
                Infinity,
                undefined,
                null,
                NaN,
            ].includes(result);
            if (__classPrivateFieldGet(this, _FormulaConditional_round, "f") && !isInvalidResult)
                result = Math.round(result);
            if (__classPrivateFieldGet(this, _FormulaConditional_ceil, "f") && !isInvalidResult)
                result = Math.ceil(result);
            __classPrivateFieldSet(this, _FormulaConditional_value, isInvalidResult || typeof result === 'object'
                ? __classPrivateFieldGet(this, _FormulaConditional_emptyValue, "f")
                : Number(result.toFixed(2)), "f");
            __classPrivateFieldGet(this, _FormulaConditional_parent, "f").trigger('change');
            model && model.set({ value: __classPrivateFieldGet(this, _FormulaConditional_value, "f") });
            return __classPrivateFieldGet(this, _FormulaConditional_value, "f");
        }
        catch (e) {
            console.log('formula', this.name, formula.formula, params);
            console.error(e);
            throw new Error('Error calculating the formula');
        }
    }
}
_FormulaConditional_plugin = new WeakMap(), _FormulaConditional_specs = new WeakMap(), _FormulaConditional_emptyValue = new WeakMap(), _FormulaConditional_value = new WeakMap(), _FormulaConditional_fields = new WeakMap(), _FormulaConditional_parent = new WeakMap(), _FormulaConditional_ceil = new WeakMap(), _FormulaConditional_round = new WeakMap(), _FormulaConditional_isNotListenToChanges = new WeakMap();
//# sourceMappingURL=conditional.js.map