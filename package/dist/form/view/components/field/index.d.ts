import React from "react";
import type { FormModel, WrappedFormModel, FormField } from "../../../../models";
type WiseFormFieldControlProps = {
    field: FormField | WrappedFormModel;
    index: number;
    model: FormModel | WrappedFormModel;
    hidden?: boolean;
};
/**
 *
 * @param props.field WiseForm Json config
 * @param props.index Index of the field
 * @param props.model Field or Wrapper Model.
 * @returns
 */
export declare const Control: ({ field, index, model, hidden }: WiseFormFieldControlProps) => React.JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map