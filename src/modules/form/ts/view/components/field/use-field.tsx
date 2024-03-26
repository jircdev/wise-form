import React from 'react';
import { useWiseFormContext } from '../../context';

export function useField(model, field) {
	const fieldModel = model.getField(field?.name);
	const { formTypes, values } = useWiseFormContext();

	const value = fieldModel?.value ?? values[field?.name];
	const [attributes, setAttributes] = React.useState(fieldModel?.attributes);
    const onChange = event => {
		model.setField(field.name, event.target.value);
	};
	React.useEffect(() => {
		if (!fieldModel) return;
		const onChange = () => {
			setAttributes({ ...fieldModel.attributes });
		};
		fieldModel.on('change', onChange);
		const cleanUp = () => {
			fieldModel.off('change', onChange);
			fieldModel.cleanUp();
		};
		return cleanUp;
	}, [fieldModel]);

	/**
	 * It's necessary to change the field spread.
	 */
	const attrs = { value, ...attributes, onChange };

	return { attrs };
}
