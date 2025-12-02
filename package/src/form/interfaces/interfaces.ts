import type { FormField, WrappedFormModel } from '@bgroup/wise-form/models';

// Interface for individual form field elements
export type WiseFormField = (FormField | WrappedFormModel)[];

// Interface for the general form structure
export interface IWiseForm {
	name: string;
	template: string;
	fields: WiseFormField;
}

