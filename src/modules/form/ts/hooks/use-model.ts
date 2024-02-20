import React from 'react';
import { FormModel } from '../model/model';

export function useModel(settings, form?: FormModel) {
	const [model, setModel] = React.useState(null);
	const [ready, setReady] = React.useState(false);
	const [values, setValues] = React.useState(form?.values || {});

	const startup = () => {
		const properties = settings.fields.map(item => item.name);
		const values = settings.values || {};
		if (!form) form = new FormModel(settings, { properties, ...values });

		setModel(form);
		const onChange = () => {
			setReady(form.ready);
			setValues({ ...form.values });
			if (settings.name === 'title-data-collapsible') {
				console.log('CHANGED', settings.name, { ...form.values });
			}
		};
		form.on('change', onChange);

		onChange();
		return () => {
			form.off('change', onChange);
		};
	};

	React.useEffect(startup, []);

	return [ready, model, values];
}
