import React from 'react';
// Helper function to filter out non-HTML attributes
const filterHtmlAttributes = (props) => {
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
    const filtered = {};
    for (const key in props) {
        if (invalidAttributes.includes(key)) {
            continue;
        }
        if (key.startsWith('on') ||
            key.startsWith('data-') ||
            key.startsWith('aria-') ||
            !invalidAttributes.includes(key)) {
            const validHtmlAttrs = [
                'name', 'value', 'checked', 'onChange', 'onBlur', 'onFocus', 'onKeyDown',
                'onKeyUp', 'onKeyPress', 'onClick', 'disabled', 'readOnly', 'required',
                'type', 'id', 'autoFocus', 'tabIndex', 'title', 'style', 'form'
            ];
            if (validHtmlAttrs.includes(key) || key.startsWith('on') || key.startsWith('data-') || key.startsWith('aria-')) {
                filtered[key] = props[key];
            }
        }
    }
    return filtered;
};
export const Checkbox = React.forwardRef((props, ref) => {
    const { className, label, ...rest } = props;
    const validHtmlAttributes = filterHtmlAttributes(rest);
    return (React.createElement("label", null,
        React.createElement("input", { ref: ref, type: "checkbox", className: className, ...validHtmlAttributes }),
        label && React.createElement("span", null, label)));
});
Checkbox.displayName = 'Checkbox';
//# sourceMappingURL=Checkbox.js.map