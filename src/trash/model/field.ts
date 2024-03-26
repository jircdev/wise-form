import { ReactiveModel } from '@beyond-js/reactive/model';
import type { WrappedFormModel } from './wrapper';
import type { FormModel } from './model';

export interface IFormField {
	name: string;
	type: string;
	placeholder: string;
	required: boolean;
	label: string;
	variant: string;
	disabled: boolean;
}

interface IProps {
	propertiea: string[];
	value: string | number | boolean | Object | any[];
	[key: string]: any;
}

type TDisabledSettings = {
	name: string;
	value: any;
};
interface IDisabled {
	fields: string[] | TDisabledSettings[];
}

export class FormField extends ReactiveModel<IFormField> {
	#parent: WrappedFormModel | FormModel;

	#disabled: boolean | IDisabled = false;
	get disabled() {
		if (typeof this.#disabled === 'object' && this.#disabled?.fields) {
			const validate = field => {
				if (typeof field === 'object') {
					const { name, value } = field;
					const { value: fieldValue } = this.#parent.getField(name);

					return value !== fieldValue;
				}
				return !this.#parent.form.getField(field).value;
			};
			return this.#disabled.fields.some(validate);
		}
		return this.#disabled;
	}
	set disabled(value) {
		if (value === this.#disabled) return;
		this.#disabled = value;
		this.triggerEvent();
	}

	#specs;
	get specs() {
		return this.#specs;
	}

	get attributes() {
		const props = this.getProperties();
		return {
			...props,
			disabled: this.disabled,
		};
	}
	#listeningItems = new Map();

	constructor({ parent, specs }: { parent; specs: IProps }) {
		const { properties, ...props } = specs;

		super({
			...props,
			properties: [
				'name',
				'type',
				'placeholder',
				'required',
				'label',
				'variant',
				'value',
				'options',
				...properties,
			],
		});
		this.#specs = specs;
		this.#parent = parent;
		this.__instance = Math.random();
		this.set(props);
	}

	initialize = () => {
		this.checkSettings(this.#specs);
	};

	clear = () => {
		const initValues = this.initialValues();
		this.set(initValues);
		if (initValues.hasOwnProperty('disabled')) this.disabled = initValues.disabled;
		this.triggerEvent('clear');
	};

	#listenSiblings = () => {
		this.triggerEvent('change');
	};

	checkSettings(props) {
		if (props.hasOwnProperty('disabled')) {
			if (typeof props.disabled === 'boolean') {
				this.#disabled = props.disabled;
				return;
			}

			if (typeof props.disabled !== 'object') {
				throw new Error(`The disabled property of the field ${props.name} must be a boolean or an object`);
			}
			if (!props.disabled.fields) {
				throw new Error(`The disabled property of the field ${props.name} must have a fields property`);
			}

			let allValid;
			props.disabled.fields.forEach(item => {
				const name = typeof item === 'string' ? item : item.name;

				const instance = this.#parent.form.getField(name);
				allValid = instance;
				if (!allValid) return;
				instance.on('change', this.#listenSiblings);
				this.#listeningItems.set(name, { item: instance, listener: this.#listenSiblings });
			});

			if (!allValid) {
				throw new Error(
					`the field ${allValid} does not exist in the form ${
						this.#parent.name
					}, field passed in invalid settings of field "${this.name}"`,
				);
			}

			this.#disabled = props.disabled;
		}
	}

	cleanUp() {
		this.#listeningItems.forEach(({ item, listener }) => item.off('change', listener));
		// todo: remove all events
	}
}
