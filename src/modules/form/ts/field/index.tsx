import React from 'react';
import { Input, Textarea } from 'pragmate-ui/form';
import { SelectionField } from './selection';
import { FieldContainer } from './container';
import { useReactiveFormContext } from '../context';

export function Control({ field, index }) {
	const { template, formTypes } = useReactiveFormContext();

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
	return (
		<FieldContainer>
			<Control {...field} />
		</FieldContainer>
	);
}
