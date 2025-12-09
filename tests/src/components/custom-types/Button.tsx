import React from 'react';
import { useWiseFormContext } from '@bgroup/wise-form/form';

interface ButtonProps {
	name?: string;
	label?: string;
	variant?: 'primary' | 'secondary' | 'danger';
	onClick?: any;
	handleClick?: () => void;
	type?: 'button' | 'submit' | 'reset';
	disabled?: boolean;
	className?: string;
}

export const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
	const { model } = useWiseFormContext();
	const { name, label, variant = 'primary', onClick, handleClick, type = 'button', disabled, className } = props;

	if (!model || !name) {
		return (
			<button
				type={type}
				disabled={disabled}
				className={`custom-button ${variant} ${className || ''}`}
			>
				{label}
			</button>
		);
	}

	const instance = model.getField(name);

	const handleButtonClick = async (_event: React.MouseEvent) => {
		const params = instance?.specs?.onClick || onClick;

		if (params && params.condition) {
			let canExecute = false;
			if (params?.condition?.hasValue) {
				canExecute = params.condition.hasValue.every((item: string) => {
					const field = model.getField(item);
					return field?.value;
				});
			}
			if (!canExecute) return;

			params.field.forEach((action: any) => {
				const field = model.getField(action.to);
				field.set({ [action.property]: action.value });
				field[action.property] = action.value;
			});

			return;
		}

		if (params && Array.isArray(params)) {
			params.forEach(async (action: any) => {
				if (action?.type && action.type === 'event') {
					model.callbacks[action.callback]({ ...action, form: model });
					return;
				}

				if (action?.callback) {
					const dependency = await model.getField(action.dependency);
					await dependency?.isReady;
					model.callbacks[action.callback]({ ...action, dependency, form: model });
					return;
				}

				if (action.type === 'reset') {
					if (Array.isArray(action.to)) {
						action.to.forEach(async (key: string) => {
							const field = model.getField(key);
							if (!field) return;
							await field.isReady;
							field.clear();
						});
						return;
					}
					model.getField(action.to).clear();
					return;
				}

				if (!action?.to) return;
				const field = model.getField(action.to);
				if (!field) return;
				await field.isReady;
				field.set({ [action.property]: action.value });
				if (action.property === 'disabled') field[action.property] = action.value;
			});
		}

		if (handleClick) handleClick();
		instance?.triggerEvent();
	};

	return (
		<button
			type={type}
			onClick={handleButtonClick}
			disabled={disabled}
			className={`custom-button ${variant} ${className || ''}`}
		>
			{label}
		</button>
	);
};




