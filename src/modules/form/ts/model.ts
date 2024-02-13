import { ReactiveModel } from '@beyond-js/reactive/model';
export /*bundle*/
class Model extends ReactiveModel<Model> {
	#settings;

	#defaultValues: Record<string, string> = {};
	get defaultValues() {
		return this.#defaultValues;
	}

	#values: Record<string, string> = {};
	get values() {
		return this.#defaultValues;
	}
	get fields() {
		return this.#settings.fields;
	}

	constructor(settings) {
		super();
		this.reactiveProps(['ready']);
		this.#settings = settings;
		this.#startup(settings);
	}

	#startup(settings) {
		this.ready = true;

		const defaultValues = {};
		const fields = this.#settings.fields.map(item => {
			defaultValues[item.name] = '';
		});
		this.#defaultValues = defaultValues;
	}
}
