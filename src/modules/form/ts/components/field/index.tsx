import React from 'react';
import { Input, Textarea } from 'pragmate-ui/form';
import { SelectionField } from './selection';
import { FieldContainer } from './container';
import { useWiseFormContext } from '../../context';
import { IWiseForm, IWiseFormField } from '../../interfaces/interfaces';
import type { FormModel } from '../../model/model';
import type { WrappedFormModel } from '../../entities/wrappers/WrappedFormModel';

/**
 *
 * @param props.field WiseForm Json config
 * @param props.index Index of the field
 * @param props.model Field or Wrapper Model.
 * @returns
 */
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
	const fieldModel = model.getField(field?.name);
	const [attributes, setAttributes] = React.useState(fieldModel?.attributes);
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

	React.useEffect(() => {
		if (!fieldModel) return;
		const onChange = () => {
			setAttributes({ ...fieldModel.attributes });
		};
		fieldModel.on('change', onChange);
		const cleanUp = () => {
			fieldModel.off('change', onChange);
			fieldModel.cleanUp();
		};
		return cleanUp;
	}, [fieldModel]);

	const Control = types[field.type] ?? types.default;
	const onChange = event => {
		model.setField(field.name, event.target.value);
	};

	const value = fieldModel?.value ?? values[field?.name];

	/**
	 * It's necessary to change the field spread.
	 */
	const attrs = { value, ...field, ...attributes, onChange, model };
	field.name === 'simulatProductionModal' && console.log('ATTRS => ', attributes);
	return (
		<FieldContainer>
			<Control {...attrs} />
		</FieldContainer>
	);
}
