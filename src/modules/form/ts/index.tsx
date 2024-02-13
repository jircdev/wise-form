import React from 'react';
import { useModel } from './hooks/use-model';

import { ErrorRenderer } from './components/error';
import { ReactiveFormContext } from './context';
import { FieldContainer } from './components/rows/row-container';
import { useTemplate } from './hooks/use-template';

import { useTypes } from './hooks/use-types';

export /*bundle */ function WiseForm({ children, settings, types, data }): JSX.Element {
	const [ready, model] = useModel(settings, data);

	const { type, styles, items } = useTemplate(settings, settings.gap);

	const formTypes = useTypes(types);

	if (!settings.fields) {
		throw new Error('the form does not have fields');
		//return <ErrorRenderer error='the form does not have fields' />;
	}

	if (!settings.name) {
		throw new Error('the form does not have a name');
		// return <ErrorRenderer error='the form does not have a name' />;
	}

	if (!ready) return null;
	const fields = [...settings.fields];
	const Containers = items.map((num, index) => {
		const items = fields.splice(0, num[0]);

		return <FieldContainer template={num} items={items} key={`rf-row--${index}.${num}`} styles={styles} />;
	});

	const value = {
		model,
		values: model.defaultValues,
		name: settings.name,
		template: { type, styles, items },
		formTypes: formTypes,
	};

	return (
		<ReactiveFormContext.Provider value={value}>
			<form className='reactive-form-container'>
				{Containers}
				{children}
			</form>
		</ReactiveFormContext.Provider>
	);
}
