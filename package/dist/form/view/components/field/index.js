import React from "react";
import { Input, Textarea } from "../../../../components/ui";
import { SelectionField } from "./selection";
import { ControlFieldContainer } from "./container";
import { useWiseFormContext } from "../../context";
import { useField } from "./use-field";
/**
 *
 * @param props.field WiseForm Json config
 * @param props.index Index of the field
 * @param props.model Field or Wrapper Model.
 * @returns
 */
export const Control = ({ field, index, model, hidden }) => {
    const { formTypes } = useWiseFormContext();
    const fieldItem = field; // Using any to access dynamic properties
    // Early return if field doesn't have a name (except for wrapper types and special types)
    const specialTypes = ['wrapper', 'hr', 'button'];
    const fieldType = fieldItem?.type;
    const fieldName = fieldItem?.name;
    if (!fieldName && !specialTypes.includes(fieldType)) {
        console.warn('You need to provide a name to get a field in form', model.name || 'unknown');
        return null;
    }
    const { attrs } = useField(model, fieldItem);
    // Estado reactivo para el valor de hidden del campo
    const [isHidden, setIsHidden] = React.useState(() => {
        if (hidden !== undefined)
            return hidden;
        if (!fieldName)
            return false;
        const fieldModel = model.getField(fieldName);
        if (fieldModel) {
            const properties = fieldModel.getProperties();
            return properties.hidden ?? false;
        }
        return fieldItem.hidden ?? false;
    });
    // Suscribirse a los cambios del modelo del campo
    React.useEffect(() => {
        if (!fieldName)
            return;
        const fieldModel = model.getField(fieldName);
        if (!fieldModel)
            return;
        const onChange = () => {
            const properties = fieldModel.getProperties();
            setIsHidden(properties.hidden ?? false);
        };
        fieldModel.on('change', onChange);
        return () => {
            fieldModel.off('change', onChange);
        };
    }, [model, fieldName]);
    if (isHidden)
        return null;
    const types = {
        ...{
            checkbox: SelectionField,
            radio: SelectionField,
            select: SelectionField,
            textarea: Textarea,
            text: Input,
            password: Input,
            default: Input,
        },
        ...formTypes,
    };
    const ControlComponent = types[fieldType] ?? types.default;
    // Merge field properties with attrs to ensure custom components receive all necessary props
    const fieldModel = fieldName ? model.getField(fieldName) : null;
    const fieldProperties = fieldModel ? fieldModel.getProperties() : {};
    // Also include original field item properties (like options, label, etc.)
    const fieldItemProps = { ...fieldItem };
    // Remove internal properties that shouldn't be passed to components
    delete fieldItemProps.name;
    delete fieldItemProps.type;
    // Filter out non-HTML attributes from fieldProperties to prevent React warnings
    const invalidAttributes = ['processing', 'processed', 'properties', 'specs', 'hidden', 'identifier'];
    const filteredFieldProperties = Object.keys(fieldProperties).reduce((acc, key) => {
        if (!invalidAttributes.includes(key)) {
            acc[key] = fieldProperties[key];
        }
        return acc;
    }, {});
    return (React.createElement(ControlFieldContainer, null,
        React.createElement(ControlComponent, { ...attrs, ...fieldItemProps, ...filteredFieldProperties })));
};
//# sourceMappingURL=index.js.map