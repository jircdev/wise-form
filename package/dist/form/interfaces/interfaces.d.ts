import type { FormField, WrappedFormModel } from '@bgroup/wise-form/models';
export type WiseFormField = (FormField | WrappedFormModel)[];
export interface IWiseForm {
    name: string;
    template: string;
    fields: WiseFormField;
}
//# sourceMappingURL=interfaces.d.ts.map