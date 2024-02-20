import { ReactiveModel } from '@beyond-js/reactive/model';
import { FormField } from './field';

import type { FormModel } from './model';
export /*bundle*/
class WrappedFormModel extends ReactiveModel<WrappedFormModel> {
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

	getField(name: string): FormField | undefined {
		if (!name) {
			console.warn('You need to provide a name to get a field in form ', this.#settings.name);
			return;
		}
		if (!name.includes('.')) return this.#fields.get(name);
		const [wrapperName, ...others] = name.split('.');
		const currentWrapper = this.#fields.get(wrapperName);

		const otherWrapper = others.join('.');
		return currentWrapper.getField(otherWrapper);
	}

	clear = () => {
		this.#fields.forEach(field => {
			field.clear();
		});
		this.triggerEvent();
		this.triggerEvent('clear');
	};

	#parent: FormModel;
	constructor(parent, settings, reactiveProps?) {
		super(reactiveProps);
		this.#parent = parent;
		this.#settings = settings;
		this.#startup(settings);
	}

	#startup(settings) {
		const values = settings.values || {};

		this.#settings.fields.map(item => {
			let instance: WrappedFormModel | FormField;
			let externalProperties: string[] = [];
			let externalValues: Record<string, any> = {};
			if (Array.isArray(item?.properties)) {
				externalProperties = item?.properties.map(item => item.name);
				item?.properties.forEach(item => (externalValues[item.name] = item.value));
			}

			if (item.type === 'wrapper') {
				if (!item.fields) throw new Error(`Wrapper ${item.name} must have fields property`);
				instance = new WrappedFormModel(this, { ...item, value: values[item.name] || '' });
			} else
				instance = new FormField(this, {
					...item,
					value: values[item.name] || '',
					properties: externalProperties,
				});
			if (externalValues && Object.values(externalValues).length) instance.set(externalValues);

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
		if (!this.getField(name)) {
			console.error('Field not found', name, this.#settings.name, this.#fields.keys());
			return;
		}
		this.getField(name).set({ value });
	}
}
