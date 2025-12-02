import { ReactiveModel } from '@beyond-js/reactive/model';
import { Parser } from './helpers/parser';
import { Token } from './helpers/token';
import { IComplexCondition, FormulaFields } from './types/formulas';
type ParserData = {
    parser: Parser;
    tokens: Token[];
    [key: string]: any;
};
export declare class FormulaManager extends ReactiveModel<FormulaManager> {
    #private;
    get tokens(): Token[];
    get parser(): Parser;
    get formula(): string | IComplexCondition;
    get name(): string;
    get conditional(): boolean;
    get conditions(): import("./types/formulas").IConditionalField | import("./types/formulas").IConditionalField[];
    /**
     *  Represents the fields defined in the plugin settings
     */
    get fields(): string[];
    get parsedBase(): any;
    get type(): string;
    get base(): string;
    get variables(): string[];
    get value(): any;
    constructor(plugin: any, specs: any);
    initialize(): void;
    /**
     * Returns the models that are part of the formula
     * The models could be fields or formulas
     * @param variables
     * @returns
     */
    getModels(variables: FormulaFields): any[];
    private getType;
    processConditional(): void;
    calculate(): void;
    /**
     * Returns the parser for the formula, if the parser is already created it will return the memoized parser
     *
     *
     * The formula is tokenized and parsed to create a parser instance
     * the object returned contains the tokens, the parser and the formula
     * @param data Receives the formula to be parsed
     * @returns
     */
    getParser(data: any): ParserData;
    getParams(variables: string[]): Promise<{}>;
    /**
     * A form can have multiple formulas, this method will create an instance of the formula manager
     * and memoize it to avoid creating multiple instances of the same formula.
     * @param specs
     * @returns
     */
    static create(plugin: any, specs: any): Promise<FormulaManager>;
}
export {};
//# sourceMappingURL=index.d.ts.map