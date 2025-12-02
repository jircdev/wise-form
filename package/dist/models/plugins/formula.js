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
var _FormulaPlugin_form, _FormulaPlugin_settings, _FormulaPlugin_formulas, _FormulaPlugin_value;
import { FormulaManager } from '@bgroup/wise-form/formulas';
import { WiseFormPluginBase } from './base';
// pensar porque no manejarlo con eventos.
export class FormulaPlugin extends WiseFormPluginBase {
    get form() {
        return __classPrivateFieldGet(this, _FormulaPlugin_form, "f");
    }
    get name() {
        return 'formula';
    }
    get ready() {
        return true;
    }
    get formulas() {
        return __classPrivateFieldGet(this, _FormulaPlugin_formulas, "f");
    }
    get value() {
        return __classPrivateFieldGet(this, _FormulaPlugin_value, "f");
    }
    set value(v) {
        if (v === __classPrivateFieldGet(this, _FormulaPlugin_value, "f"))
            return;
        __classPrivateFieldSet(this, _FormulaPlugin_value, v, "f");
    }
    constructor(form, settings) {
        super();
        _FormulaPlugin_form.set(this, void 0);
        _FormulaPlugin_settings.set(this, void 0);
        _FormulaPlugin_formulas.set(this, new Map());
        _FormulaPlugin_value.set(this, 0);
        __classPrivateFieldSet(this, _FormulaPlugin_form, form, "f");
        __classPrivateFieldSet(this, _FormulaPlugin_settings, settings, "f");
    }
    async init() {
        if (!__classPrivateFieldGet(this, _FormulaPlugin_form, "f").settings?.observers)
            return;
        const promises = __classPrivateFieldGet(this, _FormulaPlugin_form, "f").settings.observers.map(this.create.bind(this));
        const formulas = await Promise.all(promises);
        formulas.forEach(formula => {
            __classPrivateFieldGet(this, _FormulaPlugin_formulas, "f").set(formula.name, formula);
        });
        __classPrivateFieldGet(this, _FormulaPlugin_formulas, "f").forEach(formula => {
            if (!formula.initialize)
                console.log(-1, formula);
            formula.initialize();
        });
    }
    async create(observer) {
        const { formula } = observer;
        if (!observer.name) {
            throw new Error(`Observer in form "${__classPrivateFieldGet(this, _FormulaPlugin_form, "f").name}" must have a name`);
        }
        if (!formula) {
            throw new Error(`Observer ${observer.name} in form "${__classPrivateFieldGet(this, _FormulaPlugin_form, "f").name}" must have a formula`);
        }
        return FormulaManager.create(this, observer);
    }
    static async settings(model, settings) {
        try {
            const instance = new FormulaPlugin(model, settings);
            await instance.init();
            return instance;
        }
        catch (e) {
            console.error(e);
        }
    }
}
_FormulaPlugin_form = new WeakMap(), _FormulaPlugin_settings = new WeakMap(), _FormulaPlugin_formulas = new WeakMap(), _FormulaPlugin_value = new WeakMap();
//# sourceMappingURL=formula.js.map