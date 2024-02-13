import React from 'react';
import { Model } from '../model';

export function useModel(settings, data) {
	const [model, setModel] = React.useState(null);
	const [ready, setReady] = React.useState(false);

	const startup = () => {
		const model = new Model(settings);
		setModel(model);
		const onChange = () => {
			setReady(model.ready);
		};
		model.on('change', onChange);
		onChange();
		return () => {
			model.off('change', onChange);
		};
	};

	React.useEffect(startup, []);

	return [ready, model];
}
