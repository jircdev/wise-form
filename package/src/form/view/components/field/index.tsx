import React from "react";
import { Input, Textarea } from "../../../../components/ui";
import { SelectionField } from "./selection";
import { ControlFieldContainer } from "./container";
import { useWiseFormContext } from "../../context";
import type { FormModel, WrappedFormModel, FormField } from "../../../../models";
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
	const fieldItem = field as any; // Using any to access dynamic properties

	// Early return if field doesn't have a name (except for wrapper types and special types)
	const specialTypes = ['wrapper', 'hr', 'button'];
	let fieldType = fieldItem?.type; // Use let instead of const to allow modification
	const fieldName = fieldItem?.name;
	if (!fieldName && !specialTypes.includes(fieldType)) {
		return null;
	}

	const { attrs } = useField(model, fieldItem);

	// Estado reactivo para el valor de hidden del campo
	const [isHidden, setIsHidden] = React.useState(() => {
		if (hidden !== undefined) return hidden;
		if (!fieldName) return false;
		const fieldModel = model.getField(fieldName);
		if (fieldModel) {
			const properties = (fieldModel as FormField).getProperties();
			return (properties as any).hidden ?? false;
		}
		return (fieldItem as any).hidden ?? false;
	});

	// Suscribirse a los cambios del modelo del campo
	React.useEffect(() => {
		if (!fieldName) return;
		const fieldModel = model.getField(fieldName);
		if (!fieldModel) return;

		const onChange = () => {
			const properties = (fieldModel as FormField).getProperties();
			setIsHidden((properties as any).hidden ?? false);
		};

		fieldModel.on('change', onChange);
		return () => {
			fieldModel.off('change', onChange);
		};
	}, [model, fieldName]);

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

	// Handle undefined type fields - use default type instead of returning null
	if (!fieldType && fieldName) {
		// Check if field has className 'hide' - these are intentionally hidden fields
		const className = (fieldItem as any).className || '';
		if (className.includes('hide') || className === 'hide') {
			return null;
		}

		// Check if it's a hidden field in the model
		const fieldModel = model.getField(fieldName);
		if (fieldModel) {
			const properties = (fieldModel as FormField).getProperties();
			if ((properties as any).hidden) {
				return null;
			}
		}

		// If no type is defined, use default - don't skip the field
		(fieldItem as any).type = 'default';
		fieldType = 'default'; // Update fieldType variable to use default
	}

	const ControlComponent = types[fieldType] ?? types.default;

	if (!ControlComponent) {
		return null;
	}

	// Validar que ControlComponent sea realmente un componente válido (función o clase)
	if (typeof ControlComponent !== 'function' && typeof ControlComponent !== 'object') {
		return null;
	}

	// Si es un objeto, puede ser un componente de React (tiene render o $$typeof)
	if (typeof ControlComponent === 'object' && !ControlComponent.$$typeof && typeof ControlComponent !== 'function') {
		return null;
	}

	// Merge field properties with attrs to ensure custom components receive all necessary props
	const fieldModel = fieldName ? model.getField(fieldName) : null;
	const fieldProperties = fieldModel ? fieldModel.getProperties() : {};

	// Also include original field item properties (like options, label, etc.)
	const fieldItemProps = { ...fieldItem };
	// Remove internal properties that shouldn't be passed to components
	delete (fieldItemProps as any).name;
	delete (fieldItemProps as any).type;

	// Filter out non-HTML attributes from fieldProperties to prevent React warnings
	const invalidAttributes = ['processing', 'processed', 'properties', 'specs', 'hidden', 'identifier'];
	const filteredFieldProperties = Object.keys(fieldProperties).reduce((acc, key) => {
		if (!invalidAttributes.includes(key)) {
			acc[key] = fieldProperties[key];
		}
		return acc;
	}, {} as any);

	return (
		<ControlFieldContainer>
			<ControlComponent {...attrs} {...fieldItemProps} {...filteredFieldProperties} />
		</ControlFieldContainer>
	);
};

