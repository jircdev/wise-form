import { IComplexCondition, IConditionalField } from "../types/formulas";
export declare class FormulaComparison {
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
    get observers(): string[];
    constructor(parent: any, plugin: any, specs: any);
    initialize(): void;
    start(): void;
    evaluate(): {
        name: any;
        value: any;
    };
    calculate(): Promise<number>;
    calculateUpper(models: any): any;
}
//# sourceMappingURL=comparison.d.ts.map