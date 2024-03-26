import { ReactiveModel } from '@beyond-js/reactive/model';
import { FormField } from './field';
import { WrappedFormModel } from './wrapper';
import { PendingPromise } from '@beyond-js/kernel/core';

/**
 * `FormModel` acts as the core class for managing form state, including field values, validation, and submission status.
 * It extends `ReactiveModel` to provide reactive features, allowing for dynamic updates to the form as users interact with it.
 * This model aggregates form fields, handles form-wide operations such as validation, submission, and provides utilities
 * for form state management.
 *
 * @extends ReactiveModel<FormModel> Base class providing reactive features.
 */

export /*bundle*/
class FormModel extends ReactiveModel<FormModel> {
	/**
	 * Retrieves the form configuration settings, which include definitions of fields, default values, and other form-wide
	 * settings.
	 * @returns {Object} The form settings object.
	 */
	#settings;
	get settings() {
		return this.#settings;
	}

	/**
	 * Accesses the registered callback functions configured for the form. These callbacks are essential for implementing
	 * custom logic and interactions within the form, such as copying values between fields or implementing custom validation
	 * rules.
	 * @returns {Record<string, (...args) => void>} A object of callbacks functions keyed by their names.
	 */
	#callbacks: Record<string, (...args) => void> = {};
	get callbacks() {
		return this.#callbacks;
	}

	/**
	 * Provides access to the form's original values. This is particularly useful for features like reset or change detection.
	 * @returns {Record<string, string>} A record of the initial values of the form's fields.
	 */
	#initialValues: Record<string, string> = {};
	get originalValues() {
		return this.#initialValues;
	}

	/**
	 * Retrieves the collection of `WrappedFormModel` instances associated with the form. Wrapped forms allow for nested
	 * form structures and complex form compositions.
	 *
	 * @returns {Map<string, WrappedFormModel>} A map of wrapper names to their respective `WrappedFormModel` instances.
	 */
	#wrappers: Map<string, WrappedFormModel> = new Map();
	get wrappers() {
		return this.#wrappers;
	}

