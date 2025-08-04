import React from "react";
import {Control} from "../field";
import {FormSectionWrapper} from "./wrapper";
import {IFieldContainer} from "../../../interfaces/field-container";

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
	let hidden = false;
	const output = items.reduce((acc, field, index) => {
		if (field.type === "wrapper") {
			if (field?.hidden) hidden = true;
			acc.push(<FormSectionWrapper key={`rf-row__item--${index}`} data={field} model={model} />);
			return acc;
		}

		if (!field.hidden) acc.push(<Control index={index} model={model} field={field} key={`rf-row__item--${index}`} hidden={field?.hidden} />);
		return acc;
	}, []);

	const attrs = {className: `rf-fields-container`, style: {}};
	attrs.style = {gridTemplateColumns: `${gridStyle}`, ...styles};
	if (hidden) return null;
	return <div {...attrs}>{output}</div>;
}
