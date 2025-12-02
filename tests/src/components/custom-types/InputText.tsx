import React from 'react';

interface InputTextProps {
	name?: string;
	value?: string;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	label?: string;
	disabled?: boolean;
	placeholder?: string;
	className?: string;
}

export const InputText: React.FC<InputTextProps> = ({
	name,
	value,
	onChange,
	label,
	disabled,
	placeholder,
	className,
}) => {
	return (
		<div className={`input-text-field ${className || ''}`}>
			{label && <label className="field-label">{label}</label>}
			<input
				type="text"
				name={name}
				value={value || ''}
				onChange={onChange}
				disabled={disabled}
				placeholder={placeholder}
				className="input-text"
			/>
		</div>
	);
};




