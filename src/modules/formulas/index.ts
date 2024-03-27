import { ReactiveModel } from '@beyond-js/reactive/model';
import { Lexer } from './lexer';
import type { FormModel } from '@bgroup/wise-form/form';
import { Parser } from './parser';
export /*bundle */ class FormulaManager extends ReactiveModel<FormulaManager> {
	static formulas: Record<string, any> = {};

	#model: FormModel;
	constructor(model) {
		super();
		this.#model = model;
		this.start();
	}
	start() {
		const lexer = new Lexer();

		this.#model.settings.observers.forEach(observer => {
			const { name, formula } = observer;

			if (!formula) {
				throw new Error(`Observer in form "${this.#model.name}" must have a formula`);
			}
			if (!observer.name) {
				throw new Error(`Observer in form "${this.#model.name}" must have a name`);
			}
			const tokens = lexer.tokenize(formula);
			const parser = new Parser(tokens);

			const field = this.#model.getField(name);
			console.log(0.1, 'conseguimos a ', name, field), observer;
		});
	}
}
