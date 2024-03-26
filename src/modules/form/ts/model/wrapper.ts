import { ReactiveModel } from '@beyond-js/reactive/model';
import { FormField } from './field';
import type { FormModel } from './model';
import { PendingPromise } from '@beyond-js/kernel/core';

interface IProps {
	parent: FormModel | WrappedFormModel;
	settings;
	specs: { properties: string[] };
}

/**
 * Represents a wrapper model that can contain both fields and other wrapper models, facilitating the management of complex form structures. This class extends `ReactiveModel` to provide reactive capabilities, allowing it to respond dynamically to changes within its fields or nested wrappers.
 * @extends ReactiveModel<WrappedFormModel>
 */
export /*bundle*/
class WrappedFormModel extends ReactiveModel<WrappedFormModel> {
	// Holds the wrapper's specific settings.
	#settings;
	get settings() {
		return this.#settings;
	}

	get callbacks() {
		return this.#parent.callbacks;
	}

	// Reference to the top-level FormModel instance.
	#form: FormModel;
	get form() {
		return this.#form;
	}

	// Stores the original values of the fields within the wrapper for reset purposes.
	#initialValues: Record<string, string> = {};
	get originalValues() {
		return this.#initialValues;
	}

	// A map of child wrapper models, allowing nested wrappers.
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

	// A map of FormField and WrappedFormModel instances representing the wrapper's content.
	#fields: Map<string, FormField | WrappedFormModel> = new Map();
	get fields() {
		return this.#fields;
	}

	// Utilized to track the loading state of the wrapper and its children.
	#loadedPromise: PendingPromise<boolean> = new PendingPromise();

	// Counter for tracking the readiness of nested wrappers.
	#childWrappersReady: number = 0;

	// Reference to the parent FormModel or WrappedFormModel.
	#parent: FormModel | WrappedFormModel;

	/**
	 * Constructs a WrappedFormModel instance, initializing fields and nested wrappers based on provided settings.
	 * @param {IProps} props - Configuration properties for the wrapper, including its parent model, settings, and specifications for fields and nested wrappers.
	 */
	constructor({ parent, settings, specs }: IProps) {
		const { properties, ...props } = specs;
		super({
			...props,
			properties: ['name', 'dependentOn', ...properties],
		});

		this.#parent = parent;
		this.#settings = settings;
		this.#form = this.#settings.form;
		this.#startup(settings);
	}

	/**
	 * Initializes the wrapper model by setting up its fields and nested wrappers according to the provided settings.
	 * @param {Object} settings - The settings object defining fields and wrapper configurations.
	 */
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

	/**
	 * Creates an instance of a FormField or WrappedFormModel based on the provided item configuration.
	 *
	 * @param {Object} item - The configuration object for the field or nested wrapper.
	 * @param {Record<string, unknown>} values - Initial values for the fields.
	 * @returns {WrappedFormModel | FormField} The created instance.
	 */
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

	/**
	 * Checks whether all nested wrappers within this wrapper are loaded and sets the wrapper's state to loaded if so.
	 */
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

	/**
	 * Configures the fields within the wrapper, setting up any dependencies they might have.
	 */
	#configFields = () => {
		this.#fields.forEach(this.#listenDependencies);
	};

	/**
	 * Initializes all fields within the wrapper, preparing them for user interaction. Its used to know when the fields can start to listen for events or dependencies
	 */
	initialize = () => {
		this.#fields.forEach(field => field.initialize());
	};

	/**
	 * Sets up dependency listeners for a field within the wrapper, allowing fields to react to changes in other fields.
	 * @param {FormField | WrappedFormModel} instance - The field or nested wrapper instance to set dependencies for.
	 */
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

	/**
	 * Registers a nested wrapper within this wrapper, adding it to the internal map of child wrappers.
	 * @param {WrappedFormModel} wrapper - The child wrapper to register.
	 */
	registerWrapper = (wrapper: WrappedFormModel) => {
		this.#wrappers.set(wrapper.name, wrapper);
		this.#form.registerWrapper(wrapper);
	};

	/**
	 * Sets the value of a specified field within the wrapper. If the field exists, its value is updated.
	 * @param {string} name - The name of the field to update.
	 * @param {any} value - The new value for the field.
	 */
	setField(name: string, value) {
		if (!this.getField(name)) {
			console.error('Field not found', name, this.#settings.name, this.#fields.keys());
			return;
		}
		this.getField(name).set({ value });
	}

	/**
	 * Retrieves a field or nested wrapper by name. Supports dot notation for accessing deeply nested fields.
	 * @param {string} name - The name of the field or nested wrapper to retrieve.
	 * @returns {FormField | WrappedFormModel | undefined} The requested instance, or undefined if not found.
	 */
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

	/**
	 * Clears all fields within the wrapper, resetting their values to their initial state.
	 */
	clear = () => {
		this.#fields.forEach(field => field.clear());
		this.triggerEvent();
		this.triggerEvent('clear');
	};
}
