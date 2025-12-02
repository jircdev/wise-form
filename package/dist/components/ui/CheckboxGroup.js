import React from 'react';
import { Checkbox } from './Checkbox';
export const CheckboxGroup = props => {
    const { name, value = [], onChange, disabled, options = [], className } = props;
    const handleChange = (optionValue) => {
        return (event) => {
            if (!onChange)
                return;
            const currentValues = Array.isArray(value) ? [...value] : [];
            const newValues = event.target.checked
                ? [...currentValues, optionValue]
                : currentValues.filter(v => v !== optionValue);
            // Create a synthetic event
            const syntheticEvent = {
                ...event,
                target: {
                    ...event.target,
                    name: name || '',
                    value: newValues,
                },
            };
            onChange(syntheticEvent);
        };
    };
    return (React.createElement("div", { className: className }, options.map((option, index) => {
        const optionValue = option.value;
        const changeHandler = handleChange(optionValue);
        const isChecked = Array.isArray(value) && value.includes(optionValue);
        return (React.createElement(Checkbox, { key: index, name: name, value: optionValue, checked: isChecked, onChange: changeHandler, disabled: disabled, label: option.label }));
    })));
};
CheckboxGroup.displayName = 'CheckboxGroup';
//# sourceMappingURL=CheckboxGroup.js.map