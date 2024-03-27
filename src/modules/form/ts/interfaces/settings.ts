import { WiseFormField } from './interfaces';
import { IFormTemplate } from './template';

export /*bundle*/ interface IFormSettings {
	name: 'string';
	template?: IFormTemplate;
	values?: Record<string, string>;
	fields: WiseFormField[];
	gap?: number;
}
