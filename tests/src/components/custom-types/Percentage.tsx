import React from 'react';

interface PercentageProps {
	name?: string;
	value?: number | string;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	label?: string;
	disabled?: boolean;
	decimalsLimit?: number;
	className?: string;
	placeholder?: string;
	[key: string]: any;
}

export const Percentage: React.FC<PercentageProps> = ({
	name,
	value,
	onChange,
	label,
	disabled,
	decimalsLimit = 2,
	className,
	placeholder,
	...props
}) => {
	const formatValue = (val: number | string | undefined): string => {
		if (val === undefined || val === null || val === '') return '';
		const numVal = typeof val === 'string' ? parseFloat(val) : val;
		if (isNaN(numVal)) return '';
		return numVal.toFixed(decimalsLimit);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value.replace(/[^0-9.]/g, '');
		if (onChange) {
			const numValue = parseFloat(inputValue) || 0;
			e.target.value = numValue.toString();
			onChange(e);
		}
	};

	return (
		<div className={`percentage-field ${className || ''}`}>
			{label && <label className="field-label">{label}</label>}
			<div className="percentage-input-wrapper">
				<input
					type="text"
					name={name}
					value={formatValue(value)}
					onChange={handleChange}
					disabled={disabled}
					placeholder={placeholder}
					className="percentage-input"
				/>
				<span className="percentage-symbol">%</span>
			</div>
		</div>
	);
};

