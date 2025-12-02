import React from 'react';

interface ButtonProps {
	label?: string;
	variant?: 'primary' | 'secondary' | 'danger';
	onClick?: () => void;
	type?: 'button' | 'submit' | 'reset';
	disabled?: boolean;
	className?: string;
}

export const Button: React.FC<ButtonProps> = ({
	label,
	variant = 'primary',
	onClick,
	type = 'button',
	disabled,
	className,
}) => {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`custom-button ${variant} ${className || ''}`}
		>
			{label}
		</button>
	);
};




