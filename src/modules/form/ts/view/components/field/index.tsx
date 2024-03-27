import React from 'react';
import { Input, Textarea } from 'pragmate-ui/form';
import { SelectionField } from './selection';
import { ControlFieldContainer } from './container';
import { useWiseFormContext } from '../../context';
import { WiseFormField } from '../../../interfaces/interfaces';
import type { FormModel } from '../../../model/model';
import type { WrappedFormModel } from '../../../model/wrapper';
import { useField } from './use-field';

type WiseFormFieldControlProps = {
	field: WiseFormField;
	index: number;
	model: FormModel | WrappedFormModel;
};
/**
 *
 * @param props.field WiseForm Json config
 * @param props.index Index of the field
 * @param props.model Field or Wrapper Model.
 * @returns
 */
export function Control({ field, index, model }: WiseFormFieldControlProps) {
	const { formTypes } = useWiseFormContext();

	const { attrs } = useField(model, field);
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
		<ControlFieldContainer>
			<Control {...attrs} />
		</ControlFieldContainer>
	);
}
