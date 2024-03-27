export interface IFormField {
	name: string;
	type: string;
	placeholder: string;
	required: boolean;
	label: string;
	variant: string;
	disabled: boolean;
}

export interface IFormFieldProps {
	propertiea: string[];
	value: string | number | boolean | Object | any[];
	[key: string]: any;
}
