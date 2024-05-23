import type { FormulaManager } from "..";
import { EvaluationsManager } from "../helpers/evaluations";

import { Token } from "../helpers/token";
import { FormulaObserver, IComplexCondition, IConditionalField } from "../types/formulas";
import { number, parse } from "mathjs";

export class FormulaComparison {
	#plugin: any;
	#specs: FormulaObserver;
	#emptyValue: undefined;
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
		return typeof formula?.fields === "string" ? [formula?.fields] : formula?.fields;
	}

	get conditions() {
		if (typeof this.#specs.formula === "string") return;
		const formula = this.#specs.formula as IComplexCondition;
		return formula.conditions;
	}

	#variables: string[] = [];
	get variables() {
		return this.#variables;
	};

	#isNotListenToChanges = false

	#parent: FormulaManager;
	constructor(parent, plugin, specs) {
		this.#parent = parent;
		this.#plugin = plugin;
		this.#specs = specs;
		this.#isNotListenToChanges = specs.isNotListenToChanges
	}

	initialize() {
		if (!Array.isArray(this.#specs.fields)) {
			throw new Error("The fields property must be an array");
		}
		const models = this.#parent.getModels(this.#specs.fields);
		if (!this.#isNotListenToChanges) models.forEach(model => model.on("change", this.calculate.bind(this)));
	}

	start() { }

	evaluate() {
		const formula = <IComplexCondition>this.#specs.formula;

		if (typeof formula === "string" || !formula.conditions) {
			console.error("Invalid formula configuration");
			return null;
		}
		const models = this.#parent.getModels(this.#specs.fields);
		let fieldValues = models.map(fieldModel => {
			if (!fieldModel) return;
			return { name: fieldModel.name, value: fieldModel ? fieldModel.value : null };
		});

		// Utilizar reduce para comparar cada par de valores consecutivos y determinar cuál cumple la condición
		const resultField = fieldValues.reduce((prevField, currentField) => {
			if (!prevField) return currentField;

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
		} else {
			// Manejar el caso de que ninguno cumpla la condición
			return null;
		}
	}

	async calculate() {
		let applied = this.evaluate();

		if (!applied || !applied?.value) {
			// any formula apply, so we need to reset the value
			this.#value = 0;
			return;
		}
		/**
		 * Get the formula analyzer
		 */

		const specsFormula = this.#specs.formula as IComplexCondition;
		const formulaString = specsFormula.conditions[applied.name];
		const formula = this.#parent.getParser({ formula: formulaString });
		const variables = formula.tokens.filter(token => token.type === "variable").map(item => item.value);
		const params = await this.#parent.getParams(variables);

		try {
			const keys = Object.keys(params);
			const result = keys.length === 1 ? params[keys[0]] : parse(this.formula as string).evaluate(params);

			this.#value = [-Infinity, Infinity, undefined, null, NaN].includes(result)
				? this.#emptyValue
				: Number(result.toFixed(2));
			this.#parent.trigger("change");
			return this.#value;
		} catch (e) {
			console.log("formula", this.name, this.formula, params);
			throw new Error("Error calculating the formula");
		}
	}

	calculateUpper(models) {
		let glue;
		models.forEach(item => {
			if (Number(item.value) > Number(glue?.value ?? 0)) glue = item;
		});

		return glue;
	}
}
