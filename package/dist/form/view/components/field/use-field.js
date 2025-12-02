import React from 'react';
import { useWiseFormContext } from '../../context';
export function useField(model, field) {
    // Early return if field doesn't have a name
    if (!field?.name) {
        return { attrs: {} };
    }
    const fieldModel = model.getField(field.name);
    const { values } = useWiseFormContext();
    const value = fieldModel?.value ?? values[field.name];
    const [attributes, setAttributes] = React.useState(fieldModel?.attributes || {});
    const onChange = field.name ? (event) => {
        if (event && event.target) {
            model.setField(field.name, event.target.value);
        }
    } : undefined;
    React.useEffect(() => {
        if (!fieldModel || !field.name)
            return;
        const onChange = () => {
            setAttributes({ ...fieldModel.attributes, disabled: fieldModel.disabled });
        };
        fieldModel.on('change', onChange);
        const cleanUp = () => {
            fieldModel.off('change', onChange);
            fieldModel.cleanUp();
        };
        return cleanUp;
    }, [fieldModel?.name, field.name]);
    /**
     * It's necessary to change the field spread.
     */
    const attrs = {
        value,
        ...attributes,
        ...(onChange && { onChange }),
        disabled: fieldModel?.disabled ?? false
    };
    return { attrs };
}
//# sourceMappingURL=use-field.js.map