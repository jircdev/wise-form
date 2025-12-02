import React from 'react';

interface WiseCheckboxProps {
	name?: string;
	value?: boolean;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	label?: string;
	disabled?: boolean;
	className?: string;
}

export const WiseCheckbox: React.FC<WiseCheckboxProps> = ({
	name,
	value,
	onChange,
	label,
	disabled,
	className,
}) => {
	return (
		<div className={`wise-checkbox-field ${className || ''}`}>
			<label className="wise-checkbox-label">
				<input
					type="checkbox"
					name={name}
					checked={value || false}
					onChange={onChange}
					disabled={disabled}
					className="wise-checkbox-input"
				/>
				{label && <span className="wise-checkbox-text">{label}</span>}
			</label>
		</div>
	);
};




