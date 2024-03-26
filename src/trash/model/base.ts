import { ReactiveModel } from '@beyond-js/reactive/model';
import type { WrappedFormModel } from './wrapper';
import { FormField } from './field';
import { PendingPromise } from '@beyond-js/kernel/core';

export class BaseWiseModel extends ReactiveModel<BaseWiseModel> {
	#settings;
	get settings() {
		return this.#settings;
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
	protected loadedPromise: PendingPromise<boolean> = new PendingPromise();
	protected childWrappersReady: number = 0;

	setField = (name: string, value) => this.fields.get(name).set({ value });

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

	constructor(settings, reactiveProps?) {
		super(reactiveProps);

		this.#settings = settings;
		this.#callbacks = settings.callbacks ?? {};
	}
}
