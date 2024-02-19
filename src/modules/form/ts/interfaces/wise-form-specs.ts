import { IFormSettings } from './settings';

export /*bundle */ interface IWiseFormSpecs {
	children?: React.ReactNode;
	settings: IFormSettings;
	types?: Record<string, React.ReactNode>;
}
