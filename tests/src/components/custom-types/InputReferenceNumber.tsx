import React from 'react';

interface InputReferenceNumberProps {
	name?: string;
	value?: string;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	label?: string;
	disabled?: boolean;
	className?: string;
}

export const InputReferenceNumber: React.FC<InputReferenceNumberProps> = ({
	name,
	value,
	onChange,
	label,
	disabled,
	className,
}) => {
	return (
		<div className={`input-reference-number-field ${className || ''}`}>
			{label && <label className="field-label">{label}</label>}
			<input
				type="text"
				name={name}
				value={value || ''}
				onChange={onChange}
				disabled={disabled}
				className="input-reference-number"
				readOnly
			/>
		</div>
	);
};




