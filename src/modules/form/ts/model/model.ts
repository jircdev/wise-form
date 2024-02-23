import { ReactiveModel } from '@beyond-js/reactive/model';
import { FormField } from './field';
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
	#fields: Map<string, FormField | WrappedFormModel> = new Map();
	get fields() {
		return this.#fields;
	}

	constructor(settings, reactiveProps?) {
		super(reactiveProps);

		this.#settings = settings;
		this.#startup(settings);
	}

	#startup(settings) {
		const values = settings?.values || {};

		this.#settings.fields.map(item => {
			const instance = this.#getInstance(item, values);

			const onChange = () => {
				this[item.name] = instance.value;
				this.triggerEvent();
			};
			instance.on('change', onChange);
			this.#fields.set(item.name, instance);
		});

		this.ready = true;
	}

	#getInstance = (item, values: Record<string, unknown>) => {
		let instance: WrappedFormModel | FormField;
		let externalValues: Record<string, any> = {};
		if (Array.isArray(item?.properties)) {
			item?.properties.forEach(item => (externalValues[item.name] = item.value));
		}

		if (item.type === 'wrapper') {
			if (!item.fields) throw new Error(`Wrapper ${item.name} must have fields property`);
			const fieldsProperties = item.fields.map(item => item.name);

			const properties = [...fieldsProperties, ...(item?.properties || [])];
			const values = item.values || {};
			instance = new WrappedFormModel({
				parent: this,
				settings: item,
				properties: { externalProperties: properties || [], ...values },
			});

			if (item?.properties) {
				let toSet = {};
				item?.properties.forEach(property => (toSet[property] = item[property] || ''));
				instance.set(toSet);
			}
			return instance;
		}

		instance = new FormField({
			parent: this,
			properties: {
				...item,
				value: values[item.name] || item?.value,
				externalProperties: item?.properties || [],
			},
		});

		if (item?.properties) {
			let toSet = {};
			item?.properties.forEach(property => (toSet[property] = item[property] || ''));
			instance.set(toSet);
		}

		return instance;
	};

	setField = (name: string, value) => this.#fields.get(name).set({ value });

	getField(name: string) {
		if (!name) return console.warn('You need to provide a name to get a field in form ', this.#settings.name);
		if (!name.includes('.')) return this.#fields.get(name);

		const [wrapperName, ...others] = name.split('.');
		const currentWrapper = this.#fields.get(wrapperName);

		const otherWrapper = others.join('.');
		return currentWrapper.getField(otherWrapper);
	}

	clear = () => {
		this.#fields.forEach(field => field.clear());
		this.triggerEvent();
		this.triggerEvent('clear');
	};
}
