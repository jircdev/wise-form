import type { FormModel } from '../model';
import type { WrappedFormModel } from '../wrapper';
export interface IWrapperFormModelProps {
    parent: FormModel | WrappedFormModel;
    settings: any;
    specs: {
        properties?: string[];
        [key: string]: any;
    };
}
//# sourceMappingURL=wrapped-form-model-props.d.ts.map