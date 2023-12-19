import React from 'react';
import { Input, Textarea, Checkbox, Radio } from 'pragmate-ui/form';
import { SelectionField } from './selection';
import { FieldContainer } from './container';

export function Control({ field }) {
	const types = {
		checkbox: SelectionField,
		radio: SelectionField,
		select: SelectionField,
		textarea: Textarea,
		text: Input,
		password: Input,
		default: Input,
	};

	const Control = types[field.type] ?? types.default;
	return (
		<FieldContainer>
			<Control {...field} />
		</FieldContainer>
	);
}
