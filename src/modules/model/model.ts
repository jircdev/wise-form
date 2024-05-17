import { FormField } from './field';
import { WrappedFormModel } from './wrapper';
import { BaseWiseModel } from './base';
import { PluginsManager } from './plugins';
import { CallbackManager } from './callback-manager';

export /*bundle*/
	class FormModel extends BaseWiseModel {
	#childWrappers: number = 0;
	#plugins: PluginsManager;
	get plugins() {
		return this.#plugins;
	}

	/**
	 * since the fields can be children of the model or a
	 * wrapper, this method is used to get the form model
	 */
	get form() {
		return this;
	}
	#mode: string;
	get mode() {
		return this.#mode;
	}
	#update: boolean;
	#callbackManagers: CallbackManager[];
	get update() {
		return this.#update;
	}
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
		if (!globalThis._wiseForms) globalThis._wiseForms = [];
		globalThis._wiseForms.push(this);
		this.#update = settings.update;
		this.#mode = this.#update ? 'update' : 'create';
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
		// todo: @everyone Define if is required to wait for the plugins to be ready.
		this.#plugins = new PluginsManager(this);
		this.ready = true;
		this.specs = settings;
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

		/**
		 * @todo: review it. why we need it.?
		 */
		if (item?.properties) {
			let toSet = {};
			item?.properties.forEach(property => (toSet[property] = item[property] || ''));
			instance.set(toSet);
		}

		return instance;
	};

	/**
	 * Examines each field for dependencies and sets up listeners to respond to changes in dependent fields. This ensures dynamic interactions within the form based on field dependencies.
	 * @param {FormField|WrappedFormModel} instance - The field or wrapper instance to check for dependencies.
	 */
	#listenDependencies = instance => {
		if (!instance?.specs?.dependentOn?.length) return;
		const manager = new CallbackManager(this, instance);
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

	getForm() {
		return this;
	}

	hide = (fields: string[]) => {
		fields.forEach(field => {
			const instance = this.getField(field);
			if (!instance) throw new Error(`Field ${field} does not exist in form ${this.name}`);

			instance.hide();
		});
	};

	show = (fields: string[]) => {
		fields.forEach(field => {
			const instance = this.getField(field);
			if (!instance) throw new Error(`Field ${field} does not exist in form ${this.name}`);

			instance.show();
		});
	};

	disable = (fields: string[]) => {
		fields.forEach(field => {
			const instance = this.getField(field);
			if (!instance) throw new Error(`Field ${field} does not exist in form ${this.name}`);

			instance.disabled = true;
		});
	};

	enable = (fields: string[]) => {
		fields.forEach(field => {
			const instance = this.getField(field);
			if (!instance) throw new Error(`Field ${field} does not exist in form ${this.name}`);

			instance.disabled = false;
		});
	};

	reset = (fields: string[]) => {
		fields.forEach(field => {
			const instance = this.getField(field);
			if (!instance) throw new Error(`Field ${field} does not exist in form ${this.name}`);

			instance.clear();
		});
	};

	static create = settings => {
		const properties = settings.fields.map(item => item.name);
		const values = settings.values || {};
		const instance = new FormModel(settings, { ...properties, ...values });

		return instance;
	};

	public getFormula(name: string) {
		if (!name) return null;
		const formula = this.#plugins.instances.get("formula").formulas.get(name);
		if (!formula) return null;
		return formula;
	}
}
