import React from 'react';
import { useModel } from './hooks/use-model';
import { WiseFormContext } from './context';
import { useTemplate } from './hooks/use-template';
import { useTypes } from './hooks/use-types';

import { IWiseFormSpecs } from '../interfaces/wise-form-specs';
import { Containers } from './components/containers';

export /*bundle */ function WiseForm({ children, settings, types, model }: IWiseFormSpecs): JSX.Element {
	const { ready, model: instance, type, styles, items } = useModel(settings, model);
	const formTypes = useTypes(types);

	if (!ready) return null;

	if (!settings && !model) {
		console.error('the form does not have settings or model defined', settings);
	}

	const onSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		instance.onSubmit();
	};

	const value = {
		model: instance,
		items,
		rows: items,
		values: instance.values,
		name: instance.name,
		template: { type, styles, items },
		formTypes,
	};

	return (
		<WiseFormContext.Provider value={value}>
			<form className='reactive-form-container' onSubmit={onSubmit}>
				<Containers />
				{children}
			</form>
		</WiseFormContext.Provider>
	);
}
