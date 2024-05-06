import { ReactiveModel } from '@beyond-js/reactive/model';
import type { WrappedFormModel } from './wrapper';
import { FormField } from './field';
import { PendingPromise } from '@beyond-js/kernel/core';
import { FieldOrAlias } from './types/callbacks';
import { IFormModelProps } from './types/model';

export class BaseWiseModel extends ReactiveModel<BaseWiseModel> {
	#settings;
	get settings() {
		return this.#settings;
	}

	set settings(value) {
		this.#settings = value;
	}

	#callbacks: Record<string, (...args) => void> = {};
	get callbacks() {
		return this.#callbacks;
	}
	#initialValues: Record<string, string> = {};
	get originalValues() {
		return this.#initialValues;
	}

	get name() {
		return this.#settings.name;
	}
	get template() {
		return this.#settings.template;
	}

	#wrappers: Map<string, WrappedFormModel> = new Map();
	get wrappers() {
		return this.#wrappers;
	}

	set wrappers(value) {
		this.#wrappers = value;
	}

	#fields: Map<string, FormField | WrappedFormModel> = new Map();
	get fields() {
		return this.#fields;
	}
	get values() {
		const data = {};
		this.#fields.forEach((field, key) => {
			data[key] = field.value;
		});
		return data;
	}

	#specs;
	get specs() {
		return this.#specs;
	}
	set specs(value) {
		this.#specs = value;
	}

	#params = {};

	protected loadedPromise: PendingPromise<boolean> = new PendingPromise();
	protected childWrappersReady: number = 0;

	constructor(settings: IFormModelProps, reactiveProps?) {
		super(settings);

		this.#params = settings.params ?? {};
		this.#settings = settings;
		this.#callbacks = settings.callbacks ?? {};
	}

	/**
	 * Sets the value of a specified field within the wrapper. If the field exists, its value is updated.
	 * @param {string} name - The name of the field to update.
	 * @param {any} value - The new value for the field.
	 */
	setField(name: string, value) {
		if (!this.getField(name)) {
			console.error('Field not found', name, this.settings.name, this.fields.keys());
			return;
		}

		const field = this.getField(this.getFieldName(name));
		field.setValue(value);
	}

	/**
	 * Examines each field for dependencies and sets up listeners to respond to changes in dependent fields. This ensures dynamic interactions within the form based on field dependencies.
	 * @param {FormField|WrappedFormModel} instance - The field or wrapper instance to check for dependencies.
	 */
	listenDependencies = instance => {
		if (!instance?.specs?.dependentOn?.length) return;
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

		instance?.specs?.dependentOn.forEach(checkField);
	};

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
	 * Extracts the field name from a FieldOrAlias type. The input can either be a string directly representing
	 * the field name or an object where the key is the field name and the value is an alias.
	 * This function returns the field name if it is a string, or the first key (field name) if it is an object,
	 * assuming the object contains exactly one key-value pair.
	 *
	 * @param {FieldOrAlias} field - The field identifier which could be a string or an object with one key-value pair.
	 * @returns {string} - The field name extracted from the input.
	 * @throws {Error} - Throws an error if the input is an object that does not contain exactly one key.
	 */
	getFieldName(field: FieldOrAlias): string {
		if (typeof field === 'object' && Object.keys(field).length !== 1) {
			throw new Error('Field object must contain exactly one key.');
		}

		if (typeof field === 'string') {
			return field;
		}

		return Object.keys(field)[0];
	}

	/**
	 * Clears all fields within the wrapper, resetting their values to their initial state.
	 */
	clear = () => {
		this.fields.forEach(field => field.clear());
		this.triggerEvent();
		this.triggerEvent('clear');
	};

	getParams(param) {
		return this.#params[param];
	}
}
