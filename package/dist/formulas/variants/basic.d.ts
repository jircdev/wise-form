import { IComplexCondition, IConditionalField } from '../types/formulas';
export declare class FormulaBasic {
    #private;
    get formula(): string | IComplexCondition;
    get base(): string;
    get value(): string | number;
    get name(): string;
    /**
     *  Represents the fields defined in the plugin settings
     */
    get fields(): string[];
    get conditions(): IConditionalField | IConditionalField[];
    get variables(): string[];
    constructor(parent: any, plugin: any, specs: any);
    initialize(): void;
    calculate(): Promise<void>;
}
//# sourceMappingURL=basic.d.ts.map