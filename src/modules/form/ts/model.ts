import { ReactiveModel } from '@beyond-js/reactive/model';
export /*bundle*/
class Model extends ReactiveModel {
	#data;
	get data() {
		return this.#data;
	}
	#settings;
	get settings() {
		return this.#settings;
	}
	constructor(settings, data) {
		super();
		this.#startup(settings, data);
	}

	#startup(settings, data) {
		if (!data) data = {};
		this.#data = data;
		this.#settings = settings;
		this.ready = true;
	}

	getValue(field) {
		return this.#data[field.name] ?? '';
	}
}
