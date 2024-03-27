import { WiseFormField } from './interfaces';

export interface IFieldContainer {
	template: [number, string];
	items: WiseFormField[];
	styles?: any; // @todo: add correct type
	model: any;
}
