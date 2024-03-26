import type { FormModel } from '../model';
import type { WrappedFormModel } from '../wrapper';

export interface IWrapperFormModelProps {
	parent: FormModel | WrappedFormModel;
	settings;
	specs: { properties: string[] };
}
