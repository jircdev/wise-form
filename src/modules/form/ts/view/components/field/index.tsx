import React from "react";
import {Input, Textarea} from "pragmate-ui/form";
import {SelectionField} from "./selection";
import {ControlFieldContainer} from "./container";
import {useWiseFormContext} from "../../context";
import {WiseFormField} from "../../../interfaces/interfaces";
import type {FormModel, WrappedFormModel} from "@bgroup/wise-form/model";
import {useField} from "./use-field";

type WiseFormFieldControlProps = {
	field: WiseFormField;
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

	const {attrs} = useField(model, field);
	if (hidden) return null;
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
});
