import React from 'react';
import { useModel } from '../hooks/use-model';
import { ErrorRenderer } from './error';
import { WrappedWiseFormContext, useWiseFormContext } from '../context';
import { FieldContainer } from './rows/row-container';
import { useTemplate } from '../hooks/use-template';

export /*bundle */ function WrappedForm({ children, settings, types, data }): JSX.Element {
	const { model: parent } = useWiseFormContext();
	const [ready, model, values] = useModel(settings, data);
	const template = useTemplate(settings);
	if (settings.name === 'title-data-collapsible') {
		console.log('VALUES => ', values);
	}

	if (!settings.fields) {
		return <ErrorRenderer error="the form does not have fields" />;
	}

	if (!settings.name) {
		return <ErrorRenderer error="the form does not have a name" />;
	}
	if (!ready) return null;
	const fields = [...settings.fields];
	const Containers = template.items.map((num, index) => {
		const items = fields.splice(0, num[0]);

		return <FieldContainer template={num} model={model} items={items} key={`rf-row--${index}.${num}`} />;
	});

	const value = {
		model,
		name: settings.name,
		values,
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
