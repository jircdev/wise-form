import React from 'react';

interface TrafficLightProps {
	name?: string;
	value?: number | string;
	label?: string;
	disabled?: boolean;
	isPercent?: boolean;
	condition?: {
		red?: string;
		yellow?: string;
		green?: string;
		values?: string[];
	};
	parameter?: string;
	color?: string;
	decimalsLimit?: number;
	className?: string;
	[key: string]: any;
}

export const TrafficLight: React.FC<TrafficLightProps> = ({
	name,
	value,
	label,
	disabled,
	isPercent = false,
	condition,
	color = '9',
	decimalsLimit = 2,
	className,
	...props
}) => {
	const formatValue = (val: number | string | undefined): string => {
		if (val === undefined || val === null || val === '') return '0';
		const numVal = typeof val === 'string' ? parseFloat(val) : val;
		if (isNaN(numVal)) return '0';
		const formatted = numVal.toFixed(decimalsLimit);
		return isPercent ? `${formatted}%` : formatted;
	};

	// Determinar el color basado en el valor y las condiciones
	const getColorClass = (): string => {
		const numValue = typeof value === 'string' ? parseFloat(value) : value || 0;
		if (!numValue || numValue === 0) return 'gray';
		// Lógica simplificada: verde si > 50, amarillo si > 20, rojo si <= 20
		if (isPercent) {
			if (numValue >= 50) return 'green';
			if (numValue >= 20) return 'yellow';
			return 'red';
		}
		// Para valores no porcentuales, usar el color del parámetro si está disponible
		return color === '9' ? 'green' : color === '8' ? 'yellow' : 'red';
	};

	const colorClass = getColorClass();
	const displayValue = formatValue(value);

	return (
		<div className={`traffic-light-field ${className || ''}`}>
			{label && <label className="field-label">{label}</label>}
			<div className={`traffic-light-value ${colorClass}`}>
				<span className="traffic-light-indicator"></span>
				<span className="traffic-light-text">{displayValue}</span>
			</div>
		</div>
	);
};

