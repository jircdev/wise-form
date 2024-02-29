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
	propertiea: string[];
	value: string | number | boolean | Object | any[];
	[key: string]: any;
}

export class FormField extends ReactiveModel<IFormField> {
	#parent;

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
				'disabled',
				'value',
				'dependentOn',
				'options',
				...properties,
			],
		});
		this.#parent = parent;

		this.set(props);
		this.checkSettings();
	}

	clear = () => {
		this.set(this.initialValues());
		this.triggerEvent('clear');
	};

	checkSettings() {
		if (this.dependentOn) {
		}
	}
}
