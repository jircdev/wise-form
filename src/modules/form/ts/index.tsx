import React from 'react';
import { useModel } from './use-model';
import { Control } from './field';
import { ErrorRenderer } from './error';
import { ReactiveFormContext } from './context';

export /*bundle */ function ReactiveForm({ settings, data }): JSX.Element {
	const [ready, model] = useModel(settings, data);

	if (!settings.fields) {
		return <ErrorRenderer error='the form does not have fields' />;
	}

	if (!settings.name) {
		return <ErrorRenderer error='the form does not have a name' />;
	}

	const output = settings.fields.map((field, index) => {
		return <Control field={field} key={`${settings.name}.${field.name}`} />;
	});

	const value = {
		model,
		name: settings.name,
	};

	return (
		<ReactiveFormContext.Provider value={value}>
			<form className='reactive-form-container'>{output}</form>
		</ReactiveFormContext.Provider>
	);
}
