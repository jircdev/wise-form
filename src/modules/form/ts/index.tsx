import React from 'react';
import { useModel } from './hooks/use-model';

import { ErrorRenderer } from './components/error';
import { ReactiveFormContext } from './context';
import { FieldContainer } from './components/rows/row-container';
import { useTemplate } from './hooks/use-template';
import { useTypes } from './hooks/use-types';

import { IWiseFormSpecs } from './interfaces/wise-form-specs';

export /*bundle */ function WiseForm({ children, settings, types, model }: IWiseFormSpecs): JSX.Element {
	const [ready, instance] = useModel(settings, model);

	const { type, styles, items } = useTemplate(settings, settings.gap);

	const formTypes = useTypes(types);

	if (!settings.fields) {
		console.error('the form does not have fields', settings.name);
		//return <ErrorRenderer error='the form does not have fields' />;
	}

	if (!settings.name) {
		console.error('the form does not have a name', settings.fields);
		// return <ErrorRenderer error='the form does not have a name' />;
	}

	if (!ready) return null;
	const fields = [...settings.fields];
	const Containers = items.map((num, index) => {
		const items = fields.splice(0, num[0]);

		return <FieldContainer template={num} items={items} key={`rf-row--${index}.${num}`} styles={styles} />;
	});

	const value = {
		model: instance,
		values: instance.values,
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
