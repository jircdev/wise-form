import React from "react";
import { Input, Textarea } from "pragmate-ui/form";
import { SelectionField } from "./selection";
import { ControlFieldContainer } from "./container";
import { useWiseFormContext } from "../../context";
import type { FormModel, WrappedFormModel, FormField } from "@bgroup/wise-form/model";
import { useField } from "./use-field";

type WiseFormFieldControlProps = {
	field: FormField | WrappedFormModel;
	index: number;
	model: FormModel | WrappedFormModel;
	hidden?: boolean;
};
/**
 *
 * @param props.field WiseForm Json config
 * @param props.index Index of the field
 * @param props.model Field or Wrapper Model.
 * @returns
 */
export const Control = ({ field, index, model, hidden }: WiseFormFieldControlProps) => {
	const { formTypes } = useWiseFormContext();
	const fieldItem = field as FormField;
	const { attrs } = useField(model, fieldItem);

	// Estado reactivo para el valor de hidden del campo
	const [isHidden, setIsHidden] = React.useState(() => {
		if (hidden !== undefined) return hidden;
		const fieldModel = model.getField(fieldItem?.name);
		if (fieldModel) {
			const properties = (fieldModel as FormField).getProperties();
			return properties.hidden ?? false;
		}
		return fieldItem?.hidden ?? false;
	});

	// Suscribirse a los cambios del modelo del campo
	React.useEffect(() => {
		const fieldModel = model.getField(fieldItem?.name);
		if (!fieldModel) return;

		const onChange = () => {
			const properties = (fieldModel as FormField).getProperties();
			setIsHidden(properties.hidden ?? false);
		};

		fieldModel.on('change', onChange);
		return () => {
			fieldModel.off('change', onChange);
		};
	}, [model, fieldItem?.name]);

	if (isHidden) return null;
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

	const Control = types[fieldItem.type] ?? types.default;
	return (
		<ControlFieldContainer>
			<Control {...attrs} />
		</ControlFieldContainer>
	);
};
