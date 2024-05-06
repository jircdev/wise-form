import type { FormField, WrappedFormModel } from '@bgroup/wise-form/model';

// Interface for individual form field elements
export /*bundle*/ type WiseFormField = (FormField | WrappedFormModel)[];

// Interface for the general form structure
export /*bundle*/ interface IWiseForm {
	name: string;
	template: string;
	fields: WiseFormField;
}
