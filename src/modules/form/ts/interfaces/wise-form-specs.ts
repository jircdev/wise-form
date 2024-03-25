import type { FormModel } from '../model/model';
import { IFormSettings } from './settings';

export /*bundle */ interface IWiseFormSpecs {
	children?: React.ReactNode;
	settings?: IFormSettings;
	model?: FormModel;
	types?: Record<string, React.ReactNode>;
}
