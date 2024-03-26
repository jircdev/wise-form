import React from 'react';
import { useWiseFormContext } from '../../context';
import { RowFieldContainer } from '../rows/row-container';

export function Containers() {
	const {
		items,
		rows,
		model,
		template: { styles },
	} = useWiseFormContext();

	const fields = [...model.fields.values()];
	return rows.map((num, index) => {
		const items = fields.splice(0, num[0]);

		return (
			<RowFieldContainer
				model={model}
				template={num}
				items={items}
				key={`rf-row--${index}.${num}`}
				styles={styles}
			/>
		);
	});
}
