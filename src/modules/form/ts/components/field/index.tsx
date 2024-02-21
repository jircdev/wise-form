import React from 'react';
import { Input, Textarea } from 'pragmate-ui/form';
import { SelectionField } from './selection';
import { FieldContainer } from './container';
import { useWiseFormContext } from '../../context';
import { IWiseForm, IWiseFormField } from '../../interfaces/interfaces';
import type { FormModel } from '../../model/model';
import type { WrappedFormModel } from '../../model/wrapped-form';

export function Control({
	field,
	index,
	model,
}: {
	field: IWiseFormField;
	index: number;
	model: FormModel | WrappedFormModel;
}) {
	const { formTypes, values } = useWiseFormContext();

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

	const fieldModel = model.getField(field?.name);
	const Control = types[field.type] ?? types.default;
	const onChange = event => {
		model.setField(field.name, event.target.value);
	};

	const value = fieldModel?.value ?? values[field?.name];
	const attrs = { value, ...field, onChange, model };

	return (
		<FieldContainer>
			<Control {...attrs} />
		</FieldContainer>
	);
}
