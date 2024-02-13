// Interface for individual form field elements
export /*bundle*/ interface IWiseFormField {
	name: string; // Required
	type: string; // Required
	[key: string]: any; // Allows for additional properties
}

// Interface for the general form structure
export /*bundle*/ interface IWiseForm {
	name: string;
	template: string;
	fields: IWiseFormField[];
}
