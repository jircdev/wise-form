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
var _FormulaComparison_plugin, _FormulaComparison_specs, _FormulaComparison_emptyValue, _FormulaComparison_tokens, _FormulaComparison_value, _FormulaComparison_variables, _FormulaComparison_observers, _FormulaComparison_isNotListenToChanges, _FormulaComparison_parent;
import { EvaluationsManager } from "../helpers/evaluations";
import { parse } from "mathjs";
export class FormulaComparison {
    get formula() {
        return __classPrivateFieldGet(this, _FormulaComparison_specs, "f").formula;
    }
    get base() {
        const formula = __classPrivateFieldGet(this, _FormulaComparison_specs, "f").formula;
        return formula.base;
    }
    get value() {
        return __classPrivateFieldGet(this, _FormulaComparison_value, "f");
    }
    get name() {
        return __classPrivateFieldGet(this, _FormulaComparison_specs, "f").name;
    }
    /**
     *  Represents the fields defined in the plugin settings
     */
    get fields() {
        const formula = this.formula;
        return typeof formula?.fields === "string" ? [formula?.fields] : formula?.fields;
    }
    get conditions() {
        if (typeof __classPrivateFieldGet(this, _FormulaComparison_specs, "f").formula === "string")
            return;
        const formula = __classPrivateFieldGet(this, _FormulaComparison_specs, "f").formula;
        return formula.conditions;
    }
    get variables() {
        return __classPrivateFieldGet(this, _FormulaComparison_variables, "f");
    }
    ;
    get observers() {
        return __classPrivateFieldGet(this, _FormulaComparison_observers, "f");
    }
    constructor(parent, plugin, specs) {
        _FormulaComparison_plugin.set(this, void 0);
        _FormulaComparison_specs.set(this, void 0);
        _FormulaComparison_emptyValue.set(this, void 0);
        _FormulaComparison_tokens.set(this, void 0);
        _FormulaComparison_value.set(this, void 0);
        _FormulaComparison_variables.set(this, []);
        _FormulaComparison_observers.set(this, void 0);
        _FormulaComparison_isNotListenToChanges.set(this, false);
        _FormulaComparison_parent.set(this, void 0);
        __classPrivateFieldSet(this, _FormulaComparison_parent, parent, "f");
        __classPrivateFieldSet(this, _FormulaComparison_plugin, plugin, "f");
        __classPrivateFieldSet(this, _FormulaComparison_specs, specs, "f");
        __classPrivateFieldSet(this, _FormulaComparison_isNotListenToChanges, specs.isNotListenToChanges, "f");
        __classPrivateFieldSet(this, _FormulaComparison_observers, specs.formula.observers, "f");
    }
    initialize() {
        if (!Array.isArray(__classPrivateFieldGet(this, _FormulaComparison_specs, "f").fields)) {
            throw new Error("The fields property must be an array");
        }
        if (!__classPrivateFieldGet(this, _FormulaComparison_isNotListenToChanges, "f") && __classPrivateFieldGet(this, _FormulaComparison_observers, "f") && Array.isArray(__classPrivateFieldGet(this, _FormulaComparison_observers, "f")) && !!__classPrivateFieldGet(this, _FormulaComparison_observers, "f").length) {
            const fields = __classPrivateFieldGet(this, _FormulaComparison_parent, "f").getModels(__classPrivateFieldGet(this, _FormulaComparison_observers, "f"));
            fields.forEach(field => {
                if (!field)
                    return;
                field.on('change', this.calculate.bind(this));
            });
        }
        const models = __classPrivateFieldGet(this, _FormulaComparison_parent, "f").getModels(__classPrivateFieldGet(this, _FormulaComparison_specs, "f").fields);
        if (!__classPrivateFieldGet(this, _FormulaComparison_isNotListenToChanges, "f"))
            models.forEach(model => model.on("change", this.calculate.bind(this)));
    }
    start() { }
    evaluate() {
        const formula = __classPrivateFieldGet(this, _FormulaComparison_specs, "f").formula;
        if (typeof formula === "string" || !formula.conditions) {
            console.error("Invalid formula configuration");
            return null;
        }
        const models = __classPrivateFieldGet(this, _FormulaComparison_parent, "f").getModels(__classPrivateFieldGet(this, _FormulaComparison_specs, "f").fields);
        let fieldValues = models.map(fieldModel => {
            if (!fieldModel)
                return;
            return { name: fieldModel.name, value: fieldModel ? fieldModel.value : null };
        });
        // Utilizar reduce para comparar cada par de valores consecutivos y determinar cuál cumple la condición
        const resultField = fieldValues.reduce((prevField, currentField) => {
            if (!prevField)
                return currentField;
            // Si el campo previo cumple la condición con respecto al actual, se mantiene como el campo elegido
            if (EvaluationsManager.validate(formula.condition, prevField.value, currentField.value)) {
                return prevField;
            }
            // De lo contrario, el campo actual se convierte en el nuevo campo elegido
            return currentField;
        }, null);
        if (resultField) {
            // Ajustar según la lógica específica deseada, como devolver una fórmula particular basada en el resultado
            return resultField;
        }
        else {
            // Manejar el caso de que ninguno cumpla la condición
            return null;
        }
    }
    async calculate() {
        let applied = this.evaluate();
        if (!applied || !applied?.value) {
            // any formula apply, so we need to reset the value
            __classPrivateFieldSet(this, _FormulaComparison_value, 0, "f");
            return;
        }
        /**
         * Get the formula analyzer
         */
        const specsFormula = __classPrivateFieldGet(this, _FormulaComparison_specs, "f").formula;
        const formulaString = specsFormula.conditions[applied.name];
        const formula = __classPrivateFieldGet(this, _FormulaComparison_parent, "f").getParser({ formula: formulaString });
        const variables = formula.tokens.filter(token => token.type === "variable").map(item => item.value);
        const params = await __classPrivateFieldGet(this, _FormulaComparison_parent, "f").getParams(variables);
        try {
            const keys = Object.keys(params);
            const result = keys.length === 1 ? params[keys[0]] : parse(this.formula).evaluate(params);
            __classPrivateFieldSet(this, _FormulaComparison_value, [-Infinity, Infinity, undefined, null, NaN].includes(result)
                ? __classPrivateFieldGet(this, _FormulaComparison_emptyValue, "f")
                : Number(result.toFixed(2)), "f");
            __classPrivateFieldGet(this, _FormulaComparison_parent, "f").trigger("change");
            return __classPrivateFieldGet(this, _FormulaComparison_value, "f");
        }
        catch (e) {
            console.log("formula", this.name, this.formula, params);
            throw new Error("Error calculating the formula");
        }
    }
    calculateUpper(models) {
        let glue;
        models.forEach(item => {
            if (Number(item.value) > Number(glue?.value ?? 0))
                glue = item;
        });
        return glue;
    }
}
_FormulaComparison_plugin = new WeakMap(), _FormulaComparison_specs = new WeakMap(), _FormulaComparison_emptyValue = new WeakMap(), _FormulaComparison_tokens = new WeakMap(), _FormulaComparison_value = new WeakMap(), _FormulaComparison_variables = new WeakMap(), _FormulaComparison_observers = new WeakMap(), _FormulaComparison_isNotListenToChanges = new WeakMap(), _FormulaComparison_parent = new WeakMap();
//# sourceMappingURL=comparison.js.map