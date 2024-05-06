import type { FormModel } from '../model';

export interface IPluginFormSpecs {
	object: IPluginForm;
	property: string;
}

export interface IPluginForm {
	readonly ready: boolean;
	readonly name: string;
	settings: (model: FormModel, specs: IPluginFormSpecs) => Promise<IPluginForm>;
}
