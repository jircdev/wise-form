import { ReactiveModel } from '@beyond-js/reactive/model';

export interface IFormField {
	name: string;
	type: string;
	placeholder: string;
	required: boolean;
	label: string;
	variant: string;
	disabled: boolean;
}
export class FormField extends ReactiveModel<IFormField> {
	#parent;

	constructor(parent, properties = {}) {
		super({
			...properties,
			properties: ['name', 'type', 'placeholder', 'required', 'label', 'variant', 'disabled', 'value'],
		});
		this.#parent = parent;

		// this.set(properties);
	}

	clear = () => {
		this.set(this.initialValues());
	};
}
