import React from 'react';
import { Model } from '../model/model';

export function useModel(settings) {
	const [model, setModel] = React.useState(null);
	const [ready, setReady] = React.useState(false);
	const startup = () => {
		const properties = settings.fields.map(item => item.name);
		const values = settings.values || {};
		const model = new Model(settings, { properties, ...values });

		setModel(model);
		const onChange = () => {
			setReady(model.ready);
		};
		model.on('change', onChange);
		globalThis.model = model;
		onChange();
		return () => {
			model.off('change', onChange);
		};
	};

	React.useEffect(startup, []);

	return [ready, model];
}
