import type { FormModel } from '@bgroup/wise-form/models';
import { IFormSettings } from './settings';
export interface IWiseFormSpecs {
    children?: React.ReactNode;
    settings?: IFormSettings;
    model?: FormModel;
    types?: Record<string, React.ReactNode>;
}
//# sourceMappingURL=wise-form-specs.d.ts.map