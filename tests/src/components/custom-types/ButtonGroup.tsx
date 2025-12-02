import React from 'react';

interface ButtonGroupProps {
	name?: string;
	value?: string;
	onChange?: (event: React.ChangeEvent<HTMLInputElement> | { target: { value: string } }) => void;
	options?: Array<{ value: string; label: string }>;
	disabledOptions?: string[];
	label?: string;
	disabled?: boolean;
	[key: string]: any;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
	name,
	value,
	onChange,
	options = [],
	disabledOptions = [],
	label,
	disabled,
	...props
}) => {
	const handleClick = (optionValue: string) => {
		if (disabled || disabledOptions.includes(optionValue)) return;
		if (onChange) {
			// Crear un evento sintético compatible con React
			const syntheticEvent = {
				target: { value: optionValue, name },
			} as React.ChangeEvent<HTMLInputElement>;
			onChange(syntheticEvent);
		}
	};

	return (
		<div className="button-group-field">
			{label && <label className="field-label">{label}</label>}
			<div className="button-group">
				{options.map((option) => {
					const isDisabled = disabled || disabledOptions.includes(option.value);
					const isSelected = value === option.value;
					return (
						<button
							key={option.value}
							type="button"
							className={`button-group-item ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
							onClick={() => handleClick(option.value)}
							disabled={isDisabled}
						>
							{option.label}
						</button>
					);
				})}
			</div>
		</div>
	);
};

