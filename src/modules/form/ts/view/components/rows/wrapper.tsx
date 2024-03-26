import React from 'react';
import { useWiseFormContext } from '../../context';
/**
 *
 * @param data {WrappedFormModel}
 * @param model {FormModel} parent.
 * @returns
 */
export function FormSectionWrapper({ data, model }) {
	const { formTypes } = useWiseFormContext();

	const types = {
		...formTypes,
	};

	if (!data.control) throw new Error('Wrapper must have a control');
	if (!data.name) {
		console.error('Wrapper must have a name', data);
		return null;
	}

	const wrapperModel = model?.getField(data.name);
	const Control = types[data.control];
	// data = wrapperModel ? { ...data, ...wrapperModel.getProperties() } : data;
	return <Control data={data} model={wrapperModel} />;
}
