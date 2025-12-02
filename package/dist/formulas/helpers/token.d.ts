import { TokenType } from '../types';
/**
 * The Token class now includes a stringValue property for storing the original string value
 * of the expression inside the parentheses and an optional parent property for storing the parent token.
 */
export declare class Token {
    type: TokenType;
    value: string;
    stringValue?: string;
    children?: Token[];
    parent?: Token;
    constructor(type: TokenType, value: string, stringValue?: string, children?: Token[], parent?: Token);
}
//# sourceMappingURL=token.d.ts.map