	/**
	 * Compiles and returns the current values of all form fields in a structured object format. This is useful for
	 * serialization or when submitting the form data.
	 *
	 * @returns {Object} An object containing the current values of the form fields, keyed by their names.
	 */
	get values() {
		const data = {};
		this.#fields.forEach((field, key) => {
			data[key] = field.value;
		});
		return data;
	}

	/**
	 * Provides access to the form's fields, including both direct fields and those contained within wrappers, allowing
	 * for detailed manipulation and retrieval of field states.
	 *
	 * @returns {Map<string, FormField | WrappedFormModel>} A map of field names to their corresponding `FormField` or
	 * `WrappedFormModel` instances.
	 */
	#fields: Map<string, FormField | WrappedFormModel> = new Map();
	get fields() {
		return this.#fields;
	}

	// Utilized to track the loading state of its children. When every child wrapper is loaded, the form is considered ready and the promise is resolved.
	#loadedPromise: PendingPromise<boolean> = new PendingPromise();

	// Counter for tracking the readiness of nested wrappers. Its used to know when all nested wrappers are loaded.
	#childWrappersReady: number = 0;

	// Counter for tracking the readiness of nested wrappers.
	#childWrappers: number = 0;

	/**
	 * Initializes a new instance of the `FormModel`, setting up the initial state, including field configurations,
	 * callbacks, and reactive properties. This constructor also triggers the asynchronous setup process for the form.
	 *
	 * @param {Object} settings The configuration settings for the form, including fields, default values, and callbacks.
	 * @param {Object} [reactiveProps] Optional reactive properties to enhance the form's reactivity.
	 */
	constructor(settings, reactiveProps?) {
		super(reactiveProps);

		this.#settings = settings;
		this.#callbacks = settings.callbacks ?? {};
		this.#startup(settings);
	}

	/**
	 * Initializes the form model with settings, registers fields and wrappers based on the settings provided, and sets the form to ready state after all configurations are loaded.
	 * This method dynamically creates instances for each field or wrapper defined in the form settings, attaching change listeners to each field to update the form model's state accordingly.
	 *
	 * @param {Object} settings - Configuration settings for the form including fields, values, and callbacks.
	 */
	#startup = async settings => {
		const values = settings?.values || {};
		const createItems = item => {
			const instance = this.#getFieldModel(item, values);
			const onChange = () => (this[item.name] = instance.value);
			instance.on('change', onChange);
			this.#fields.set(item.name, instance);
		};

		this.#settings.fields.map(createItems);
		this.ready = true;
		await this.#checkReady();
		globalThis.f = this;
		this.#configFields();
	};

	/**
	 * Checks if all wrappers and fields within the form are loaded and sets the form to a loaded state. This method ensures that the form is fully operational before any interaction.
	 * Its used for the start to listen the dependencies
	 */
	#checkReady = () => {
		const onReady = () => {
			const areAllWrappersLoaded = this.#childWrappersReady === this.#childWrappers;

			if (!areAllWrappersLoaded) {
				this.#childWrappersReady = this.#childWrappersReady + 1;
				return;
			}
			this.loaded = true;
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
	 * Configures all fields by initializing them and setting up dependencies. This method ensures that each field is ready for interaction and that any field dependencies are respected.
	 */
	#configFields = () => {
		this.#fields.forEach(this.#listenDependencies);
		this.#fields.forEach(field => field.initialize());
	};

	/**
	 * Examines each field for dependencies and sets up listeners to respond to changes in dependent fields. This ensures dynamic interactions within the form based on field dependencies.
	 * @param {FormField|WrappedFormModel} instance - The field or wrapper instance to check for dependencies.
	 */
	#listenDependencies = instance => {
		if (!instance?.dependentOn?.length) return;

		const checkField = item => {
			const DEFAULT = {
				type: 'change',
			};

			const dependency = this.getField(item.field);

			['field', 'callback'].forEach(prop => {
				if (!item[prop]) throw new Error(`${item?.field} is missing ${prop}`);
			});

			if (!dependency) throw new Error(`${item?.field} is not a registered field`);

			const settings = { ...DEFAULT, ...item };
			if (!this.#callbacks[item.callback]) {
				throw new Error(`${item.callback} is not  a registered callback`);
			}

			const callback = this.#callbacks[item.callback];
			callback({ dependency, settings, field: instance, form: this });
		};

		instance.dependentOn.forEach(checkField);
	};

	/**
	 * Creates a new instance of a field or a wrapper based on the provided item configuration. It initializes the field or wrapper with specified values and properties.
	 * @param {Object} item - The field or wrapper configuration.
	 * @param {Object} values - The initial values for the fields.
	 * @returns {FormField|WrappedFormModel} A new field or wrapper instance.
	 */
	#getFieldModel = (item, values: Record<string, unknown>) => {
		let externalValues: Record<string, any> = {};

		// @todo: @veD-tnayrB: Review this code and document it
		if (Array.isArray(item?.properties)) {
			item?.properties.forEach(item => (externalValues[item.name] = item.value));
		}

		if (item.type === 'wrapper') return this.#getWrapper(item);
		const instance = new FormField({
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
	 * Creates a new instance of a WrappedFormModel for the specified wrapper configuration. It sets up all necessary properties and fields for the wrapper.
	 * @param {Object} item - The wrapper configuration.
	 * @returns {WrappedFormModel} A new WrappedFormModel instance.
	 */
	#getWrapper = item => {
		let instance: WrappedFormModel | FormField;
		if (!item.fields) throw new Error(`Wrapper ${item.name} must have fields property`);
		const fieldsProperties = item.fields.map(item => item.name);

		const properties = [...fieldsProperties, ...(item?.properties || [])];
		const defaultValues = item.values || {};
		instance = new WrappedFormModel({
			parent: this,
			settings: { ...item, form: this },
			specs: { properties: properties || [], ...defaultValues },
		});

		let toSet = {};
		Object.keys(instance?.getProperties()).forEach(property => (toSet[property] = item[property] || ''));
		instance.set(toSet);

		this.registerWrapper(instance);
		this.#childWrappers = this.#childWrappers + 1;
		return instance;
	};

	/**
	 * Registers a wrapper model within the form model, allowing for nested form structures.
	 * This method is crucial for managing complex forms where fields might be grouped into sections or wrappers.
	 * @param {WrappedFormModel} wrapper - The wrapper instance to register.
	 */
	registerWrapper = (wrapper: WrappedFormModel) => {
		this.#wrappers.set(wrapper.name, wrapper);
	};

	/**
	 * Sets the value of a specified field within the form. If the field exists, its value is updated with the provided value.
	 * This method provides a direct way to programmatically change the value of a form field.
	 * @param {string} name - The name of the field to update.
	 * @param {any} value - The new value for the field.
	 */
	setField = (name: string, value) => this.#fields.get(name).set({ value });

	/**
	 * Retrieves a field or wrapper instance by its name. If the name includes a dot notation, it attempts to find a nested field within a wrapper.
	 * This method facilitates access to any field or wrapper, supporting complex nested structures.
	 *
	 * @param {string} name - The name of the field or wrapper to retrieve, supporting dot notation for nested fields.
	 * @returns {FormField|WrappedFormModel|undefined} The field or wrapper instance, or undefined if not found.
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
	 * Clears all fields in the form, resetting their values. This method is useful for reset operations,
	 * ensuring that the form can be cleared programmatically.
	 */
	clear = () => {
		this.#fields.forEach(field => field.clear());
		this.triggerEvent();
		this.triggerEvent('clear');
	};
}
