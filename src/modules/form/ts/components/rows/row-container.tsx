import React from 'react';
import { Control } from '../field';
import { FormSectionWrapper } from './wrapper';
import { IWiseFormField } from '../../interfaces/interfaces';

export interface IFieldContainer {
	template: [number, string];
	items: IWiseFormField[];
	styles?: any; // @todo: add correct type
	model: any;
}
export function FieldContainer({ template: [totalFields, gridStyle], items, styles, model }: IFieldContainer) {
	const output = items.map((field, index) => {
		if (field.type === 'wrapper') {
			return null;
			return <FormSectionWrapper key={`rf-row__item--${index}`} model={model} data={field} />;
		}
		return <Control index={index} model={model} field={field} key={`rf-row__item--${index}`} />;
	});

	const attrs = { className: `rf-fields-container`, style: {} };
	attrs.style = { gridTemplateColumns: `${gridStyle}`, ...styles };

	return <div {...attrs}>{output}</div>;
}
