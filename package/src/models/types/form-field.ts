export interface IFormField {
	name?: string;
	type?: string;
	placeholder?: string;
	required?: boolean;
	label?: string;
	variant?: string;
	disabled?: boolean;
	value?: any;
	hidden?: boolean;
	options?: Array<{ value: any; label?: string; [key: string]: any }>;
	className?: string;
	checked?: boolean;
	id?: string;
	icon?: string;
	[key: string]: any;
}

export interface IFormFieldProps extends IFormField {
	properties?: string[];
}

