import React from "react";
import {Input, Textarea} from "pragmate-ui/form";
import {SelectionField} from "./selection";
import {ControlFieldContainer} from "./container";
import {useWiseFormContext} from "../../context";
import {WiseFormField} from "../../../interfaces/interfaces";
import type {FormModel, WrappedFormModel} from "@bgroup/wise-form/model";
import {useField} from "./use-field";

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
export const Control = React.memo(({field, index, model, hidden}: WiseFormFieldControlProps) => {
	const {formTypes} = useWiseFormContext();
	const fieldItem = field as any;
	const fieldModel = model.getField(fieldItem?.name);

	// Estado reactivo para el valor de hidden del campo
	const [isHidden, setIsHidden] = React.useState(() => {
		if (hidden !== undefined) return hidden;
		if (fieldModel) {
			const properties = fieldModel.getProperties();
			return properties.hidden ?? false;
		}
		return fieldItem?.hidden ?? false;
	});

	// Suscribirse a los cambios del modelo del campo para detectar cambios en hidden
	React.useEffect(() => {
		if (!fieldModel || !fieldItem?.name) return;

		const onChange = () => {
			const properties = fieldModel.getProperties();
			const newHidden = properties.hidden ?? false;
			// Solo actualizar si el valor realmente cambió
			setIsHidden(prev => (prev !== newHidden ? newHidden : prev));
		};

		fieldModel.on("change", onChange);
		return () => {
			fieldModel.off("change", onChange);
		};
		// Usar field.name como dependencia estable
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fieldItem?.name, fieldModel?.name]);

	const {attrs} = useField(model, field);
	if (isHidden || hidden) return null;
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
});
