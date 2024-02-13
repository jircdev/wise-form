import React from 'react';
import { useReactiveFormContext } from '../../context';
export function FormSectionWrapper({ data }) {
	const { formTypes } = useReactiveFormContext();
	const types = {
		...formTypes,
	};

	if (!data.control) {
		throw new Error('wrapper must have a control');
	}
	const Control = types[data.control];
	return <Control data={data} />;
}
