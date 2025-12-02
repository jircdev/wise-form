import React, { useState, useEffect } from 'react';

interface CollapsibleProps {
	children: React.ReactNode;
	opened?: boolean;
	onToggle?: (opened: boolean) => void;
	title?: string;
	className?: string;
}

export const Collapsible: React.FC<CollapsibleProps> = ({
	children,
	opened: controlledOpened,
	onToggle,
	title,
	className,
}) => {
	const [internalOpened, setInternalOpened] = useState(controlledOpened || false);
	const isControlled = controlledOpened !== undefined;
	const opened = isControlled ? controlledOpened : internalOpened;

	const handleToggle = () => {
		const newOpened = !opened;
		if (!isControlled) {
			setInternalOpened(newOpened);
		}
		if (onToggle) {
			onToggle(newOpened);
		}
	};

	useEffect(() => {
		if (isControlled) {
			setInternalOpened(controlledOpened);
		}
	}, [controlledOpened, isControlled]);

	return (
		<div className={`collapsible-wrapper ${className || ''} ${opened ? 'opened' : ''}`}>
			{title && (
				<button type="button" className="collapsible-header" onClick={handleToggle}>
					<span className="collapsible-title">{title}</span>
					<span className="collapsible-icon">{opened ? '▼' : '▶'}</span>
				</button>
			)}
			{opened && <div className="collapsible-content">{children}</div>}
		</div>
	);
};




