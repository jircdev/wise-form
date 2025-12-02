import React, { useState } from 'react';

interface TooltipProps {
	children: React.ReactNode;
	tooltipData?: {
		title: string;
		content?: string;
	};
	className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, tooltipData, className }) => {
	const [isVisible, setIsVisible] = useState(false);

	return (
		<div
			className={`tooltip-wrapper ${className || ''}`}
			onMouseEnter={() => setIsVisible(true)}
			onMouseLeave={() => setIsVisible(false)}
		>
			{children}
			{tooltipData && isVisible && (
				<div className="tooltip-content">
					<div className="tooltip-title">{tooltipData.title}</div>
					{tooltipData.content && <div className="tooltip-text">{tooltipData.content}</div>}
				</div>
			)}
		</div>
	);
};




