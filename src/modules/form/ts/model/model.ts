import { ReactiveModel } from '@beyond-js/reactive/model';
import { FormField } from './field';
import { WrapperFormField } from './wrapper';
import { WrappedFormModel } from './wrapped-form';
export /*bundle*/
class FormModel extends ReactiveModel<FormModel> {
	#settings;
	get settings() {
		return this.#settings;
	}

	#initialValues: Record<string, string> = {};
	get originalValues() {
		return this.#initialValues;
	}

	get values() {
		const data = {};
		this.#fields.forEach((field, key) => {
			data[key] = field.value;
		});
		return data;
	}
	#fields: Map<string, FormField> = new Map();
	get fields() {
		return this.#fields;
	}

	constructor(settings, reactiveProps?) {
		super(reactiveProps);

		this.#settings = settings;
		this.#startup(settings);
	}

	#startup(settings) {
		const values = settings.values || {};

		this.#settings.fields.map(item => {
			let instance;
			if (item.type === 'wrapper') {
				console.log(0.2, item);
				const properties = item.fields.map(item => item.name);
				const values = item.values || {};

				instance = new WrappedFormModel(this, item, { properties, ...values });
			} else {
				instance = new FormField(this, { ...item, value: values[item.name] || '' });
			}

			const onChange = () => {
				this[item.name] = instance.value;
				this.triggerEvent();
			};
			instance.on('change', onChange);
			this.#fields.set(item.name, instance);
		});

		this.ready = true;
	}

	setField(name: string, value) {
		this.#fields.get(name).set({ value });
	}
}
