import React from "react";
import { Control } from "../field";
import { FormSectionWrapper } from "./wrapper";
/**
 * Represents a container for form fields within a row, organizing them according to a specified grid style.
 * This component is used to group form fields dynamically based on the `template` property, allowing for
 * a flexible layout structure within the form. It supports wrapping fields in a div with a CSS grid layout
 * to align items as specified by the `template` and `styles` provided.
 *
 * @param {Object} props The properties passed to the RowFieldContainer component.
 * @param {[number, string]} props.template A tuple where the first element is the total number of fields in the row,
 * and the second element is a string representing the CSS grid template for the layout of these fields.
 * @param {WiseFormField[]} props.items An array of form field configurations that will be rendered within this row.
 * @param {any} [props.styles] Optional styles to be applied to the row container, allowing for further customization.
 * @param
 *
*/
export function RowFieldContainer({ template: [totalFields, gridStyle], items, styles, model }) {
    // Estado para rastrear los valores de hidden de cada campo de forma reactiva
    const [fieldHiddenStates, setFieldHiddenStates] = React.useState(() => {
        const initialStates = {};
        items.forEach((field) => {
            const fieldItem = field; // Using any to access dynamic properties
            const fieldName = fieldItem?.name;
            if (fieldName) {
                const fieldModel = model.getField(fieldName);
                if (fieldModel) {
                    const properties = fieldModel.getProperties();
                    initialStates[fieldName] = properties.hidden ?? false;
                }
                else {
                    initialStates[fieldName] = fieldItem.hidden ?? false;
                }
            }
        });
        return initialStates;
    });
    // Suscribirse a los cambios de cada campo
    React.useEffect(() => {
        const listeners = [];
        items.forEach((field) => {
            const fieldItem = field; // Using any to access dynamic properties
            const fieldName = fieldItem?.name;
            const fieldType = fieldItem?.type;
            if (!fieldName || fieldType === "wrapper")
                return;
            const fieldModel = model.getField(fieldName);
            if (!fieldModel)
                return;
            const onChange = () => {
                const properties = fieldModel.getProperties();
                setFieldHiddenStates((prev) => ({
                    ...prev,
                    [fieldName]: properties.hidden ?? false,
                }));
            };
            fieldModel.on('change', onChange);
            listeners.push(() => fieldModel.off('change', onChange));
        });
        return () => {
            listeners.forEach((cleanup) => cleanup());
        };
    }, [items, model]);
    let hidden = false;
    const output = items.reduce((acc, field, index) => {
        const fieldItem = field; // Using any to access dynamic properties
        const fieldType = fieldItem?.type;
        if (fieldType === "wrapper") {
            const fieldModel = model.getField(fieldItem?.name);
            const wrapperHidden = fieldModel ? fieldModel.getProperties().hidden ?? false : false;
            if (wrapperHidden)
                hidden = true;
            acc.push(React.createElement(FormSectionWrapper, { key: `rf-row__item--${index}`, data: fieldItem, model: model }));
            return acc;
        }
        const fieldName = fieldItem?.name;
        const isHidden = fieldName ? (fieldHiddenStates[fieldName] ?? fieldItem.hidden ?? false) : false;
        if (!isHidden) {
            acc.push(React.createElement(Control, { index: index, model: model, field: fieldItem, key: `rf-row__item--${index}`, hidden: isHidden }));
        }
        return acc;
    }, []);
    const attrs = { className: `rf-fields-container`, style: {} };
    attrs.style = { gridTemplateColumns: `${gridStyle}`, ...styles };
    if (hidden)
        return null;
    return React.createElement("div", { ...attrs }, output);
}
//# sourceMappingURL=row-container.js.map