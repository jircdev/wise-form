import React from 'react';

interface HrProps {
	name?: string;
	className?: string;
}

export const Hr: React.FC<HrProps> = ({ name, className }) => {
	return <hr className={`form-hr ${className || ''}`} data-name={name} />;
};




