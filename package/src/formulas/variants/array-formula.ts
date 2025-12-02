import type { FormulaManager } from '..';
import { EvaluationsManager } from '../helpers/evaluations';
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
        this.#specs.emptyValue = specs.emptyValue;

        this.#formulaField = this.#plugin.form.getField(this.name);
    }

    initialize() {
        this.#formulaField.on('change', this.calculate.bind(this));
    };

    evaluate = (data: { formulas: any[], values: any }) => {
        const values = {};
        for (const formula of data.formulas) {

            let result;
            let formulaEvaluate = formula.formula
            try {
                if (formula.conditions) {
                    for (const condition of formula.conditions) {
                        const comparisonValue = { ...data.values, ...values }[condition.property]
                        let conditionMet = EvaluationsManager.validate(condition.condition, comparisonValue, condition.value);
                        if (conditionMet) {
                            formulaEvaluate = condition.formula;
                            break
                        }
                    }
                }
                const attrs = this.sanitizeData({ ...data.values, ...values });

                result = parse(formulaEvaluate as string).evaluate(attrs);

            } catch (error) {
                console.log("Error evaluating formula:", formula.formula, "Error:", error);
            }
            const isInvalidResult = [-Infinity, Infinity, undefined, null, NaN].includes(result);

            if (formula.round && !isInvalidResult) result = Math.round(result);
            if (formula.ceil && !isInvalidResult) result = Math.ceil(result);
            result = isInvalidResult ? formula.emptyValue : Number(result.toFixed(2));
            values[formula.propertyToSet] = result;
        }
        return values;
    };

    async calculate() {
        const formulaField = this.#plugin.form.getField(this.name);
        if (!formulaField) return;
        const value = formulaField[this.#specs.propertyValue || 'entries']
        if (!value || !Array.isArray(value) || !value.length) {
            formulaField.set({ [this.#specs.propertyValue]: [] });
            return
        };
        const newValue = value.map(item => {
            let results = this.evaluate({ formulas: this.#specs.formulas, values: item })
            return {
                ...item,
                ...results
            }
        });
        this.#value = newValue
        formulaField.set({ [this.#specs.propertyValue]: newValue })
    };


    private sanitizeData(data: any): any {
        if (Array.isArray(data)) {
            return data.map(item => this.sanitizeData(item));
        } else if (typeof data === 'object' && data !== null) {
            const sanitizedData: any = {};
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    sanitizedData[key] = this.sanitizeData(data[key]);
                }
            }
            return sanitizedData;
        } else {
            return this.sanitizeValue(data);
        }
    }

    private sanitizeValue(value: any, defaultValue: number = 0): number {
        return (value === null || value === undefined || isNaN(value)) ? defaultValue : Number(value);
    }
}

