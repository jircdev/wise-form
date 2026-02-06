import React from 'react';
import { useModel } from './hooks/use-model';
import { WiseFormContext } from './context';
import { useTypes } from './hooks/use-types';
import type { FormModel } from '@bgroup/wise-form/models';

import { IWiseFormSpecs } from '../interfaces/wise-form-specs';
import { Containers } from './components/containers';

/**
 * Interfaz extendida para FormModel que puede tener el método onSubmit
 * Esto permite que las implementaciones extendidas de FormModel (como en frontend)
 * puedan usar el método onSubmit sin errores de tipado
 */
interface IFormModelWithSubmit extends FormModel {
	onSubmit?: (event: Event | React.FormEvent) => Promise<{ status: boolean; error?: Error }> | void;
}

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

		// Verificar si la instancia tiene el método onSubmit (implementación extendida)
		const modelWithSubmit = instance as IFormModelWithSubmit;
		if (typeof modelWithSubmit.onSubmit === 'function') {
			modelWithSubmit.onSubmit(event);
			return;
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

