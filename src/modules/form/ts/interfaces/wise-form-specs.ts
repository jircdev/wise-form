import type { FormModel } from '@bgroup/wise-form/model';
import { IFormSettings } from './settings';

export /*bundle */ interface IWiseFormSpecs {
	children?: React.ReactNode;
	settings?: IFormSettings;
	model?: FormModel;
	types?: Record<string, React.ReactNode>;
}
