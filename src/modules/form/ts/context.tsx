import React from 'react';

import type { Model } from './model';
export interface IFormContext {
	model?: Model;
	name?: string;
}
const value: IFormContext = {};
export const ReactiveFormContext = React.createContext(value);
export const useReactiveFormContext = () => React.useContext(ReactiveFormContext);
