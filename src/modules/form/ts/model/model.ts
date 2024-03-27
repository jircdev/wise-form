import { FormField } from './field';
import { WrappedFormModel } from './wrapper';
import { BaseWiseModel } from './base';
import { PluginsManager } from './plugins';

export /*bundle*/
class FormModel extends BaseWiseModel {
	#childWrappers: number = 0;

	/**
	 * Initializes a new instance of the `FormModel`, setting up the initial state, including field configurations,
	 * callbacks, and reactive properties. This constructor also triggers the asynchronous setup process for the form.
	 *
	 * @param {Object} settings The configuration settings for the form, including fields, default values, and callbacks.
	 * @param {Object} [reactiveProps] Optional reactive properties to enhance the form's reactivity.
	 */
	constructor(settings, reactiveProps?) {
		super(settings, reactiveProps);
		this.#startup(settings);
	}

	#startup = async settings => {
		const values = settings?.values || {};
		const createItems = item => {
			const instance = this.#getFieldModel(item, values);
			const onChange = () => (this[item.name] = instance.value);
			instance.on('change', onChange);
			this.fields.set(item.name, instance);
		};

		this.settings.fields.map(createItems);

		await this.#checkReady();
		this.#configFields();
		PluginsManager.validate(this);
		this.ready = true;
		this.trigger('change');
	};

	/**
	 * Checks if all wrappers and fields within the form are loaded and sets the form to a loaded state. This method ensures that the form is fully operational before any interaction.
	 * Its used for the start to listen the dependencies
	 */
	#checkReady = () => {
		const onReady = () => {
			const areAllWrappersLoaded = this.childWrappersReady === this.#childWrappers;

			if (!areAllWrappersLoaded) {
				this.childWrappersReady = this.childWrappersReady + 1;
				return;
			}

			this.loaded = true;
			this.loadedPromise.resolve(true);
			this.off('wrappers.children.loaded', onReady);
		};

		if (this.loaded) return this.loaded;

		if (!this.wrappers.size) {
			onReady();
			return this.loaded;
		}

		this.on('wrappers.children.loaded', onReady);
		return this.loadedPromise;
	};

	/**
	 * Configures all fields by initializing them and setting up dependencies. This method ensures that each field is ready for interaction and that any field dependencies are respected.
	 */
	#configFields = () => {
		this.fields.forEach(this.#listenDependencies);
		this.fields.forEach(field => field.initialize());
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
			if (!this.callbacks[item.callback]) {
				throw new Error(`${item.callback} is not  a registered callback ${item.name}`);
			}

			const callback = this.callbacks[item.callback];
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

	 * @param item 
	 * @param values 
	 * @returns 
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
		this.wrappers.set(wrapper.name, wrapper);
	};

	setField = (name: string, value) => this.fields.get(name).set({ value });

	/**
	 * Retrieves a field or wrapper instance by its name. If the name includes a dot notation, it attempts to find a nested field within a wrapper.
	 * This method facilitates access to any field or wrapper, supporting complex nested structures.
	 *
	 * @param {string} name - The name of the field or wrapper to retrieve, supporting dot notation for nested fields.
	 * @returns {FormField|WrappedFormModel|undefined} The field or wrapper instance, or undefined if not found.
	 */
	getField(name: string) {
		if (!name) return console.warn('You need to provide a name to get a field in form ', this.settings.name);
		if (!name.includes('.')) {
			let field = this.fields.get(name);
			if (!field) {
				this.wrappers.forEach(item => {
					const foundField = item.getField(name);
					if (foundField) field = foundField;
				});
			}
			return field;
		}

		const [wrapperName, ...others] = name.split('.');
		const currentWrapper = this.wrappers.get(wrapperName);

		const otherWrapper = others.join('.');
		return currentWrapper.getField(otherWrapper);
	}

	/**
	 * Clears all fields in the form, resetting their values. This method is useful for reset operations,
	 * ensuring that the form can be cleared programmatically.
	 */
	clear = () => {
		this.fields.forEach(field => field.clear());
		this.triggerEvent();
		this.triggerEvent('clear');
	};

	static create = settings => {
		const properties = settings.fields.map(item => item.name);
		const values = settings.values || {};
		const instance = new FormModel(settings, { ...properties, ...values });

		return instance;
	};
}
