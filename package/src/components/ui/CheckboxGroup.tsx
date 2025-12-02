import React from 'react';
import { Checkbox } from './Checkbox';

export interface CheckboxGroupProps {
	name?: string;
	value?: string[] | number[];
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	disabled?: boolean;
	options?: Array<{ value: string | number; label?: string; [key: string]: any }>;
	className?: string;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = props => {
	const { name, value = [], onChange, disabled, options = [], className } = props;

	const handleChange = (optionValue: string | number) => {
		return (event: React.ChangeEvent<HTMLInputElement>) => {
			if (!onChange) return;
			const currentValues: (string | number)[] = Array.isArray(value) ? [...value] : [];
			const newValues = event.target.checked
				? [...currentValues, optionValue]
				: currentValues.filter(v => v !== optionValue);

			// Create a synthetic event
			const syntheticEvent = {
				...event,
				target: {
					...event.target,
					name: name || '',
					value: newValues,
				} as any,
			} as unknown as React.ChangeEvent<HTMLInputElement>;

			onChange(syntheticEvent);
		};
	};

	return (
		<div className={className}>
			{options.map((option, index) => {
				const optionValue = option.value as string | number;
				const changeHandler = handleChange(optionValue);
				const isChecked = Array.isArray(value) && (value as (string | number)[]).includes(optionValue);
				return (
					<Checkbox
						key={index}
						name={name}
						value={optionValue}
						checked={isChecked}
						onChange={changeHandler}
						disabled={disabled}
						label={option.label}
					/>
				);
			})}
		</div>
	);
};

CheckboxGroup.displayName = 'CheckboxGroup';
