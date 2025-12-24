import React from 'react';
import { FormModel } from '@bgroup/wise-form/models';
import { useTemplate } from './use-template';

/**
 * Hook para gestionar el modelo del formulario
 * 
 * Principios SOLID aplicados:
 * - Single Responsibility: Solo gestiona el estado del modelo del formulario
 * - Open/Closed: Extensible mediante eventos del modelo sin modificar el hook
 * - Dependency Inversion: Depende de la abstracción FormModel, no de implementaciones concretas
 */
export function useModel(settings, form?: FormModel) {
	// Estado del modelo - usa el form pasado o null inicialmente
	const [model, setModel] = React.useState<FormModel | null>(form || null);
	
	// Determinar si el modelo está listo basándose en su estado real
	const getModelReadyState = React.useCallback((currentModel: FormModel | null): boolean => {
		if (!currentModel) return false;
		
		// Si el modelo tiene la propiedad ready, usarla
		if (currentModel.ready !== undefined) {
			return currentModel.ready === true;
		}
		
		// Si no tiene ready pero tiene campos y wrappers, asumir que está listo
		const hasFields = currentModel.fields?.size > 0;
		const hasWrappers = currentModel.wrappers?.size > 0;
		const hasName = !!currentModel.name;
		
		// Está listo si tiene al menos campos o wrappers y un nombre
		return hasName && (hasFields || hasWrappers);
	}, []);
	
	// Estado de ready basado en el modelo actual
	const [ready, setReady] = React.useState(() => getModelReadyState(form || null));
	const [values, setValues] = React.useState(() => form?.values || {});
	
	// Template specs: usar settings si están disponibles, sino usar el form
	const templateSpecs = settings || form;
	const { type, styles, items } = useTemplate(templateSpecs, templateSpecs?.gap);
	
	// Efecto para inicializar y suscribirse a cambios del modelo
	React.useEffect(() => {
		let currentModel: FormModel | null = null;
		let cleanup: (() => void) | null = null;
		
		// Si ya tenemos un modelo, usarlo directamente
		if (form) {
			currentModel = form;
			setModel(form);
			const initialReady = getModelReadyState(form);
			setReady(initialReady);
			setValues({ ...form.values });
		} 
		// Si no hay modelo pero hay settings, crear uno nuevo
		else if (settings) {
			try {
				const properties = settings.fields?.map((item: any) => item.name) || [];
				const values = settings.values || {};
				currentModel = new FormModel(settings, { properties, ...values });
				setModel(currentModel);
				
				// Verificar estado inicial del modelo creado
				const modelReady = getModelReadyState(currentModel);
				setReady(modelReady);
				setValues({ ...currentModel.values });
			} catch (error) {
				setReady(false);
				return;
			}
		} 
		// No hay modelo ni settings
		else {
			setReady(false);
			return;
		}
		
		// Suscribirse a cambios del modelo para actualizar el estado
		if (currentModel) {
			const onChange = () => {
				const isReady = getModelReadyState(currentModel);
				setReady(isReady);
				if (currentModel) {
					setValues({ ...currentModel.values });
				}
			};
			
			currentModel.on('change', onChange);
			cleanup = () => {
				currentModel?.off('change', onChange);
			};
		}
		
		return () => {
			if (cleanup) {
				cleanup();
			}
		};
	}, [form?.name, settings?.name, getModelReadyState]);

	return { ready, model, values, type, styles, items };
}
