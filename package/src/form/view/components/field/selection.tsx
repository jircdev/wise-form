import React from 'react';
import { Checkbox, CheckboxGroup, Radio, Select } from '../../../../components/ui';
import { ErrorRenderer } from '../error';
import { useWiseFormContext } from '../../context';

export function SelectionField(props) {
	if (!props.options) return <ErrorRenderer error={`the field does not have options, field: ${props.name}`} />;

	const { name } = useWiseFormContext();
	const types = {
		checkbox: Checkbox,
		radio: Radio,
		select: SelectionField,
	};

	if (!types.hasOwnProperty(props.type)) return <ErrorRenderer error='the props type is not supported' />;
	const Control = types[props.type];

	// Filter out non-HTML attributes before passing to Select
	const invalidAttributes = ['processing', 'processed', 'properties', 'specs', 'hidden', 'identifier'];
	const filteredProps = Object.keys(props).reduce((acc, key) => {
		if (!invalidAttributes.includes(key)) {
			acc[key] = props[key];
		}
		return acc;
	}, {} as any);

	if (props.type === 'select') return <Select {...filteredProps} />;

	if (props.type === 'checkbox') return <CheckboxGroup {...filteredProps} />;

	const output = props.options.map((option, key) => {
		const attributes = { ...option, name: props.name };
		return <Control {...attributes} key={`${name}.${props.name}.${key}`} />;
	});

	return output;
}

