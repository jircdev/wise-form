import React from 'react';
import { Input, Textarea } from 'pragmate-ui/form';
import { SelectionField } from './selection';
import { FieldContainer } from './container';
import { useWiseFormContext } from '../../context';

export function Control({ field, index, model }) {
	const { formTypes } = useWiseFormContext();

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
	const value = !model.name ?? '';
	const attrs = { value: model.value, ...field, onChange };
	return (
		<FieldContainer>
			<Control {...attrs} />
		</FieldContainer>
	);
}
