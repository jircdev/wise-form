import React from 'react';

interface CurrencyProps {
	name?: string;
	value?: number | string;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	label?: string;
	disabled?: boolean;
	toFixed?: boolean;
	decimalsLimit?: number;
	className?: string;
	placeholder?: string;
	[key: string]: any;
}

export const Currency: React.FC<CurrencyProps> = ({
	name,
	value,
	onChange,
	label,
	disabled,
	toFixed = true,
	decimalsLimit = 2,
	className,
	placeholder,
	...props
}) => {
	const formatValue = (val: number | string | undefined): string => {
		if (val === undefined || val === null || val === '') return '';
		const numVal = typeof val === 'string' ? parseFloat(val) : val;
		if (isNaN(numVal)) return '';
		if (toFixed) {
			return numVal.toFixed(decimalsLimit);
		}
		return numVal.toString();
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
		<div className={`currency-field ${className || ''}`}>
			{label && <label className="field-label">{label}</label>}
			<div className="currency-input-wrapper">
				<span className="currency-symbol">$</span>
				<input
					type="text"
					name={name}
					value={formatValue(value)}
					onChange={handleChange}
					disabled={disabled}
					placeholder={placeholder}
					className="currency-input"
				/>
			</div>
		</div>
	);
};

