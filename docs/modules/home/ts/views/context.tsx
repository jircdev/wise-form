import React from 'react';
import type { StoreManager } from '../store';
import { IForm, FormItem } from '../interfaces/form';
export interface IFormContext {
	[key: string]: any;
	store?: StoreManager;
	current?: FormItem;
	setCurrent?: (FormItem) => void;
}
const value: IFormContext = {};
export const FormContext = React.createContext(value);
export const useFormContext = () => React.useContext(FormContext);
