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
var _BaseWiseModel_settings, _BaseWiseModel_callbacks, _BaseWiseModel_initialValues, _BaseWiseModel_wrappers, _BaseWiseModel_fields, _BaseWiseModel_specs, _BaseWiseModel_params;
import { ReactiveModel } from '@beyond-js/reactive/model';
import { PendingPromise } from '../utils/pending-promise';
export class BaseWiseModel extends ReactiveModel {
    get settings() {
        return __classPrivateFieldGet(this, _BaseWiseModel_settings, "f");
    }
    set settings(value) {
        __classPrivateFieldSet(this, _BaseWiseModel_settings, value, "f");
    }
    get callbacks() {
        return __classPrivateFieldGet(this, _BaseWiseModel_callbacks, "f");
    }
    set callbacks(value) {
        __classPrivateFieldSet(this, _BaseWiseModel_callbacks, value, "f");
    }
    get originalValues() {
        return __classPrivateFieldGet(this, _BaseWiseModel_initialValues, "f");
    }
    get name() {
        return __classPrivateFieldGet(this, _BaseWiseModel_settings, "f").name;
    }
    get template() {
        return __classPrivateFieldGet(this, _BaseWiseModel_settings, "f").template;
    }
    get wrappers() {
        return __classPrivateFieldGet(this, _BaseWiseModel_wrappers, "f");
    }
    set wrappers(value) {
        __classPrivateFieldSet(this, _BaseWiseModel_wrappers, value, "f");
    }
    get fields() {
        return __classPrivateFieldGet(this, _BaseWiseModel_fields, "f");
    }
    get values() {
        const data = {};
        __classPrivateFieldGet(this, _BaseWiseModel_fields, "f").forEach((field, key) => {
            // FormField has value, WrappedFormModel doesn't
            if ('value' in field) {
                data[key] = field.value;
            }
        });
        return data;
    }
    get specs() {
        return __classPrivateFieldGet(this, _BaseWiseModel_specs, "f");
    }
    set specs(value) {
        __classPrivateFieldSet(this, _BaseWiseModel_specs, value, "f");
    }
    constructor(settings, reactiveProps) {
        super(settings);
        _BaseWiseModel_settings.set(this, void 0);
        _BaseWiseModel_callbacks.set(this, {});
        _BaseWiseModel_initialValues.set(this, {});
        _BaseWiseModel_wrappers.set(this, new Map());
        _BaseWiseModel_fields.set(this, new Map());
        _BaseWiseModel_specs.set(this, void 0);
        _BaseWiseModel_params.set(this, {});
        this.loadedPromise = new PendingPromise();
        this.childWrappersReady = 0;
        /**
         * Clears all fields within the wrapper, resetting their values to their initial state.
         */
        this.clear = () => {
            this.fields.forEach(field => field.clear());
            this.triggerEvent();
            this.triggerEvent('clear');
        };
        __classPrivateFieldSet(this, _BaseWiseModel_params, settings.params ?? {}, "f");
        __classPrivateFieldSet(this, _BaseWiseModel_settings, settings, "f");
        __classPrivateFieldSet(this, _BaseWiseModel_callbacks, settings.callbacks ?? {}, "f");
    }
    /**
     * Sets the value of a specified field within the wrapper. If the field exists, its value is updated.
     * @param {string} name - The name of the field to update.
     * @param {any} value - The new value for the field.
     */
    setField(name, value) {
        if (!this.getField(name)) {
            console.error('Field not found', name, this.settings.name, this.fields.keys());
            return;
        }
        const field = this.getField(this.getFieldName(name));
        field.setValue(value);
    }
    /**
     * Retrieves a field or nested wrapper by name. Supports dot notation for accessing deeply nested fields.
     * @param {string} name - The name of the field or nested wrapper to retrieve.
     * @returns {FormField | WrappedFormModel | undefined} The requested instance, or undefined if not found.
     */
    getField(name) {
        if (!name)
            return console.warn('You need to provide a name to get a field in form ', __classPrivateFieldGet(this, _BaseWiseModel_settings, "f").name);
        if (!name.includes('.')) {
            let field = __classPrivateFieldGet(this, _BaseWiseModel_fields, "f").get(name);
            if (!field) {
                __classPrivateFieldGet(this, _BaseWiseModel_wrappers, "f").forEach(item => {
                    const foundField = item.getField(name);
                    if (foundField)
                        field = foundField;
                });
            }
            return field;
        }
        const [wrapperName, ...others] = name.split('.');
        const currentWrapper = __classPrivateFieldGet(this, _BaseWiseModel_wrappers, "f").get(wrapperName);
        const otherWrapper = others.join('.');
        return currentWrapper.getField(otherWrapper);
    }
    /**
     * Extracts the field name from a FieldOrAlias type. The input can either be a string directly representing
     * the field name or an object where the key is the field name and the value is an alias.
     * This function returns the field name if it is a string, or the first key (field name) if it is an object,
     * assuming the object contains exactly one key-value pair.
     *
     * @param {FieldOrAlias} field - The field identifier which could be a string or an object with one key-value pair.
     * @returns {string} - The field name extracted from the input.
     * @throws {Error} - Throws an error if the input is an object that does not contain exactly one key.
     */
    getFieldName(field) {
        if (typeof field === 'object' && Object.keys(field).length !== 1) {
            throw new Error('Field object must contain exactly one key.');
        }
        if (typeof field === 'string') {
            return field;
        }
        return Object.keys(field)[0];
    }
    getParams(param) {
        return __classPrivateFieldGet(this, _BaseWiseModel_params, "f")[param];
    }
}
_BaseWiseModel_settings = new WeakMap(), _BaseWiseModel_callbacks = new WeakMap(), _BaseWiseModel_initialValues = new WeakMap(), _BaseWiseModel_wrappers = new WeakMap(), _BaseWiseModel_fields = new WeakMap(), _BaseWiseModel_specs = new WeakMap(), _BaseWiseModel_params = new WeakMap();
//# sourceMappingURL=base.js.map