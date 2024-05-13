import { ReactiveModel } from '@beyond-js/reactive/model';
import { Lexer } from './helpers/lexer';
import { Parser } from './helpers/parser';
import { Token } from './helpers/token';
import { IComplexCondition, FormulaObserver, FormulaType, FormulaFields, IConditionalField } from './types/formulas';
import { FormulaBasic } from './variants/basic';
import { FormulaConditional } from './variants/conditional';
import { FormulaPerValue } from './variants/per-value';
import { FormulaComparison } from './variants/comparison';
type ParserData = {
	parser: Parser;
	tokens: Token[];
	[key: string]: any;
};
export /*bundle */ class FormulaManager extends ReactiveModel<FormulaManager> {
	#lexer = new Lexer(true);

	#tokens: Token[];
	get tokens() {
		return this.#tokens;
	}
	#parser: Parser;
	get parser() {
		return this.#parser;
	}

	#specs: FormulaObserver;
	get formula() {
		return this.#specs.formula;
	}
	get name() {
		return this.#specs.name;
	}

	get conditional() {
		return typeof this.#specs.formula === 'object';
	}

	get conditions() {
		if (typeof this.#specs.formula === 'string') return;
		const formula = this.#specs.formula as IComplexCondition;
		return formula.conditions;
	}

	/**
	 *  Represents the fields defined in the plugin settings
	 */
	get fields() {
		const formula = <IComplexCondition>this.formula;
		return typeof formula?.fields === 'string' ? [formula?.fields] : formula?.fields;
	}

	#parsedBase;
	get parsedBase() {
		return this.#parsedBase;
	}
	#type: string;
	get type() {
		return this.#type;
	}

	get base() {
		const formula = <IComplexCondition>this.#specs.formula;
		return formula.base;
	}

	#variables: string[] = [];
	get variables() {
		return this.#variables;
	}

	get value() {
		return this.#instance.value;
	}

	#parsers: Map<string, ParserData> = new Map();
	#plugin: any;
	#instance: any;

	constructor(plugin, specs) {
		super();
		this.#plugin = plugin;
		this.#specs = specs;
		this.#initialize();
	}

	#initialize() {
		this.#type = this.getType();

		const objects = {
			basic: FormulaBasic,
			'base-conditional': FormulaConditional,
			'value-conditions': FormulaPerValue,
			comparison: FormulaComparison,
		};

		if (!objects[this.type]) {
			throw new Error(`this type ${this.type} not found`);
		}

		this.#instance = new objects[this.type](this, this.#plugin, this.#specs);
	}

	initialize() {
		this.#instance.initialize();
	}
	/**
	 * Returns the models that are part of the formula
	 * The models could be fields or formulas
	 * @param variables
	 * @returns
	 */
	getModels(variables: FormulaFields) {
		variables = variables as string[]
		return variables.map(name => {
			if (this.#plugin.formulas.has(name)) return this.#plugin.formulas.get(name);
			return this.#plugin.form.getField(name);
		});
	}

	private getType(): FormulaType {
		const { type, formula } = this.#specs;
		if (type) return type;
		if (typeof formula === 'string') return 'basic';
		if (formula.conditions) return formula.base ? 'base-conditional' : 'value-conditions';
	}

	processConditional() {
		const formula = <IComplexCondition>this.formula;
		if (this.base) {
			this.#parsedBase = this.getParser({ formula: this.base });
		}
	}
	calculate() {
		if (!this.#instance || this.#instance.calculate) {
			console.warn('No instance or calculate method found', this.#instance);
		}
		this.#instance.calculate();

		this.trigger('change');
		return;
	}

	/**
	 * Returns the parser for the formula, if the parser is already created it will return the memoized parser
	 *
	 *
	 * The formula is tokenized and parsed to create a parser instance
	 * the object returned contains the tokens, the parser and the formula
	 * @param data Receives the formula to be parsed
	 * @returns
	 */
	getParser(data): ParserData {
		if (!data.formula) throw new Error('To get a parser you must provide a formula');
		if (this.#parsers.has(data.formula)) return this.#parsers.get(data.formula);
		const tokens = this.#lexer.tokenize(data.formula);
		const parser = new Parser(tokens);
		const result = { tokens, parser, ...data };

		this.#parsers.set(data.formula, result);
		return result;
	}

	getParams(variables: string[]) {
		const params = {};
		const { form, formulas } = this.#plugin;
		const build = value => {
			/**
			 * the value could be a formula or a field
			 */
			const element = formulas.has(value) ? formulas.get(value) : form.getField(value);
			if (!element)
				throw new Error(`Field ${value} used in formula ${this.name}, not found in form ${form.name}, `);

			params[value] = [undefined, '', null, NaN].includes(element.value) ? 0 : element.value;
		};
		variables.forEach(build);

		return params;
	}

	/**
	 * A form can have multiple formulas, this method will create an instance of the formula manager
	 * and memoize it to avoid creating multiple instances of the same formula.
	 * @param specs
	 * @returns
	 */
	static async create(plugin, specs) {
		const instance = new FormulaManager(plugin, specs);
		// FormulaManager.instances.set(plugin.form.name, instance);
		return instance;
	}
}
