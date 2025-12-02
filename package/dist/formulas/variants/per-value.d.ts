import { IComplexCondition } from '../types/formulas';
export declare class FormulaPerValue {
    #private;
    get formula(): string | IComplexCondition;
    get value(): string | number;
    get name(): string;
    get observers(): string[];
    /**
     *  Represents the fields defined in the plugin settings
     */
    get fields(): string[];
    get conditions(): import("../types/formulas").IConditionalField | import("../types/formulas").IConditionalField[];
    constructor(parent: any, plugin: any, specs: any);
    initialize(): void;
    calculateAll(): void;
    listenConditionals(): void;
    calculate(field: any): Promise<void>;
    evaluate(value: any): any;
}
//# sourceMappingURL=per-value.d.ts.map