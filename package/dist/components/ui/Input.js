import React from 'react';
// Helper function to filter out non-HTML attributes
const filterHtmlAttributes = (props) => {
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
    const filtered = {};
    for (const key in props) {
        // Skip invalid attributes
        if (invalidAttributes.includes(key)) {
            continue;
        }
        // Keep valid HTML attributes, event handlers, and data/aria attributes
        if (key.startsWith('on') ||
            key.startsWith('data-') ||
            key.startsWith('aria-') ||
            !invalidAttributes.includes(key)) {
            // Only include if it's a valid HTML attribute or event handler
            const validHtmlAttrs = [
                'name', 'value', 'onChange', 'onBlur', 'onFocus', 'onKeyDown', 'onKeyUp',
                'onKeyPress', 'onClick', 'onDoubleClick', 'onMouseEnter', 'onMouseLeave',
                'disabled', 'readOnly', 'required', 'placeholder', 'type', 'id',
                'autoComplete', 'autoFocus', 'maxLength', 'minLength', 'pattern', 'step',
                'min', 'max', 'size', 'spellCheck', 'tabIndex', 'title', 'style',
                'accept', 'alt', 'checked', 'defaultValue', 'form', 'formAction',
                'formEncType', 'formMethod', 'formNoValidate', 'formTarget', 'height',
                'list', 'multiple', 'src', 'width'
            ];
            if (validHtmlAttrs.includes(key) || key.startsWith('on') || key.startsWith('data-') || key.startsWith('aria-')) {
                filtered[key] = props[key];
            }
        }
    }
    return filtered;
};
export const Input = React.forwardRef((props, ref) => {
    const { className, ...rest } = props;
    const validHtmlAttributes = filterHtmlAttributes(rest);
    return React.createElement("input", { ref: ref, className: className, ...validHtmlAttributes });
});
Input.displayName = 'Input';
//# sourceMappingURL=Input.js.map