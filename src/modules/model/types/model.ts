import { IFormField } from './form-field';

type Callback = (...args: any[]) => void | Promise<any>;

export /*bundle*/ interface IFormModelProps {
	params?: Record<string, any>;
	callbacks?: Record<string, Callback>;
	fields?: IFormField[];
	template?: Array<string | number>;
	properties?: string[];
}
