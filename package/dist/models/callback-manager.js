var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CallbackManager_field, _CallbackManager_model, _CallbackManager_callbacks, _CallbackManager_listeners;
export class CallbackManager {
    constructor(model, field) {
        _CallbackManager_field.set(this, void 0);
        _CallbackManager_model.set(this, void 0);
        _CallbackManager_callbacks.set(this, []);
        _CallbackManager_listeners.set(this, []);
        this.executeCallback = async (settings) => {
            const params = {
                ...settings,
                form: __classPrivateFieldGet(this, _CallbackManager_model, "f"),
                field: __classPrivateFieldGet(this, _CallbackManager_field, "f"),
                settings,
            };
            if (!settings) {
                console.warn('the field does not have dependentOn settings');
            }
            const callback = __classPrivateFieldGet(this, _CallbackManager_callbacks, "f")[settings.callback];
            const dependency = __classPrivateFieldGet(this, _CallbackManager_model, "f").getField(__classPrivateFieldGet(this, _CallbackManager_model, "f").getFieldName(settings.field));
            await dependency.isReady;
            const fields = { [dependency.name]: dependency };
            if (settings.hasOwnProperty('fields')) {
                for (const field of settings.fields) {
                    const instance = __classPrivateFieldGet(this, _CallbackManager_model, "f").getField(__classPrivateFieldGet(this, _CallbackManager_model, "f").getFieldName(field));
                    if (instance)
                        await instance.isReady;
                    const propName = typeof field === 'string' ? field : field.alias;
                    fields[propName] = instance;
                }
                params.fields = fields;
            }
            params.dependency = dependency;
            //global wiseForm params
            if (settings.hasOwnProperty('params')) {
                const specs = {};
                settings.params.forEach((param) => {
                    if (!__classPrivateFieldGet(this, _CallbackManager_model, "f")?.getParams(param)) {
                        console.warn(`param ${param} is not registered in the form`);
                        return;
                    }
                    specs[param] = __classPrivateFieldGet(this, _CallbackManager_model, "f").getParams(param);
                });
                params.specs = specs;
            }
            callback(params);
        };
        __classPrivateFieldSet(this, _CallbackManager_field, field, "f");
        __classPrivateFieldSet(this, _CallbackManager_model, model, "f");
        __classPrivateFieldSet(this, _CallbackManager_callbacks, model.callbacks, "f");
        this.initialize();
    }
    initialize() {
        const instance = __classPrivateFieldGet(this, _CallbackManager_field, "f");
        const checkField = async (settings) => {
            const dependency = __classPrivateFieldGet(this, _CallbackManager_model, "f").getField(__classPrivateFieldGet(this, _CallbackManager_model, "f").getFieldName(settings.field));
            await dependency.isReady;
            const required = ['field', 'callback'];
            required.forEach((prop) => {
                if (!settings[prop])
                    throw new Error(`${settings?.field} is missing ${prop}`);
            });
            if (!dependency)
                throw new Error(`${settings?.field} is not a registered field`);
            if (!__classPrivateFieldGet(this, _CallbackManager_callbacks, "f")[settings.callback]) {
                throw new Error(`${settings.callback} is not  a registered callback ${settings.name}`);
            }
            // saved in listener array to be able to remove the listener if is required.
            const event = settings.event || 'value.change';
            const caller = () => this.executeCallback(settings);
            __classPrivateFieldGet(this, _CallbackManager_listeners, "f").push(caller);
            dependency.on(event, caller);
            //callback({ dependency, settings, field: instance, form: this });
        };
        instance?.specs?.dependentOn.forEach(checkField);
    }
}
_CallbackManager_field = new WeakMap(), _CallbackManager_model = new WeakMap(), _CallbackManager_callbacks = new WeakMap(), _CallbackManager_listeners = new WeakMap();
//# sourceMappingURL=callback-manager.js.map