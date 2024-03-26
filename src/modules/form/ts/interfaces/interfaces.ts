import { FormField } from '../model/field';
import { WrappedFormModel } from '../model/wrapper';

// Interface for individual form field elements
export /*bundle*/ type WiseFormField = (FormField | WrappedFormModel)[];

// Interface for the general form structure
export /*bundle*/ interface IWiseForm {
	name: string;
	template: string;
	fields: WiseFormField;
}
