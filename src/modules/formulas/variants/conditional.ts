import type { FormulaManager } from '..';
import { conditionsTypes } from '../helpers/condition-types';
import { EvaluationsManager } from '../helpers/evaluations';
import { EvaluatedFormula, FormulaObserver, IComplexCondition, IConditionalField } from '../types/formulas';
import { parse } from 'mathjs';

export class FormulaConditional {
	#plugin: any;
	#specs: FormulaObserver;
	#emptyValue: undefined;
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

	/**
	 * FormField type
	 */
	#fields: any;

	#parent: FormulaManager;
	#ceil: boolean
	#round: boolean;
	#isNotListenToChanges = false
	constructor(parent, plugin, specs) {
		this.#parent = parent;
		this.#plugin = plugin;
		this.#specs = specs;
		this.#round = specs.round;
		this.#ceil = specs.ceil;
		this.#emptyValue = specs.emptyValue;

		if (specs.isNotListenToChanges) this.#isNotListenToChanges = specs.isNotListenToChanges
	}

	initialize() {
		try {
			const { form } = this.#plugin;

			if (!this.fields) {
				throw new Error(`Fields not found in formula ${this.name}`);
			}
			const fields = this.fields.map(name => {
				const formula = this.#plugin.formulas.get(name);
				if (formula) return formula
				const field = form.getField(name);
				return field
			});
			this.#fields = fields;

			if (!this.#isNotListenToChanges) fields.forEach(field => {

				if (!field) {
					throw new Error(`Field ${this.name} not found in form ${form.name}`);
				}
				field.on('change', this.calculate.bind(this));
			});
		} catch (e) { }
	}

	evaluate() {
		const formula = <IComplexCondition>this.#specs.formula;
		let evaluatedFormula: any = { formula: formula.base }; // Use the base formula by default
		if (formula.conditions) {
			for (const condition of formula.conditions) {
				let conditionMet = false;
				if (condition.conditions) {
					// If there are nested conditions, all must be met
					conditionMet = condition.conditions.every(subCondition => {
						const fieldValues = subCondition.fields.map(fieldName => {
							const field = this.#fields.find(f => f.name === fieldName);
							return field ? field.value : this.#emptyValue;
						});
						return EvaluationsManager.validateAll(subCondition.condition, fieldValues, subCondition.value);
					});
				} else {
					const fieldValues = condition.fields.map(fieldName => {

						const field = this.#fields.find(f => f.name === fieldName);
						return field ? field.value : this.#emptyValue;
					});
					const conditionType =

						!!condition.type && conditionsTypes[condition.type]
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
		const formula = this.evaluate();

		// todo: Review if this section can be replaced by formulaManager.variables property.
		const { tokens } = this.#parent.getParser(formula);
		const variables = tokens.filter(token => token.type === 'variable').map(item => item.value);
		const params = await this.#parent.getParams(variables);
		try {
			const keys = Object.keys(params);
			let result = keys.length === 1 ? params[keys[0]] : parse(formula.formula as string).evaluate(params);
			const isInvalidResult = [-Infinity, Infinity, undefined, null, NaN].includes(result);
			if (this.#round && !isInvalidResult) result = Math.round(result);
			if (this.#ceil && !isInvalidResult) result = Math.ceil(result);
			this.#value = isInvalidResult || typeof result === 'object' ? this.#emptyValue : Number(result.toFixed(2));

			this.#parent.trigger('change');

			const model = this.#plugin.form.getField(this.name);
			model && model.set({ value: this.#value });
			return this.#value;
		} catch (e) {
			console.log('formula', this.name, formula.formula, params);
			console.error(e);
			throw new Error('Error calculating the formula');
		}
	}
}
