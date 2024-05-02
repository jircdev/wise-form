import React from 'react';
import { useBinder } from '@beyond-js/react-18-widgets/hooks';
import { parseFix } from './fix-number-display';
import { formatToDisplay } from './format-to-display';
import { useWiseFormContext } from '@bgroup/wise-form/form';
interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	decimalsLimit?: number | undefined;
	model: any;
	toFixed?: boolean;
	isSetDefaultValue?: boolean;
}

export /*bundle*/ const PercentageInput = (props: IProps) => {
	const { model } = useWiseFormContext();
	const instance = model.getField(props.name);
	const decimalsLimit = instance.specs.decimalsLimit === undefined ? 2 : instance.specs.decimalsLimit;
	let value = formatToDisplay(instance.value, decimalsLimit, instance.specs.noDecimals);
	if (instance.specs.toFixed) value = parseFix(value, decimalsLimit);

	const convertDisplayToNumeric = display => {
		if (!display) return '';
		const numeric = display.replace(/\./g, '').replace(',', '.');
		return parseFloat(numeric);
	};

	const onBlur = () => {
		let adjustedNumericValue = instance.value;

		if (instance.specs.roundUp) {
			adjustedNumericValue = Math.round(parseFloat(adjustedNumericValue?.toString()));
			instance.value = adjustedNumericValue;
		}

		instance.triggerEvent();
		instance.triggerEvent('blur');
	};

	const onChange = event => {
		const inputDisplayValue: string = event.target.value;
		const inputNumericValue = convertDisplayToNumeric(inputDisplayValue);
		instance.set({ value: inputNumericValue });
	};

	const { isSetDefaultValue, ...properties } = props;
	const cls: string = `pui-input percentage ${instance.specs.className ?? ''} ${value ? 'padding-percent' : ''} `;
	return (
		<div className={cls}>
			<input
				className='percetange-input'
				id='percetange'
				type='text'
				{...properties}
				onChange={onChange}
				onBlur={onBlur}
				value={value}
			/>
			{instance.specs.label && (
				<label className='pui-input__label' htmlFor='percetange'>
					{instance.specs.label}
				</label>
			)}
			{!!value && <span className='symbol-percent'>%</span>}
		</div>
	);
};

PercentageInput.defaultProps = {
	isSetDefaultValue: true,
};
