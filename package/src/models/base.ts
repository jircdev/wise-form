import { ReactiveModel } from '@beyond-js/reactive/model';
import type { WrappedFormModel } from './wrapper';
import type { FormField } from './field';
import { PendingPromise } from '../utils/pending-promise';
import { FieldOrAlias } from './types/callbacks';
import { IFormModelProps } from './types/model';
import { IBaseWiseModel } from './types/base-wise-model';

export class BaseWiseModel extends ReactiveModel<IBaseWiseModel> {
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

	set callbacks(value) {
		this.#callbacks = value;
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
		const data: Record<string, any> = {};
		this.#fields.forEach((field, key) => {
			// FormField has value, WrappedFormModel doesn't
			if ('value' in field) {
				data[key] = (field as FormField).value;
			}
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
	 * Retrieves a field or nested wrapper by name. Supports dot notation for accessing deeply nested fields.
	 * @param {string} name - The name of the field or nested wrapper to retrieve.
	 * @param {Set<BaseWiseModel | WrappedFormModel>} visited - Set of already visited models to prevent infinite recursion.
	 * @returns {FormField | WrappedFormModel | undefined} The requested instance, or undefined if not found.
	 */
	getField(name: string, visited: Set<BaseWiseModel | WrappedFormModel> = new Set()) {
		if (!name) {
			console.warn('[WiseForm.getField] Empty field name provided in form', this.#settings.name);
			return;
		}

		// Protección contra recursión circular
		if (visited.has(this)) {
			console.error(
				`[WiseForm.getField] Circular reference detected in form "${this.#settings.name}" while searching for field "${name}". This usually indicates a configuration issue with nested wrappers.`
			);
			console.log(
				`[WiseForm.getField] PROTECTION ACTIVE: Circular reference prevented. Form: "${this.#settings.name}", Field: "${name}", Visited models count: ${visited.size}`
			);
			return undefined;
		}
		visited.add(this);

		if (!name.includes('.')) {
			let field = this.#fields.get(name);

			if (!field) {
				this.#wrappers.forEach(item => {
					if (!visited.has(item)) {
						const foundField = item.getField(name, visited);
						if (foundField) field = foundField;
					}
				});
			}
			return field;
		}

		// Dot notation path
		const [wrapperName, ...others] = name.split('.');
		const currentWrapper = this.#wrappers.get(wrapperName);

		if (!currentWrapper) {
			console.warn(
				`[WiseForm.getField] Wrapper "${wrapperName}" not found in form "${this.#settings.name}" while searching for "${name}". Available wrappers: ${Array.from(this.#wrappers.keys()).join(', ') || 'none'}`
			);
			return undefined;
		}

		const otherWrapper = others.join('.');
		return currentWrapper.getField(otherWrapper, visited);
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

