import React from 'react';
import { Model } from './model';

export function useModel(settings, data) {
	const [model, setModel] = React.useState(null);
	const [ready, setReady] = React.useState(false);

	const startup = () => {
		const model = new Model(settings);
		setModel(model);
	};

	React.useEffect(startup, []);

	return [ready, model];
}
