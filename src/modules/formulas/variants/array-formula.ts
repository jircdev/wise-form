import type { FormulaManager } from '..';
import { FormulaObserver, IComplexCondition } from '../types/formulas';
import { parse } from 'mathjs';

export class FormulaArray {
    #plugin: any;
    #specs: FormulaObserver;
    get formula() {
        return this.#specs.formula;
    }
    get base() {
        const formula = <IComplexCondition>this.#specs.formula;
        return formula.base;
    }
    #value: any[] = [];
    get value() {
        return this.#value;
    }
    get name() {
        return this.#specs.name;
    }
    /**
     *  Represents the fields defined in the plugin settings
     */
    get fields() {
        const formula = <IComplexCondition>this.formula;
        return typeof formula?.fields === 'string' ? [formula?.fields] : formula?.fields;
    }

    get conditions() {
        if (typeof this.#specs.formula === 'string') return;
        const formula = this.#specs.formula as IComplexCondition;
        return formula.conditions;
    }

    #emptyValue: string | number;
    #variables: string[] = [];
    get variables() {
        return this.#variables;
    }

    #round: boolean;
    #ceil: boolean

    #parent: FormulaManager;

    #formulaField
    constructor(parent, plugin, specs) {
        this.#parent = parent;
        this.#plugin = plugin;
        this.#specs = specs;
        this.#round = specs.round;
        this.#ceil = specs.ceil;
        if (this.#specs.emptyValue) this.#emptyValue = this.#specs.emptyValue;
        this.#formulaField = this.#plugin.form.getField(this.name);
    }

    initialize() {
        this.#formulaField.on('change', this.calculate.bind(this));
    };

    evaluate = (data: { formulas: any[], values: any }) => {
        const values = {};
        for (const formula of data.formulas) {
            let result = parse(formula.formula as string).evaluate(data.values);
            const isInvalidResult = [-Infinity, Infinity, undefined, null, NaN].includes(result);
            if (formula.round && !isInvalidResult) result = Math.round(result);
            if (formula.ceil && !isInvalidResult) result = Math.ceil(result);
            result = isInvalidResult ? formula.emptyValue : result;
            values[formula.propertyToSet] = result
        };
        return values
    }
    async calculate() {
        const formulaField = this.#plugin.form.getField(this.name);
        if (!formulaField) return;
        const value = formulaField[this.#specs.propertyValue || 'entries']
        if (!value || !Array.isArray(value) || !value.length) {
            formulaField.set({ [this.#specs.propertyValue]: [] });
            return
        };
        console.log("🚀 ~ FormulaArray ~ calculate ~ value:", value)

        const newValue = value.map(item => {
            let results = this.evaluate({ formulas: this.#specs.formulas, values: item })
            console.log("🚀 ~ FormulaArray ~ newValue ~ results:", results)
            return {
                ...item,
                ...results
            }
        });
        console.log("🚀 ~ FormulaArray ~ newValue ~ newValue:", newValue)
        this.#value = newValue
        formulaField.set({ [this.#specs.propertyValue]: newValue })
    };


}
