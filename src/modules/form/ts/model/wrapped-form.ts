import { ReactiveModel } from '@beyond-js/reactive/model';
import { FormField } from './field';
import type { FormModel } from './model';

interface IProps {
	parent: FormModel | WrappedFormModel;
	settings;
	specs: { properties: string[] };
}

export /*bundle*/
class WrappedFormModel extends ReactiveModel<WrappedFormModel> {
	#settings;
	get settings() {
		return this.#settings;
	}

	#callbacks: Record<string, (...args) => void> = {};

	#initialValues: Record<string, string> = {};
	get originalValues() {
		return this.#initialValues;
	}

	#wrappers: Map<string, WrappedFormModel> = new Map();
	get wrappers() {
		return this.#wrappers;
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

	#parent: FormModel | WrappedFormModel;
	constructor({ parent, settings, specs }: IProps) {
		const { properties, ...props } = specs;
		super({
			...props,
			properties: ['name', ...properties],
		});

		this.#parent = parent;
		this.#callbacks = this.#parent.callbacks;
		this.#settings = settings;
		this.#startup(settings);
	}

	#startup(settings) {
		const values = settings.values || {};
		this.#settings.fields.map(item => {
			const instance = this.#getInstance(item, values);
			const onChange = () => {
				this[item.name] = instance.value;
				this.triggerEvent();
			};
			instance.on('change', onChange);
			this.#fields.set(item.name, instance);
		});

		// this.#configFields();
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
				specs: { properties: properties || [], ...values },
			});

			let toSet = {};
			Object.keys(instance?.getProperties()).forEach(property => (toSet[property] = item[property] || ''));
			instance.set(toSet);

			this.registerWrapper(instance);
			return instance;
		}

		instance = new FormField({
			parent: this,
			specs: {
				...item,
				value: values[item.name] || item?.value,
				properties: item?.properties || [],
			},
		});

		if (item?.properties) {
			let toSet = {};
			item?.properties.forEach(property => (toSet[property] = item[property] || ''));
			instance.set(toSet);
		}

		return instance;
	};

	#configFields = () => {
		this.#fields.forEach(item => {
			if (!item?.dependentOn?.length) return;
			const toListenField = item.dependentOn;

			const dependantItem = this.getField(toListenField.field);
			if (!dependantItem) throw new Error(`${toListenField?.field} isnt a registered field`);

			const type = toListenField?.type;

			if (toListenField?.callback || !this.#callbacks[toListenField?.callback])
				throw new Error(`${toListenField?.callback} isnt an registered callback`);

			const callback = this.#callbacks[toListenField?.callback];
			dependantItem.on(type, () => callback({ from: dependantItem, to: item }));
		});
	};

	registerWrapper = (wrapper: WrappedFormModel) => {
		this.#wrappers.set(wrapper.name, wrapper);
		this.#parent.registerWrapper(wrapper);
	};

	setField(name: string, value) {
		if (!this.getField(name)) {
			console.error('Field not found', name, this.#settings.name, this.#fields.keys());
			return;
		}
		this.getField(name).set({ value });
	}

	getField(name: string) {
		if (!name) return console.warn('You need to provide a name to get a field in form ', this.#settings.name);
		if (!name.includes('.')) return this.#fields.get(name);

		const [wrapperName, ...others] = name.split('.');
		const currentWrapper = this.#wrappers.get(wrapperName);

		const otherWrapper = others.join('.');
		return currentWrapper.getField(otherWrapper);
	}

	clear = () => {
		this.#fields.forEach(field => field.clear());
		this.triggerEvent();
		this.triggerEvent('clear');
	};
}
