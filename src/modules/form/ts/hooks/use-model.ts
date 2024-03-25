import React from 'react';
import { FormModel } from '../model/model';
import { useTemplate } from './use-template';

export function useModel(settings, form?: FormModel) {
	const [model, setModel] = React.useState(null);
	const [ready, setReady] = React.useState(false);
	const [values, setValues] = React.useState(form?.values || {});
	const templateSpecs = settings ? settings : form;
	const { type, styles, items } = useTemplate(templateSpecs, templateSpecs.gap);
	const startup = () => {
		const onChange = () => {
			setReady(form.ready);
			setValues({ ...form.values });
		};

		if (!form) {
			const properties = settings.fields.map(item => item.name);
			const values = settings.values || {};
			form = new FormModel(settings, { properties, ...values });
		}

		setModel(form);
		form.on('change', onChange);
		onChange();
		return () => {
			form.off('change', onChange);
		};
	};

	React.useEffect(startup, []);

	return { ready, model, values, type, styles, items };
}
