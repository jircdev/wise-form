import React from 'react';
import { Input, Textarea } from 'pragmate-ui/form';
import { SelectionField } from './selection';
import { FieldContainer } from './container';
import { useWiseFormContext } from '../../context';

export function Control({ field, index }) {
	const { values, formTypes, model } = useWiseFormContext();

	const types = {
		...{
			checkbox: SelectionField,
			radio: SelectionField,
			select: SelectionField,
			textarea: Textarea,
			text: Input,
			password: Input,
			default: Input,
		},
		...formTypes,
	};

	const Control = types[field.type] ?? types.default;

	const onChange = event => {
		model.setField(field.name, event.target.value);
	};
	const attrs = { value: values[field.name], ...field, onChange };
	return (
		<FieldContainer>
			<Control {...attrs} />
		</FieldContainer>
	);
}
