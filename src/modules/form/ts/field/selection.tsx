import React from 'react';
import { Input, Textarea, Checkbox, Radio, Select, SelectOption } from 'pragmate-ui/form';
import { ErrorRenderer } from '../error';
import { FieldContainer } from './container';
import { useReactiveFormContext } from '../context';

export function SelectionField(props) {
	if (!props.options) return <ErrorRenderer error='the field does not have options' />;

	const { name } = useReactiveFormContext();
	const types = {
		checkbox: Checkbox,
		radio: Radio,
		select: SelectionField,
	};

	if (!types.hasOwnProperty(props.type)) return <ErrorRenderer error='the props type is not supported' />;
	const Control = types[props.type];

	if (props.type === 'select') return <Select {...props} />;

	const output = props.options.map((option, key) => {
		const attributes = { ...option, name: props.name };
		return <Control {...attributes} key={`${name}.${props.name}.${key}`} />;
	});

	return output;
}
