var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _RFSettings_types;
export class RFSettings {
    constructor() {
        _RFSettings_types.set(this, {});
    }
    get types() {
        return __classPrivateFieldGet(this, _RFSettings_types, "f");
    }
    setFields(specs) {
        __classPrivateFieldSet(this, _RFSettings_types, { ...__classPrivateFieldGet(this, _RFSettings_types, "f"), ...specs }, "f");
    }
}
_RFSettings_types = new WeakMap();
export const WFSettings = new RFSettings();
//# sourceMappingURL=index.js.map