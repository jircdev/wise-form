import React from 'react';
import { Tooltip } from './Tooltip';
import { Collapsible } from './Collapsible';
import { WrappedForm } from '@bgroup/wise-form/form';

interface WrapperComponentProps {
	model?: any;
	children?: React.ReactNode;
	[key: string]: any;
}

// Wrapper para div
export const DivWrapper: React.FC<WrapperComponentProps> = ({ model, children, ...props }) => {
	const className = props.className || model?.getProperties()?.className || '';
	return (
		<div className={className} {...props}>
			{children || <WrappedForm name={model?.name} />}
		</div>
	);
};

// Wrapper para section
export const SectionWrapper: React.FC<WrapperComponentProps> = ({ model, children, ...props }) => {
	const className = props.className || model?.getProperties()?.className || '';
	return (
		<section className={className} {...props}>
			{children || <WrappedForm name={model?.name} />}
		</section>
	);
};

// Wrapper para tooltip
export const TooltipWrapper: React.FC<WrapperComponentProps> = ({ model, children, ...props }) => {
	const tooltipData = props.tooltipData || model?.getProperties()?.tooltipData;
	const className = props.className || model?.getProperties()?.className || '';
	return (
		<Tooltip tooltipData={tooltipData} className={className}>
			{children || <WrappedForm name={model?.name} />}
		</Tooltip>
	);
};

// Wrapper para collapsible
export const CollapsibleWrapper: React.FC<WrapperComponentProps> = ({ model, children, ...props }) => {
	const opened = props.opened !== undefined ? props.opened : model?.getProperties()?.opened || false;
	const title = props.title || model?.getProperties()?.title;
	const className = props.className || model?.getProperties()?.className || '';

	const handleToggle = (newOpened: boolean) => {
		if (model) {
			model.set({ opened: newOpened });
		}
	};

	return (
		<Collapsible opened={opened} onToggle={handleToggle} title={title} className={className}>
			{children || <WrappedForm name={model?.name} />}
		</Collapsible>
	);
};

