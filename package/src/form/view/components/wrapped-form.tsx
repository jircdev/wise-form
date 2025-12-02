import React from 'react';
import { WrappedWiseFormContext, useWiseFormContext } from '../context';
import { RowFieldContainer } from './rows/row-container';
import { useTemplate } from '../hooks/use-template';

export function WrappedForm({ children, name, types }): JSX.Element {
	const { model: parent } = useWiseFormContext();
	const wrapper = parent.wrappers.get(name);
	const model = wrapper;
	const template = useTemplate(model.settings);
	const fields = [...model.settings.fields];
	const Containers = template.items.map((num, index) => {
		const items = fields.splice(0, num[0]);
		return <RowFieldContainer template={num} model={model} items={items} key={`rf-row--${index}.${num}`} />;
	});

	const value = {
		model,
		name,
		template,
		formTypes: types ?? {},
		parent,
	};

	return (
		<WrappedWiseFormContext.Provider value={value}>
			{Containers}
			{children}
		</WrappedWiseFormContext.Provider>
	);
}

