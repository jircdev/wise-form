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
var _FormModel_childWrappers, _FormModel_plugins, _FormModel_mode, _FormModel_update, _FormModel_callbackManagers, _FormModel_startup, _FormModel_checkReady, _FormModel_configFields, _FormModel_getFieldModel, _FormModel_listenDependencies, _FormModel_getWrapper;
import { FormField } from './field';
import { WrappedFormModel } from './wrapper';
import { BaseWiseModel } from './base';
import { PluginsManager } from './plugins';
import { CallbackManager } from './callback-manager';
export class FormModel extends BaseWiseModel {
    get plugins() {
        return __classPrivateFieldGet(this, _FormModel_plugins, "f");
    }
    /**
     * since the fields can be children of the model or a
     * wrapper, this method is used to get the form model
     */
    get form() {
        return this;
    }
    get mode() {
        return __classPrivateFieldGet(this, _FormModel_mode, "f");
    }
    get update() {
        return __classPrivateFieldGet(this, _FormModel_update, "f");
    }
    /**
     * Initializes a new instance of the `FormModel`, setting up the initial state, including field configurations,
     * callbacks, and reactive properties. This constructor also triggers the asynchronous setup process for the form.
     *
     * @param {Object} settings The configuration settings for the form, including fields, default values, and callbacks.
     * @param {Object} [reactiveProps] Optional reactive properties to enhance the form's reactivity.
     */
    constructor(settings, reactiveProps) {
        super(settings, reactiveProps);
        _FormModel_childWrappers.set(this, 0);
        _FormModel_plugins.set(this, void 0);
        _FormModel_mode.set(this, void 0);
        _FormModel_update.set(this, void 0);
        _FormModel_callbackManagers.set(this, void 0);
        _FormModel_startup.set(this, async (settings) => {
            const values = settings?.values || {};
            const createItems = item => {
                const instance = __classPrivateFieldGet(this, _FormModel_getFieldModel, "f").call(this, item, values);
                const onChange = () => {
                    // FormField has value, WrappedFormModel doesn't
                    if ('value' in instance) {
                        this[item.name] = instance.value;
                    }
                };
                instance.on('change', onChange);
                this.fields.set(item.name, instance);
            };
            this.settings.fields.map(createItems);
            await __classPrivateFieldGet(this, _FormModel_checkReady, "f").call(this);
            __classPrivateFieldGet(this, _FormModel_configFields, "f").call(this);
            // todo: @everyone Define if is required to wait for the plugins to be ready.
            __classPrivateFieldSet(this, _FormModel_plugins, new PluginsManager(this), "f");
            this.ready = true;
            this.specs = settings;
            this.trigger('change');
        });
        /**
         * Checks if all wrappers and fields within the form are loaded and sets the form to a loaded state. This method ensures that the form is fully operational before any interaction.
         * Its used for the start to listen the dependencies
         */
        _FormModel_checkReady.set(this, () => {
            const onReady = () => {
                const areAllWrappersLoaded = this.childWrappersReady === __classPrivateFieldGet(this, _FormModel_childWrappers, "f");
                if (!areAllWrappersLoaded) {
                    this.childWrappersReady = this.childWrappersReady + 1;
                    return;
                }
                this.loaded = true;
                this.loadedPromise.resolve(true);
                this.off('wrappers.children.loaded', onReady);
            };
            if (this.loaded)
                return this.loaded;
            if (!this.wrappers.size) {
                onReady();
                return this.loaded;
            }
            this.on('wrappers.children.loaded', onReady);
            return this.loadedPromise;
        });
        /**
         * Configures all fields by initializing them and setting up dependencies. This method ensures that each field is ready for interaction and that any field dependencies are respected.
         */
        _FormModel_configFields.set(this, () => {
            this.fields.forEach(__classPrivateFieldGet(this, _FormModel_listenDependencies, "f"));
            this.fields.forEach(field => field.initialize());
        });
        /**
         * Creates a new instance of a field or a wrapper based on the provided item configuration. It initializes the field or wrapper with specified values and properties.
         * @param {Object} item - The field or wrapper configuration.
         * @param {Object} values - The initial values for the fields.
         * @returns {FormField|WrappedFormModel} A new field or wrapper instance.
         */
        _FormModel_getFieldModel.set(this, (item, values) => {
            let externalValues = {};
            // @todo: @veD-tnayrB: Review this code and document it
            if (Array.isArray(item?.properties)) {
                item?.properties.forEach(item => (externalValues[item.name] = item.value));
            }
            if (item.type === 'wrapper')
                return __classPrivateFieldGet(this, _FormModel_getWrapper, "f").call(this, item);
            const instance = new FormField({
                parent: this,
                specs: {
                    ...item,
                    value: values[item.name] || item?.value,
                    properties: item?.properties || [],
                },
            });
            /**
             * @todo: review it. why we need it.?
             */
            if (item?.properties) {
                let toSet = {};
                item?.properties.forEach(property => (toSet[property] = item[property] || ''));
                instance.set(toSet);
            }
            return instance;
        });
        /**
         * Examines each field for dependencies and sets up listeners to respond to changes in dependent fields. This ensures dynamic interactions within the form based on field dependencies.
         * @param {FormField|WrappedFormModel} instance - The field or wrapper instance to check for dependencies.
         */
        _FormModel_listenDependencies.set(this, instance => {
            if (!instance?.specs?.dependentOn?.length)
                return;
            const manager = new CallbackManager(this, instance);
        });
        /**
         *
         * @param item
         * @param values
         * @returns
         */
        _FormModel_getWrapper.set(this, item => {
            let instance;
            if (!item.fields)
                throw new Error(`Wrapper ${item.name} must have fields property`);
            const fieldsProperties = item.fields.map(item => item.name);
            const properties = [...fieldsProperties, ...(item?.properties || [])];
            const defaultValues = item.values || {};
            instance = new WrappedFormModel({
                parent: this,
                settings: { ...item, form: this },
                specs: { properties: properties || [], ...defaultValues },
            });
            let toSet = {};
            Object.keys(instance?.getProperties()).forEach(property => (toSet[property] = item[property] || ''));
            instance.set(toSet);
            this.registerWrapper(instance);
            __classPrivateFieldSet(this, _FormModel_childWrappers, __classPrivateFieldGet(this, _FormModel_childWrappers, "f") + 1, "f");
            return instance;
        });
        /**
         * Registers a wrapper model within the form model, allowing for nested form structures.
         * This method is crucial for managing complex forms where fields might be grouped into sections or wrappers.
         * @param {WrappedFormModel} wrapper - The wrapper instance to register.
         */
        this.registerWrapper = (wrapper) => {
            this.wrappers.set(wrapper.name, wrapper);
        };
        this.hide = (fields) => {
            fields.forEach(field => {
                const instance = this.getField(field);
                if (!instance)
                    throw new Error(`Field ${field} does not exist in form ${this.name}`);
                instance.hide();
            });
        };
        this.show = (fields) => {
            fields.forEach(field => {
                const instance = this.getField(field);
                if (!instance)
                    throw new Error(`Field ${field} does not exist in form ${this.name}`);
                instance.show();
            });
        };
        this.disable = (fields) => {
            fields.forEach(field => {
                const instance = this.getField(field);
                if (!instance)
                    throw new Error(`Field ${field} does not exist in form ${this.name}`);
                instance.disabled = true;
            });
        };
        this.enable = (fields) => {
            fields.forEach(field => {
                const instance = this.getField(field);
                if (!instance)
                    throw new Error(`Field ${field} does not exist in form ${this.name}`);
                instance.disabled = false;
            });
        };
        this.reset = (fields) => {
            fields.forEach(field => {
                const instance = this.getField(field);
                if (!instance)
                    throw new Error(`Field ${field} does not exist in form ${this.name}`);
                instance.clear();
            });
        };
        __classPrivateFieldGet(this, _FormModel_startup, "f").call(this, settings);
        if (!globalThis._wiseForms)
            globalThis._wiseForms = [];
        globalThis._wiseForms.push(this);
        __classPrivateFieldSet(this, _FormModel_update, settings.update, "f");
        __classPrivateFieldSet(this, _FormModel_mode, __classPrivateFieldGet(this, _FormModel_update, "f") ? 'update' : 'create', "f");
    }
    getForm() {
        return this;
    }
    getFormula(name) {
        if (!name)
            return null;
        const formulaPlugin = __classPrivateFieldGet(this, _FormModel_plugins, "f").instances.get("formula");
        if (!formulaPlugin || !formulaPlugin.formulas)
            return;
        const formula = formulaPlugin.formulas.get(name);
        if (!formula)
            return null;
        return formula;
    }
}
_FormModel_childWrappers = new WeakMap(), _FormModel_plugins = new WeakMap(), _FormModel_mode = new WeakMap(), _FormModel_update = new WeakMap(), _FormModel_callbackManagers = new WeakMap(), _FormModel_startup = new WeakMap(), _FormModel_checkReady = new WeakMap(), _FormModel_configFields = new WeakMap(), _FormModel_getFieldModel = new WeakMap(), _FormModel_listenDependencies = new WeakMap(), _FormModel_getWrapper = new WeakMap();
FormModel.create = settings => {
    const properties = settings.fields.map(item => item.name);
    const values = settings.values || {};
    const instance = new FormModel(settings, { ...properties, ...values });
    return instance;
};
//# sourceMappingURL=model.js.map