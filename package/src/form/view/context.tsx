import React from 'react';
import type { FormModel, WrappedFormModel } from '@bgroup/wise-form/models';
export interface IFormContext {
	model?: FormModel | WrappedFormModel;
	name?: string;
	values?: Record<string, any>;
	items?: any;
	rows?: [number, string][];
	template?: {
		type: string;
		styles: any;
		items: any[];
	};
	formTypes?: Record<string, React.ElementType>;
}

export interface IWrappedFormContext extends IFormContext {
	parent: IFormContext;
}
const value: IFormContext = {};
export const WiseFormContext = React.createContext(value);
export const useWiseFormContext = () => React.useContext(WiseFormContext);

export const WrappedWiseFormContext = React.createContext(value);
export const useWrappedWiseFormContext = () => React.useContext(WrappedWiseFormContext);

