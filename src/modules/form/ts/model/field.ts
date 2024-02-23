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

interface IProps {
	externalProperties: string[];
	value: string | number | boolean | Object | any[];
	[key: string]: any;
}

export class FormField extends ReactiveModel<IFormField> {
	#parent;

	constructor({ parent, properties }: { parent; properties: IProps }) {
		const { externalProperties, ...props } = properties;
		super({
			...properties,
			properties: [
				'name',
				'type',
				'placeholder',
				'required',
				'label',
				'variant',
				'disabled',
				'value',
				...externalProperties,
			],
		});
		this.#parent = parent;

		this.set(props);
	}

	clear = () => {
		this.set(this.initialValues());
		this.triggerEvent('clear');
	};
}
