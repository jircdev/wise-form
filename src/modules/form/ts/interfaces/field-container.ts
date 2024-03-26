import { IWiseFormField } from './interfaces';

export interface IFieldContainer {
	template: [number, string];
	items: IWiseFormField[];
	styles?: any; // @todo: add correct type
	model: any;
}
