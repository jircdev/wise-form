import React from 'react';
import { Input, Textarea } from 'pragmate-ui/form';
import { SelectionField } from './selection';
import { FieldContainer } from './container';
import { useReactiveFormContext } from '../../context';

export function Control({ field, index }) {
	const { values, formTypes } = useReactiveFormContext();

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
	const attrs = { value: values[field.name], ...field };

	return (
		<FieldContainer>
			<Control {...attrs} />
		</FieldContainer>
	);
}
