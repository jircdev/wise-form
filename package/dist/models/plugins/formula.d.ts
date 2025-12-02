import type { FormModel } from '../model';
import { IPluginFormSpecs } from '../types/plugins';
import { FormulaManager } from '@bgroup/wise-form/formulas';
import { WiseFormPluginBase } from './base';
export declare class FormulaPlugin extends WiseFormPluginBase {
    #private;
    get form(): FormModel;
    get name(): string;
    get ready(): boolean;
    get formulas(): Map<string, any>;
    get value(): string | number;
    set value(v: string | number);
    constructor(form: FormModel, settings: IPluginFormSpecs);
    init(): Promise<void>;
    create(observer: any): Promise<FormulaManager>;
    static settings(model: any, settings: any): Promise<WiseFormPluginBase>;
}
//# sourceMappingURL=formula.d.ts.map