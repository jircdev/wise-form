import { ReactiveModel } from '@beyond-js/reactive/model';
import type { FormModel } from '../model';
import { FormulaManager, Lexer, Parser, Token } from '@bgroup/wise-form/formulas';
export class PluginsManager extends ReactiveModel<PluginsManager> {
	#plugins: Record<string, any> = {};

	private static instances: Map<string, any> = new Map();
	private static plugins: Map<string, any> = new Map();

	setPlugins(specs) {
		this.#plugins = { ...this.#plugins, ...specs };
	}

	static formulas: Record<string, any> = {};
	#model: FormModel;
	constructor(model) {
		super();
		this.#model = model;
		this.start();
	}

	private start() {
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
			PluginsManager.formulas[name] = { lexer, parser, tokens };

			const field = this.#model.getField(name);
			console.log(0.1, 'conseguimos a ', name, field), observer;
		});
	}
    
	static validate(form: FormModel) {
		if (!form.settings.observers) return;

		const instance = PluginsManager.instances.get(form.name) ?? new PluginsManager(form);

		if (!PluginsManager.instances.has(form.name)) {
			PluginsManager.instances.set(form.name, instance);
		}
	}
}

globalThis.PluginsManager = PluginsManager;
