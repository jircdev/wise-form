import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	name?: string;
	value?: string | number;
	onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
	disabled?: boolean;
	placeholder?: string;
	className?: string;
	id?: string;
	[key: string]: any; // Allow additional props that will be filtered
}

// Helper function to filter out non-HTML attributes
const filterHtmlAttributes = (props: Record<string, any>): React.TextareaHTMLAttributes<HTMLTextAreaElement> => {
	const invalidAttributes = [
		'processing', 'processed', 'label', 'options', 'properties', 'specs',
		'hidden', 'identifier', 'queryValue', 'dependentOn', 'onChange', 'callbacks',
		'selectedOptionLabel', 'notTrigger', 'autoSelectFirst', 'disabledOptions',
		'fieldsToSetParameters', 'queryTrafficParameters', 'tooltipData', 'opened',
		'isVisibleHeader', 'entries', 'rows', 'total', 'selectedItem', 'selectedDelete',
		'keys', 'dataHead', 'textEmpty', 'actions', 'currentPage', 'limitDepdentOnItems',
		'showSelect', 'itemTable', 'className', 'variant', 'toFixed', 'decimalsLimit',
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
				'onKeyPress', 'onClick', 'disabled', 'readOnly', 'required', 'placeholder', 
				'type', 'id', 'autoComplete', 'autoFocus', 'maxLength', 'minLength', 
				'pattern', 'spellCheck', 'tabIndex', 'title', 'style', 'form', 'rows', 'cols'
			];
			
			if (validHtmlAttrs.includes(key) || key.startsWith('on') || key.startsWith('data-') || key.startsWith('aria-')) {
				filtered[key] = props[key];
			}
		}
	}
	
	return filtered;
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
	const { className, ...rest } = props;
	const validHtmlAttributes = filterHtmlAttributes(rest);
	return <textarea ref={ref} className={className} {...validHtmlAttributes} />;
});

Textarea.displayName = 'Textarea';

