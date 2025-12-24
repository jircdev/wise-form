import React from 'react';
import { WrappedWiseFormContext, useWiseFormContext } from '../context';
import { RowFieldContainer } from './rows/row-container';
import { useTemplate } from '../hooks/use-template';

export function WrappedForm({ children, name, types }): JSX.Element {
	const { model: parent } = useWiseFormContext();
	const wrapper = parent.wrappers.get(name);

	if (!wrapper) {
		return null;
	}

	const model = wrapper;
	const template = useTemplate(model.settings);

	// Memoizar fields usando una clave estable basada en el contenido
	// Comparar por longitud y nombres de campos para evitar recrear el array innecesariamente
	const fieldsKey = React.useMemo(() => {
		const fieldsArray = model.settings.fields || [];
		return `${fieldsArray.length}-${fieldsArray.slice(0, 5).map(f => f.name || f.type || '').join(',')}`;
	}, [model.settings.fields]);

	const fields = React.useMemo(() => {
		return [...model.settings.fields];
	}, [fieldsKey]);

	// Use stable references for useMemo dependencies
	// Usar una referencia estable del modelo y sus propiedades clave
	const modelName = model.name;
	const templateItemsLength = template.items?.length || 0;
	const fieldsLength = fields.length;

	// Crear una clave estable basada en las propiedades del modelo que realmente importan
	const modelKey = React.useMemo(() => {
		return `${modelName}-${templateItemsLength}-${fieldsLength}`;
	}, [modelName, templateItemsLength, fieldsLength]);

	const Containers = React.useMemo(() => {
		let currentIndex = 0;
		const result = template.items.map((num, index) => {
			const items = fields.slice(currentIndex, currentIndex + num[0]);
			currentIndex += num[0];
			return <RowFieldContainer template={num} model={model} items={items} key={`rf-row--${index}.${num}`} />;
		});
		return result;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [modelKey]);

	const value = {
		model,
		name,
		template,
		formTypes: types ?? {},
		parent,
	};

	return (
		<WrappedWiseFormContext.Provider value={value}>
			{Containers}
			{children}
		</WrappedWiseFormContext.Provider>
	);
}

