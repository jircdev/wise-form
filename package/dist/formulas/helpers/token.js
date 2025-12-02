/**
 * The Token class now includes a stringValue property for storing the original string value
 * of the expression inside the parentheses and an optional parent property for storing the parent token.
 */
export class Token {
    constructor(type, value, stringValue, children, parent) {
        this.type = type;
        this.value = value;
        this.stringValue = stringValue;
        this.children = children;
        this.parent = parent;
    }
}
//# sourceMappingURL=token.js.map