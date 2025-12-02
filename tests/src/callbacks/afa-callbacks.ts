import { FormModel } from '@bgroup/wise-form/models';

export interface CallbackContext {
	form: FormModel;
	field?: string;
	value?: any;
	event?: Event;
	[key: string]: any;
}

export const createAfaCallbacks = (formModel: FormModel) => {
	return {
		// Callback para copiar valores entre campos
		copyValue: (context: CallbackContext) => {
			const { form, field, to, from, propertyToCopy, valueSeparator } = context;
			if (!field || !to || !from) return;

			const sourceField = form.getField(from);
			if (!sourceField) return;

			const sourceValue = sourceField.getProperties();
			let valueToCopy = sourceValue.value;

			if (propertyToCopy && sourceValue[propertyToCopy]) {
				valueToCopy = sourceValue[propertyToCopy];
			}

			if (valueSeparator && typeof valueToCopy === 'string') {
				const parts = valueToCopy.split(valueSeparator);
				valueToCopy = parts.length > 1 ? parts[1] : valueToCopy;
			}

			const targetField = form.getField(to);
			if (targetField) {
				targetField.set({ value: valueToCopy });
			}
		},

		// Callback para obtener parámetros de tráfico
		getParametersTraffic: (context: CallbackContext) => {
			const { form, settings } = context;
			if (!settings || !settings.fieldsToSetParameters) return;

			// Simular parámetros de tráfico
			const mockParameters = {
				PorcentajeMB: { value: 30, yellow: 20, red: 10, green: 40 },
				PorcentajeVta12M: { value: 25, yellow: 15, red: 5, green: 35 },
				RentabilidadAXPorc: { value: 15, yellow: 10, red: 5, green: 20 },
				Rentabilidad: { value: 20, yellow: 15, red: 10, green: 25 },
				Multiplicador: { value: 2.5, yellow: 2.0, red: 1.5, green: 3.0 },
				PorcentajeDescuento: { value: 10, yellow: 15, red: 20, green: 5 },
			};

			Object.entries(settings.fieldsToSetParameters).forEach(([paramKey, fieldName]) => {
				const param = mockParameters[paramKey as keyof typeof mockParameters];
				if (param) {
					const field = form.getField(fieldName as string);
					if (field) {
						field.set({
							parameter: param.value,
							condition: {
								red: param.red.toString(),
								yellow: param.yellow.toString(),
								green: param.green.toString(),
							},
						});
					}
				}
			});
		},

		// Callback para validar sello de unidad de negocio
		validateSealBusinessUnit: (context: CallbackContext) => {
			console.log('Validating seal business unit', context);
			// Implementación simplificada
		},

		// Callback para establecer valores en múltiples campos
		setValueFields: (context: CallbackContext) => {
			const { form, fields } = context;
			if (!fields || !Array.isArray(fields)) return;

			fields.forEach((fieldConfig: any) => {
				const { to, property, value } = fieldConfig;
				const field = form.getField(to);
				if (field) {
					field.set({ [property]: value });
				}
			});
		},

		// Callback para limpiar campos
		setClear: (context: CallbackContext) => {
			const { form, to } = context;
			if (!to) return;

			const field = form.getField(to);
			if (field) {
				field.set({ value: field.type === 'wrapper' ? [] : '' });
			}
		},

		// Callback para establecer valor en un campo
		setValueField: (context: CallbackContext) => {
			const { form, to, property, value } = context;
			if (!to) return;

			const field = form.getField(to);
			if (field) {
				field.set({ [property]: value });
			}
		},

		// Callback para ocultar/mostrar campos
		hidde: (context: CallbackContext) => {
			const { form, dependency, value } = context;
			if (!dependency) return;

			const field = form.getField(dependency);
			if (field) {
				field.set({ hidden: value });
			}
		},

		// Callback para simular eventos
		onSimulate: (context: CallbackContext) => {
			const { form, event } = context;
			if (event && form) {
				form.triggerEvent(event);
			}
		},

		// Callback para seleccionar item en JView
		selectItemJView: (context: CallbackContext) => {
			const { form, property, isSetInputs } = context;
			console.log('Selecting item in JView', { form, property, isSetInputs });
			// Implementación simplificada
		},

		// Callback para eliminar item en JView
		deleteItemInJView: (context: CallbackContext) => {
			const { form, close } = context;
			console.log('Deleting item in JView', { form, close });
			// Implementación simplificada
		},

		// Callback para duplicar item en JView
		duplicateItemJView: (context: CallbackContext) => {
			const { form, ignore } = context;
			console.log('Duplicating item in JView', { form, ignore });
			// Implementación simplificada
		},

		// Callback para seleccionar item AFA
		selectedItemAfa: (context: CallbackContext) => {
			const { form, callbacks } = context;
			if (callbacks && Array.isArray(callbacks)) {
				callbacks.forEach((callbackConfig: any) => {
					const callback = createAfaCallbacks(form)[callbackConfig.callback];
					if (callback) {
						callback({ ...context, ...callbackConfig });
					}
				});
			}
		},

		// Callback para establecer valores previos
		setPrevValues: (context: CallbackContext) => {
			const { form, fields, isSaved } = context;
			if (!fields || !Array.isArray(fields)) return;

			fields.forEach((fieldConfig: any) => {
				const { field, property } = fieldConfig;
				const fieldModel = form.getField(field);
				if (fieldModel) {
					const currentValue = fieldModel.getProperties()[property];
					// Guardar valor previo (implementación simplificada)
					console.log('Saving previous value', { field, property, currentValue, isSaved });
				}
			});
		},

		// Callback para valores previos
		prevValues: (context: CallbackContext) => {
			const { form, dependency } = context;
			console.log('Restoring previous values', { form, dependency });
			// Implementación simplificada
		},

		// Callback para disparar evento
		triggerEvent: (context: CallbackContext) => {
			const { form, to, event } = context;
			if (form && event) {
				const field = form.getField(to);
				if (field) {
					field.triggerEvent(event);
				}
			}
		},

		// Callback para evento de campo
		eventField: (context: CallbackContext) => {
			const { form, field } = context;
			if (form && field) {
				const fieldModel = form.getField(field);
				if (fieldModel) {
					fieldModel.triggerEvent('change');
				}
			}
		},

		// Callback para toggle de propiedades
		togglePropertiesValue: (context: CallbackContext) => {
			const { form, to, property } = context;
			if (!to) return;

			const field = form.getField(to);
			if (field) {
				const currentValue = field.getProperties()[property];
				field.set({ [property]: !currentValue });
			}
		},

		// Callback para toggle de flag en JView
		toggleFlagSelectItemJView: (context: CallbackContext) => {
			const { form, value } = context;
			console.log('Toggling flag select item JView', { form, value });
			// Implementación simplificada
		},

		// Callback para seleccionar delete
		selectedDelete: (context: CallbackContext) => {
			const { form, key } = context;
			console.log('Selected delete', { form, key });
			// Implementación simplificada
		},

		// Callback para búsqueda en tablas
		searchTables: (context: CallbackContext) => {
			const { form, endpoint, fields, toSet, fieldType } = context;
			console.log('Searching tables', { form, endpoint, fields, toSet, fieldType });
			// Implementación simplificada - retornar datos mock
		},

		// Callback para copiar valor desde tercero
		copyValueFromThird: (context: CallbackContext) => {
			const { form, from, to, property, regexpReplace } = context;
			if (!from || !to) return;

			const sourceField = form.getField(from);
			if (!sourceField) return;

			let value = sourceField.getProperties()[property || 'value'];
			if (regexpReplace && typeof value === 'string') {
				Object.entries(regexpReplace).forEach(([key, pattern]) => {
					value = value.replace(new RegExp(pattern as string, 'g'), '');
				});
			}

			const targetField = form.getField(to);
			if (targetField) {
				targetField.set({ value });
			}
		},

		// Callback para fetch de button group
		onButtonGroupFetch: (context: CallbackContext) => {
			const { form, field } = context;
			console.log('Button group fetch', { form, field });
			// Implementación simplificada
		},

		// Callback para fetch de select
		onSelectFetch: (context: CallbackContext) => {
			const { form, field, action } = context;
			console.log('Select fetch', { form, field, action });
			// Implementación simplificada
		},

		// Callback para select width/height
		onSelectWidthHeight: (context: CallbackContext) => {
			const { form, field } = context;
			console.log('Select width/height', { form, field });
			// Implementación simplificada
		},

		// Callback para select sello
		onSelectSeal: (context: CallbackContext) => {
			const { form, field } = context;
			console.log('Select seal', { form, field });
			// Implementación simplificada
		},

		// Callback para toggle flag producción inversión
		toggleFlagProductionInversion: (context: CallbackContext) => {
			const { form, value } = context;
			console.log('Toggle flag production inversion', { form, value });
			// Implementación simplificada
		},

		// Callback onSubmit (se puede sobrescribir)
		onSubmit: (context: CallbackContext) => {
			const { form, event } = context;
			if (event) {
				event.preventDefault();
			}
			console.log('Form submitted', form.values);
		},
	};
};

