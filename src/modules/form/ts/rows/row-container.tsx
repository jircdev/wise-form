import React from 'react';
import { Control } from '../field';
import { FormSectionWrapper } from './wrapper';

export function FieldContainer({ template: [totalFields, gridStyle], items, styles }) {
	const output = items.map((field, index) => {
		if (field.type === 'wrapper') {
			return <FormSectionWrapper key={`rf-row__item--${index}`} data={field} />;
		}
		return <Control index={index} field={field} key={`rf-row__item--${index}`} />;
	});

	const attrs = { className: `rf-fields-container`, style: {} };
	attrs.style = { gridTemplateColumns: `${gridStyle}`, ...styles };

	return <div {...attrs}>{output}</div>;
}
