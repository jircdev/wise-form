export interface IFormField {
	name?: string;
	type?: string;
	placeholder?: string;
	required?: boolean;
	label?: string;
	variant?: string;
	disabled?: boolean;
	value?: any;
}

export interface IFormFieldProps extends IFormField {
	properties: string[];
	[key: string]: any;
}
