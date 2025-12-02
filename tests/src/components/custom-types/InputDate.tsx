import React from 'react';

interface InputDateProps {
	name?: string;
	value?: string;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	label?: string;
	disabled?: boolean;
	className?: string;
}

export const InputDate: React.FC<InputDateProps> = ({
	name,
	value,
	onChange,
	label,
	disabled,
	className,
}) => {
	return (
		<div className={`input-date-field ${className || ''}`}>
			{label && <label className="field-label">{label}</label>}
			<input
				type="date"
				name={name}
				value={value || ''}
				onChange={onChange}
				disabled={disabled}
				className="input-date"
			/>
		</div>
	);
};




