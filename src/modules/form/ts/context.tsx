import React from 'react';

import type { FormModel } from './model/model';
export interface IFormContext {
	model?: FormModel;
	name?: string;
	values?: Record<string, any>;
	template?: {
		type: string;
		items: any[];
	};
	formTypes?: Record<string, React.ElementType>;
}
const value: IFormContext = {};
export const WiseFormContext = React.createContext(value);
export /*bundle*/ const useWiseFormContext = () => React.useContext(WiseFormContext);
