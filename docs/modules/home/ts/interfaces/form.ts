interface ICustomForm {
	validations?: any[];
}
// type FormField = HTMLInputElement | HTMLTextAreaElement | ICustomForm;
type FormField = any;

export /*bundle */ interface IForm {
	name: string;
	fields: FormField[];
}

export type FormItem = [string, IForm];
