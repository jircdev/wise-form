import React from "react";
import {useWiseFormContext} from "../../context";
import {RowFieldContainer} from "../rows/row-container";

export function Containers() {
	const {
		rows,
		model,
		template: {styles},
	} = useWiseFormContext();

	const fields = [...model.fields.values()];
	
	// Use slice instead of splice to avoid mutating the array
	// Calculate indices safely using useMemo with stable dependencies
	const rowsLength = rows?.length || 0;
	const fieldsSize = model.fields?.size || 0;
	const modelName = model.name;
	
	const containers = React.useMemo(() => {
		let currentIndex = 0;
		const result = rows.map((num, index) => {
			const items = fields.slice(currentIndex, currentIndex + num[0]) as any; // Type assertion needed due to TypeScript strictness
			currentIndex += num[0];
			return <RowFieldContainer model={model} template={num} items={items} key={`rf-row--${index}.${num}`} styles={styles} />;
		});
		return result;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [rowsLength, fieldsSize, modelName]);
	
	React.useEffect(() => {
		const formElement = document.querySelector('form.reactive-form-container') as HTMLElement;
		const containerElements = formElement?.querySelectorAll('.rf-fields-container');
		
		// Verificar si hay algún contenedor que retorna null
		if (containers.length > 0 && (!containerElements || containerElements.length === 0)) {
			// Silent check - no logging
		}
	}, [containers.length]);
	
	if (containers.length === 0) {
		return null;
	}
	
	return <>{containers}</>;
}

