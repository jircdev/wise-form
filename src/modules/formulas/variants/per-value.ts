import type { FormulaManager } from '../';
import { EvaluationsManager } from '../helpers/evaluations';
import { Parser } from '../helpers/parser';
import { FormulaObserver, IComplexCondition, ParserData } from '../types/formulas';
import { filter, parse } from 'mathjs';

export class FormulaPerValue {
	#plugin: any;
	#emptyValue: undefined;
	#specs: FormulaObserver;
	get formula() {
		return this.#specs.formula;
	}
	#value: string | number | undefined | 0;
	get value() {
		return this.#value;
	}
	get name() {
		return this.#specs.name;
	}

	#observers: string[];
	get observers() {
		return this.#observers;
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

	#parent: FormulaManager;
	#parsers: ParserData[];
	#mainFields: any[];
	#isNotListenToChanges = false
	constructor(parent, plugin, specs) {
		this.#parent = parent;
		this.#plugin = plugin;
		this.#specs = specs;
		this.#observers = specs.formula.observers;
		this.#isNotListenToChanges = specs.isNotListenToChanges
	}

	initialize() {
		const { form } = this.#plugin;
		const fields = new Set<string>();

		this.#mainFields = this.#parent.getModels(this.fields);

		/**
		 * The method will iterate over the conditions to get the parser for each value
		 * and get access to the fields that are part of the formula and be able to evaluate it
		 * changes.
		 */
		this.conditions.forEach(condition => {
			if (!condition.condition) {
				throw new Error('the formula per value must contain a condition property in the condition`s item');
			}
			if (!condition.values) {
				throw new Error('the formula per value must contain a values property in the condition`s item');
			}

			const parsers = condition.values.map(item => this.#parent.getParser(item));
			this.#parsers = parsers;
			parsers.forEach(parser => {
				parser.tokens.filter(token => token.type === 'variable').forEach(token => fields.add(token.value));
			});
		});

		fields.forEach(field => {
			const model = form.getField(field);
			if (model) model.on('change', this.listenConditionals.bind(this));
		});

		this.listenConditionals();
		if (!this.#isNotListenToChanges) this.#mainFields.forEach(item => item.on('change', this.calculate.bind(this)));
		if (!this.#isNotListenToChanges) if (this.#observers && Array.isArray(this.#observers) && !!this.#observers.length) {
			const fields = this.#parent.getModels(this.#observers);
			fields.forEach(field => {
				if (!field) return;
				field.on('change', this.calculateAll.bind(this));
			});
		}
	}

	calculateAll() {
		this.#mainFields.forEach(field => this.calculate(field));
	}
	listenConditionals() {
		this.#mainFields.forEach(field => {
			if (!field) return;
			field.on('change', this.calculate.bind(this));
		});
	}

	async calculate(field) {
		if (!field) return;
		const { form } = this.#plugin;
		const formula = this.evaluate(field.value);

		if (!formula) return;

		const variables = formula.tokens.filter(token => token.type === 'variable').map(item => item.value);
		const params = await this.#parent.getParams(variables);
		const formulaField = form.getField(this.name);

		try {
			const keys = Object.keys(params);
			const result = keys.length === 1 ? params[keys[0]] : parse(formula.formula as string).evaluate(params);
			this.#value = [-Infinity, Infinity, undefined, null, NaN].includes(result)
				? this.#emptyValue
				: Number(result.toFixed(2));
			formulaField && formulaField.set({ value: this.#value });
			this.#parent.trigger('change');
		} catch (e) {
			console.log(e);
			throw new Error('Error calculating the formula');
		}
	}

	evaluate(value) {
		let formula = undefined;
		if ([null, undefined].includes(value)) {
			return;
		}
		this.conditions.forEach(item => {
			const { condition, values } = item;
			if (!condition) {
				throw new Error('the formula per value must contain a condition property in the condition`s item');
			}
			if (!values) {
				throw new Error('the formula per value must contain a values property in the condition`s item');
			}
			const index = values.findIndex(item => EvaluationsManager.validate(condition, value, item.value));

			if (index > -1) formula = this.#parent.getParser(values[index]);
		});

		return formula;
	}
}
