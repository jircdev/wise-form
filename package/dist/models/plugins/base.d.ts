import { FormModel } from '../model';
import { IPluginFormSpecs } from '../types/plugins';
export declare abstract class WiseFormPluginBase {
    abstract readonly name: string;
    abstract readonly ready: boolean;
    abstract init(): Promise<void>;
    static settings?(model: FormModel, specs: IPluginFormSpecs): Promise<WiseFormPluginBase>;
}
//# sourceMappingURL=base.d.ts.map