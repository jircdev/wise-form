import type { FormModel } from '../model';
export interface IPluginFormSpecs {
    object: IPluginForm;
    property: string;
}
export interface IPluginForm {
    readonly ready: boolean;
    readonly name: string;
    formulas?: Map<string, any>;
    settings: (model: FormModel, specs: IPluginFormSpecs) => Promise<IPluginForm>;
    [key: string]: any;
}
//# sourceMappingURL=plugins.d.ts.map