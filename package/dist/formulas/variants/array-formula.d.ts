import { IComplexCondition } from '../types/formulas';
export declare class FormulaArray {
    #private;
    get formula(): string | IComplexCondition;
    get base(): string;
    get value(): any[];
    get name(): string;
    /**
     *  Represents the fields defined in the plugin settings
     */
    get fields(): string[];
    get conditions(): import("../types/formulas").IConditionalField | import("../types/formulas").IConditionalField[];
    get variables(): string[];
    constructor(parent: any, plugin: any, specs: any);
    initialize(): void;
    evaluate: (data: {
        formulas: any[];
        values: any;
    }) => {};
    calculate(): Promise<void>;
    private sanitizeData;
    private sanitizeValue;
}
//# sourceMappingURL=array-formula.d.ts.map