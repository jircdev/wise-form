import React from 'react';
import { useModel } from './hooks/use-model';
import { WiseFormContext } from './context';
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
	}

	if (!settings.name) {
		console.error('the form does not have a name', settings.fields);
		return null;
	}

	if (!ready) return null;
	const fields = [...settings.fields];
	const Containers = items.map((num, index) => {
		const items = fields.splice(0, num[0]);

		return <FieldContainer template={num} items={items} key={`rf-row--${index}.${num}`} styles={styles} />;
	});

	const onSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		instance.onSubmit();
	};

	const value = {
		model: instance,
		values: instance.values,
		name: settings.name,
		template: { type, styles, items },
		formTypes: formTypes,
	};

	return (
		<WiseFormContext.Provider value={value}>
			<form className="reactive-form-container" onSubmit={onSubmit}>
				{Containers}
				{children}
			</form>
		</WiseFormContext.Provider>
	);
}
