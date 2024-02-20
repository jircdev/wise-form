import React from 'react';
import { FormModel } from '../model/model';

export function useModel(settings, form?: FormModel) {
	const [model, setModel] = React.useState(null);
	const [ready, setReady] = React.useState(false);
	const startup = () => {
		const properties = settings.fields.map(item => item.name);
		const values = settings.values || {};

		if (!form) form = new FormModel(settings, { properties, ...values });

		setModel(form);
		const onChange = () => {
			setReady(form.ready);
		};
		form.on('change', onChange);

		onChange();
		return () => {
			form.off('change', onChange);
		};
	};

	React.useEffect(startup, []);

	return [ready, model];
}
