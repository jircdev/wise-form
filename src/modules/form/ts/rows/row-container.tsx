import React from 'react';
import { Control } from '../field';

export function FieldContainer({ columns, items, index }) {
	const output = items.map((field, index) => {
		return <Control index={index} field={field} key={`rf-row__item--${index}`} />;
	});

	return <div className={`rf-fields-container fr-${columns}`}>{output}</div>;
}
