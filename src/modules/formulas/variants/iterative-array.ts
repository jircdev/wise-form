import type { FormulaManager } from '..';
import { EvaluationsManager } from '../helpers/evaluations';
import { Token } from '../helpers/token';
import { FormulaObserver, IComplexCondition } from '../types/formulas';
import { parse } from 'mathjs';

export class IterativeArrayFormula {
	#plugin: any;
	#specs: FormulaObserver;
	#tokens: Token[];
	get formula() {
		return this.#specs.formula;
	}
	get base() {
		const formula = <IComplexCondition>this.#specs.formula;
		return formula.base;
	}
	#value: string | number | undefined | 0;
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

	#isNotListenToChanges = false
	constructor(parent, plugin, specs) {
		this.#parent = parent;
		this.#plugin = plugin;
		this.#specs = specs;
		this.#round = specs.round;
		this.#ceil = specs.ceil;
		this.#emptyValue = this.#specs.emptyValue;
		this.#isNotListenToChanges = specs.isNotListenToChanges
	}

	initialize() {
		const fieldArray = this.#plugin.form.getField(this.#specs.arrayFieldName);
		if (!fieldArray) {
			console.error(`Field ${this.#specs.arrayFieldName} does NOT exist.`);
			return;
		}
		fieldArray.on('change', this.calculate.bind(this));
	}

	async calculate() {

		const formulaField = this.#plugin.form.getField(this.name);

		const fieldArray = this.#plugin.form.getField(this.#specs.arrayFieldName);

		if (!fieldArray) {
			console.error(`Field ${this.#specs.arrayFieldName} does NOT exist.`);
			return;
		}

		const entries = fieldArray[this.#specs.arrayFieldProperty];

		if (!Array.isArray(entries)) {
			console.error(`Property ${this.#specs.arrayFieldProperty} is not an array.`);
			return;
		}

		const empty = !entries.length;
		const formula: any = this.#specs.formula;
		let formulaEvaluate = formula?.formula || formula
		if (empty) {
			// If all models are empty, set the input to empty if exists.
			if (formulaField) formulaField.set({ value: this.#emptyValue !== undefined ? this.#emptyValue : '' });
			this.#value = undefined;
			this.#parent.trigger('change');
			return;
		}

		try {
			let totalResult: string | number = 0;
			for (let item of entries) {
				if (formula.conditions) {
					for (const condition of formula.conditions) {
						const comparisonValue = item[condition.property]
						let conditionMet = EvaluationsManager.validate(condition.condition, comparisonValue, condition.value);
						if (conditionMet) {
							formulaEvaluate = condition.formula;
							break
						} else {
							formulaEvaluate = formula.base
						}
					}
				}
				const attrs = this.sanitizeData(item);
				let result = parse(formulaEvaluate as string).evaluate(attrs);
				const isInvalidResult = [-Infinity, Infinity, undefined, null, NaN].includes(result);
				if (this.#round && !isInvalidResult) result = Math.round(result);
				if (this.#ceil && !isInvalidResult) result = Math.ceil(result);
				totalResult = isInvalidResult ? totalResult : Number(totalResult) + Number(result.toFixed(2))
			}
			const isInvalidResult = [-Infinity, Infinity, undefined, null, NaN, ''].includes(totalResult);
			this.#value = isInvalidResult ? this.#emptyValue : totalResult
			if (formulaField) formulaField.set({ value: this.#value });
			this.#parent.trigger('change');
		} catch (e) {
			console.log('formula', this.name, this.formula);
			console.trace(e);
			throw new Error(`Error calculating the formula: ${e.message} ${this.name}`);
		}
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
