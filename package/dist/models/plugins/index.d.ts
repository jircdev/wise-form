import { ReactiveModel } from '@beyond-js/reactive/model';
import { IPluginForm } from '../types/plugins';
export declare class PluginsManager extends ReactiveModel<PluginsManager> {
    #private;
    private static items;
    get instances(): Map<string, IPluginForm>;
    static formulas: Record<string, any>;
    constructor(model: any);
    private initialize;
}
//# sourceMappingURL=index.d.ts.map