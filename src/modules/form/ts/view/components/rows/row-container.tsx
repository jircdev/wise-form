import React from "react";
import {Control} from "../field";
import {FormSectionWrapper} from "./wrapper";
import {IFieldContainer} from "../../../interfaces/field-container";
import type {FormField, WrappedFormModel} from "@bgroup/wise-form/model";

/**
 * Represents a container for form fields within a row, organizing them according to a specified grid style.
 * This component is used to group form fields dynamically based on the `template` property, allowing for
 * a flexible layout structure within the form. It supports wrapping fields in a div with a CSS grid layout
 * to align items as specified by the `template` and `styles` provided.
 *
 * @param {Object} props The properties passed to the RowFieldContainer component.
 * @param {[number, string]} props.template A tuple where the first element is the total number of fields in the row,
 * and the second element is a string representing the CSS grid template for the layout of these fields.
 * @param {WiseFormField[]} props.items An array of form field configurations that will be rendered within this row.
 * @param {any} [props.styles] Optional styles to be applied to the row container, allowing for further customization.
 * @param

*/
export function RowFieldContainer({template: [totalFields, gridStyle], items, styles, model}: IFieldContainer) {
	// Estado para rastrear los valores de hidden de cada campo de forma reactiva
	const [fieldHiddenStates, setFieldHiddenStates] = React.useState<Record<string, boolean>>(() => {
		const initialStates: Record<string, boolean> = {};
		items.forEach((field) => {
			const fieldItem = field as FormField | WrappedFormModel | any;
			if (fieldItem?.name) {
				const fieldModel = model.getField(fieldItem.name);
				if (fieldModel) {
					const properties = fieldModel.getProperties();
					initialStates[fieldItem.name] = properties.hidden ?? false;
				} else {
					initialStates[fieldItem.name] = fieldItem.hidden ?? false;
				}
			}
		});
		return initialStates;
	});

	// Usar useRef para rastrear los listeners y evitar re-suscripciones innecesarias
	const listenersRef = React.useRef<Array<() => void>>([]);
	const subscribedFieldsRef = React.useRef<Set<string>>(new Set());

	// Suscribirse a los cambios de cada campo para detectar cambios en hidden
	React.useEffect(() => {
		// Limpiar listeners anteriores
		listenersRef.current.forEach((cleanup) => cleanup());
		listenersRef.current = [];
		subscribedFieldsRef.current.clear();

		// Obtener nombres de campos actuales
		const currentFieldNames: string[] = [];
		items.forEach((field) => {
			const fieldItem = field as FormField | WrappedFormModel | any;
			if (fieldItem?.name) {
				currentFieldNames.push(fieldItem.name);
			}
		});

		currentFieldNames.forEach((fieldName) => {
			// Evitar suscribirse dos veces al mismo campo
			if (subscribedFieldsRef.current.has(fieldName)) return;
			subscribedFieldsRef.current.add(fieldName);

			const fieldModel = model.getField(fieldName);
			if (!fieldModel || fieldModel.type === "wrapper") return;

			const onChange = () => {
				const properties = fieldModel.getProperties();
				const newHidden = properties.hidden ?? false;
				setFieldHiddenStates((prev) => {
					// Solo actualizar si el valor realmente cambió
					if (prev[fieldName] === newHidden) {
						return prev;
					}
					return {
						...prev,
						[fieldName]: newHidden,
					};
				});
			};

			fieldModel.on('change', onChange);
			listenersRef.current.push(() => fieldModel.off('change', onChange));
		});

		return () => {
			listenersRef.current.forEach((cleanup) => cleanup());
			listenersRef.current = [];
			subscribedFieldsRef.current.clear();
		};
		// Usar items.length como dependencia para detectar cambios en la cantidad de campos
		// Los nombres específicos se manejan dentro del efecto
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [items.length, model]);

	let hidden = false;
	const output = items.reduce((acc, field, index) => {
		const fieldItem = field as FormField | WrappedFormModel | any;
		if (fieldItem.type === "wrapper") {
			const wrapperModel = model.getField(fieldItem.name);
			const wrapperHidden = wrapperModel
				? (wrapperModel.getProperties().hidden ?? false)
				: (fieldItem?.hidden ?? false);
			if (wrapperHidden) hidden = true;
			acc.push(<FormSectionWrapper key={`rf-row__item--${index}`} data={fieldItem} model={model} />);
			return acc;
		}

		const isHidden = fieldHiddenStates[fieldItem?.name] ?? fieldItem.hidden ?? false;
		if (!isHidden) {
			acc.push(<Control index={index} model={model} field={fieldItem} key={`rf-row__item--${index}`} hidden={isHidden} />);
		}
		return acc;
	}, []);

	const attrs = {className: `rf-fields-container`, style: {}};
	attrs.style = {gridTemplateColumns: `${gridStyle}`, ...styles};
	if (hidden) return null;
	return <div {...attrs}>{output}</div>;
}
