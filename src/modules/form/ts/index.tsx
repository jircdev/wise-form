import React from 'react';
import { useModel } from './use-model';
import { Control } from './field';
import { ErrorRenderer } from './error';
import { ReactiveFormContext } from './context';
import { FieldContainer } from './rows/row-container';

export /*bundle */ function ReactiveForm({ children, settings, types, data }): JSX.Element {
	const [ready, model] = useModel(settings, data);

	function parseTemplate(template) {
		if (!template) return Array(settings.fields.length).fill(1);
		return template.split(';').flatMap(part => {
			const [num, times] = part.split('x').map(Number);
			return times ? Array(times).fill(num) : [num];
		});
	}

	const template = parseTemplate(settings.template);

	if (!settings.fields) {
		return <ErrorRenderer error='the form does not have fields' />;
	}

	if (!settings.name) {
		return <ErrorRenderer error='the form does not have a name' />;
	}
	const fields = [...settings.fields];
	const Containers = template.map((num, index) => {
		const items = fields.splice(0, num);
		return <FieldContainer columns={num} items={items} index={`${num}.${index}`} key={`rf-row--${index}.${num}`} />;
	});
	const output = settings.fields.map((field, index) => {
		return <Control index={index} field={field} key={`${settings.name}.${field.name}`} />;
	});

	const value = {
		model,
		name: settings.name,
		template,
		formTypes: types ?? {},
	};

	return (
		<ReactiveFormContext.Provider value={value}>
			<form className='reactive-form-container'>
				{Containers}

				<hr />
				{children}
			</form>
		</ReactiveFormContext.Provider>
	);
}
