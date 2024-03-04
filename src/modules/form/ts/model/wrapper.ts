import { ReactiveModel } from '@beyond-js/reactive/model';
import { FormField } from './field';
import type { FormModel } from './model';
import { PendingPromise } from '@beyond-js/kernel/core';

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

	get callbacks() {
		return this.#parent.callbacks;
	}

	#form: FormModel;

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

	#loadedPromise: PendingPromise<boolean> = new PendingPromise();
	#childWrappersReady: number = 0;

	#parent: FormModel | WrappedFormModel;
	constructor({ parent, settings, specs }: IProps) {
		const { properties, ...props } = specs;
		super({
			...props,
			properties: ['name', ...properties],
		});

		this.#parent = parent;
		this.#settings = settings;
		this.#form = this.#settings.form;
		this.#startup(settings);
	}

	#startup = async settings => {
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

		this.#parent.triggerEvent('wrappers.children.loaded');
		await this.#checkReady();
		this.#configFields();
		this.ready = true;
	};

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
				settings: { ...item, form: this.#form },
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

	#checkReady = () => {
		const onReady = () => {
			const areAllWrappersLoaded = this.#childWrappersReady === this.#wrappers.size;

			if (!areAllWrappersLoaded) return (this.#childWrappersReady = this.#childWrappersReady + 1);
			this.loaded = true;
			this.#parent.triggerEvent('wrappers.children.loaded');
			this.#loadedPromise.resolve(true);
			this.off('wrappers.children.loaded', onReady);
		};

		if (this.loaded) return this.loaded;
		if (!this.#wrappers.size) {
			onReady();
			return this.loaded;
		}

		this.on('wrappers.children.loaded', onReady);
		return this.#loadedPromise;
	};

	#configFields = () => {
		this.#fields.forEach(this.#listenDependencies);
	};

	#listenDependencies = instance => {
		if (!instance?.dependentOn?.length) return;

		const checkField = item => {
			const DEFAULT = {
				type: 'change',
			};

			const dependency = this.#form.getField(item.field);

			['field', 'callback'].forEach(prop => {
				if (!item[prop]) throw new Error(`${item?.field} is missing ${prop}`);
			});

			if (!dependency) throw new Error(`${item?.field} is not a registered field`);

			const type = item.type ?? 'change';
			const settings = { ...DEFAULT, ...item };
			if (!this.callbacks[item.callback]) {
				throw new Error(`${item.callback} is not  a registered callback`);
			}

			const callback = this.callbacks[item.callback];
			callback({ dependency, settings, field: instance, form: this.#form });
		};

		instance.dependentOn.forEach(checkField);
	};

	registerWrapper = (wrapper: WrappedFormModel) => {
		this.#wrappers.set(wrapper.name, wrapper);
		this.#form.registerWrapper(wrapper);
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
		if (!name.includes('.')) {
			let field = this.#fields.get(name);
			if (!field) {
				this.#wrappers.forEach(item => {
					const foundField = item.getField(name);
					if (foundField) field = foundField;
				});
			}
			return field;
		}

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
