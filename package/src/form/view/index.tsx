import React from 'react';
import { useModel } from './hooks/use-model';
import { WiseFormContext } from './context';
import { useTypes } from './hooks/use-types';

import { IWiseFormSpecs } from '../interfaces/wise-form-specs';
import { Containers } from './components/containers';

export function WiseForm({ children, settings, types, model }: IWiseFormSpecs): JSX.Element {
	const { ready, model: instance, type, styles, items } = useModel(settings, model);
	const formTypes = useTypes(types);

	// IMPORTANTE: useEffect debe estar ANTES de cualquier early return
	// para cumplir con las reglas de hooks de React
	React.useEffect(() => {
		if (!ready || !instance) return;
	}, [ready, instance?.name]);

	if (!ready) {
		return null;
	}

	if (!settings && !model) {
		return null;
	}

	if (!instance) {
		return null;
	}

	const onSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		// Form submission can be handled via callbacks or custom handlers
		if (instance.callbacks?.onSubmit) {
			instance.callbacks.onSubmit({ form: instance, event });
		}
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
			<form onKeyDown={(e) => {
				if (e.key === 'Enter') e.preventDefault();
			}} className="reactive-form-container grid gap-4" onSubmit={onSubmit}>
				<Containers />
				{children}
			</form>
		</WiseFormContext.Provider>
	);
}

