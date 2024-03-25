import React from 'react';
import { useWiseFormContext } from '../../context';
import { FieldContainer } from '../rows/row-container';

export function Containers() {
	const {
		items,
		model,
		template: { styles },
	} = useWiseFormContext();

	const fields = [...model.fields.values()];
	return items.map((num, index) => {
		const items = fields.splice(0, num[0]);

		return (
			<FieldContainer
				model={model}
				template={num}
				items={items}
				key={`rf-row--${index}.${num}`}
				styles={styles}
			/>
		);
	});
}
