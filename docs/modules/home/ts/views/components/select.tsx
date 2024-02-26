import React from 'react';
import { ReactSelect } from 'pragmate-ui/form/react-select';
import { useWiseFormContext } from '@bgroup/wise-form/form';

export /*bundle*/ const Select = ({ ...props }) => {
	const { model: generalModel } = useWiseFormContext();
	const properties = Object.keys(props).map(item => `this.${item}`);
	const instance = props.model.fields.get(props.name);
	const value = props?.options.find(option => option.value === instance.value);

	const onChange = selected => {
		instance.set(props.name, selected.value);

		if (!props.onSelect && typeof props.onSelect !== 'object') return;

		const updatedProps = {
			...props,
			value: selected.value,
		};

		props.onSelect.forEach(action => {
			const isAnInternalValue = properties.includes(action?.value);
			const value = isAnInternalValue ? updatedProps[action.value.split('.')[1]] : action.value;
			generalModel.getField(action.to).set({ [action.property]: value });
		});
	};
	const customNoOptionsMessage = () => 'No hay opciones';
	return (
		<div className="pui-input pui-react-select">
			<label>
				<span>{props?.label}</span>
				<ReactSelect
					{...props}
					onChange={onChange}
					isDisabled={props?.disabled}
					value={value}
					classNamePrefix="sgs-react-select"
					className="sgs-react-select"
					noOptionsMessage={customNoOptionsMessage}
				/>
			</label>
		</div>
	);
};
