import React from "react";
import { useWiseFormContext } from "../../context";
import { RowFieldContainer } from "../rows/row-container";
export function Containers() {
    const { rows, model, template: { styles }, } = useWiseFormContext();
    const fields = [...model.fields.values()];
    return rows.map((num, index) => {
        const items = fields.splice(0, num[0]); // Type assertion needed due to TypeScript strictness
        return React.createElement(RowFieldContainer, { model: model, template: num, items: items, key: `rf-row--${index}.${num}`, styles: styles });
    });
}
//# sourceMappingURL=index.js.map