import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	name?: string;
	value?: string | number;
	onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
	disabled?: boolean;
	options?: Array<{ value: string | number; label?: string; [key: string]: any }>;
	className?: string;
	id?: string;
	placeholder?: string;
	[key: string]: any; // Allow additional props that will be filtered
}

// Helper function to filter out non-HTML attributes
const filterHtmlAttributes = (props: Record<string, any>): React.SelectHTMLAttributes<HTMLSelectElement> => {
	const invalidAttributes = [
		'processing', 'processed', 'label', 'options', 'properties', 'specs',
		'hidden', 'identifier', 'queryValue', 'dependentOn', 'callbacks',
		'selectedOptionLabel', 'notTrigger', 'autoSelectFirst', 'disabledOptions',
		'fieldsToSetParameters', 'queryTrafficParameters', 'tooltipData', 'opened',
		'isVisibleHeader', 'entries', 'rows', 'total', 'selectedItem', 'selectedDelete',
		'keys', 'dataHead', 'textEmpty', 'actions', 'currentPage', 'limitDepdentOnItems',
		'showSelect', 'itemTable', 'variant', 'toFixed', 'decimalsLimit',
		'isPercent', 'condition', 'parameter', 'color', 'template', 'control'
	];
	
	const filtered: any = {};
	
	for (const key in props) {
		if (invalidAttributes.includes(key)) {
			continue;
		}
		
		if (
			key.startsWith('on') ||
			key.startsWith('data-') ||
			key.startsWith('aria-') ||
			!invalidAttributes.includes(key)
		) {
			const validHtmlAttrs = [
				'name', 'value', 'onChange', 'onBlur', 'onFocus', 'onKeyDown', 'onKeyUp', 
				'onKeyPress', 'onClick', 'disabled', 'readOnly', 'required', 
				'type', 'id', 'autoFocus', 'tabIndex', 'title', 'style', 'form',
				'multiple', 'size'
			];
			
			if (validHtmlAttrs.includes(key) || key.startsWith('on') || key.startsWith('data-') || key.startsWith('aria-')) {
				filtered[key] = props[key];
			}
		}
	}
	
	return filtered;
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
	const { className, options = [], placeholder, ...rest } = props;
	const validHtmlAttributes = filterHtmlAttributes(rest);
	return (
		<select ref={ref} className={className} {...validHtmlAttributes}>
			{placeholder && <option value="">{placeholder}</option>}
			{options.map((option, index) => (
				<option key={index} value={option.value}>
					{option.label || option.value}
				</option>
			))}
		</select>
	);
});

Select.displayName = 'Select';

