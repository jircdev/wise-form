import { IWiseFormField } from './interfaces';
import { IFormTemplate } from './template';

export /*bundle*/ interface IFormSettings {
	name: 'string';
	template?: IFormTemplate;
	values?: Record<string, string>;
	fields: IWiseFormField[];
	gap?: number;
}
