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
var _a, _WrappedFormModel_form, _WrappedFormModel_parent, _WrappedFormModel_startup, _WrappedFormModel_getInstance, _WrappedFormModel_checkReady, _WrappedFormModel_configFields, _WrappedFormModel_listenDependencies;
import { FormField } from './field';
import { CallbackManager } from './callback-manager';
import { BaseWiseModel } from './base';
export class WrappedFormModel extends BaseWiseModel {
    get type() {
        return 'wrapper';
    }
    get control() {
        return this.settings.control;
    }
    get form() {
        return __classPrivateFieldGet(this, _WrappedFormModel_form, "f");
    }
    constructor({ parent, settings, specs }) {
        const { properties = [], ...props } = specs;
        super({
            ...props,
            properties: ['name', 'className', 'hidden', ...properties],
        });
        _WrappedFormModel_form.set(this, void 0);
        // Reference to the parent FormModel or WrappedFormModel.
        _WrappedFormModel_parent.set(this, void 0);
        /**
         * Initializes the wrapper model by setting up its fields and nested wrappers according to the provided settings.
         * @param {Object} settings - The settings object defining fields and wrapper configurations.
         */
        _WrappedFormModel_startup.set(this, async (settings) => {
            const values = settings.values || {};
            const createItems = (item) => {
                const instance = __classPrivateFieldGet(this, _WrappedFormModel_getInstance, "f").call(this, item, values);
                const onChange = () => {
                    // FormField has value, WrappedFormModel doesn't
                    if ('value' in instance) {
                        this[item.name] = instance.value;
                    }
                    this.triggerEvent(); // Posible performance improvement.
                };
                instance.on('change', onChange);
                this.fields.set(item.name, instance);
            };
            this.settings.fields.map(createItems);
            await __classPrivateFieldGet(this, _WrappedFormModel_checkReady, "f").call(this);
            __classPrivateFieldGet(this, _WrappedFormModel_parent, "f").triggerEvent('wrappers.children.loaded');
            __classPrivateFieldGet(this, _WrappedFormModel_configFields, "f").call(this);
            this.ready = true;
            this.specs = settings;
            this.set(settings);
            __classPrivateFieldGet(this, _WrappedFormModel_parent, "f").triggerEvent('wrappers.children.loaded');
        });
        /**
         * Creates an instance of a FormField or WrappedFormModel based on the provided item configuration.
         *
         * @param {Object} item - The configuration object for the field or nested wrapper.
         * @param {Record<string, unknown>} values - Initial values for the fields.
         * @returns {WrappedFormModel | FormField} The created instance.
         */
        _WrappedFormModel_getInstance.set(this, (item, values) => {
            let instance;
            let externalValues = {};
            if (Array.isArray(item?.properties)) {
                item?.properties.forEach((item) => (externalValues[item.name] = item.value));
            }
            if (item.type === 'wrapper') {
                if (!item.fields)
                    throw new Error(`Wrapper ${item.name} must have fields property`);
                const fieldsProperties = item.fields.map((item) => item.name);
                const properties = [
                    ...fieldsProperties,
                    ...(item?.properties || []),
                ];
                const values = item.values || {};
                instance = new _a({
                    parent: this,
                    settings: { ...item, form: __classPrivateFieldGet(this, _WrappedFormModel_form, "f") },
                    specs: { properties: properties || [], ...values },
                });
                let toSet = {};
                Object.keys(instance?.getProperties()).forEach((property) => (toSet[property] = item[property] || ''));
                instance.set(toSet);
                this.registerWrapper(instance);
                return instance;
            }
            instance = new FormField({
                parent: __classPrivateFieldGet(this, _WrappedFormModel_form, "f"),
                specs: {
                    ...item,
                    value: values[item.name] || item?.value,
                    properties: item?.properties || [],
                },
            });
            if (item?.properties) {
                let toSet = {};
                item?.properties.forEach((property) => (toSet[property] = item[property] || ''));
                instance.set(toSet);
            }
            return instance;
        });
        /**
         * Checks whether all nested wrappers within this wrapper are loaded and sets the wrapper's state to loaded if so.
         */
        _WrappedFormModel_checkReady.set(this, () => {
            const onReady = () => {
                const areAllWrappersLoaded = this.childWrappersReady === this.wrappers.size;
                if (!areAllWrappersLoaded)
                    return (this.childWrappersReady = this.childWrappersReady + 1);
                this.loaded = true;
                __classPrivateFieldGet(this, _WrappedFormModel_parent, "f").triggerEvent('wrappers.children.loaded');
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
         * Configures the fields within the wrapper, setting up any dependencies they might have.
         */
        _WrappedFormModel_configFields.set(this, () => {
            this.fields.forEach(__classPrivateFieldGet(this, _WrappedFormModel_listenDependencies, "f"));
        });
        /**
         * Initializes all fields within the wrapper, preparing them for user interaction. Its used to know when the fields can start to listen for events or dependencies
         */
        this.initialize = () => {
            this.fields.forEach((field) => field.initialize());
        };
        /**
         * Sets up dependency listeners for a field within the wrapper, allowing fields to react to changes in other fields.
         * @param {FormField | WrappedFormModel} instance - The field or nested wrapper instance to set dependencies for.
         */
        _WrappedFormModel_listenDependencies.set(this, (instance) => {
            if (!instance?.specs?.dependentOn?.length)
                return;
            new CallbackManager(__classPrivateFieldGet(this, _WrappedFormModel_form, "f"), instance);
        });
        /**
         * Registers a nested wrapper within this wrapper, adding it to the internal map of child wrappers.
         * @param {WrappedFormModel} wrapper - The child wrapper to register.
         */
        this.registerWrapper = (wrapper) => {
            this.wrappers.set(wrapper.name, wrapper);
            __classPrivateFieldGet(this, _WrappedFormModel_form, "f").registerWrapper(wrapper);
        };
        this.cleanUp = this.clear;
        this.hide = () => {
            const className = this.getProperties().className || '';
            const isHidden = className.includes('hidden');
            const cls = isHidden ? className : `${className} hidden`;
            if (cls !== className)
                this.set({ className: cls });
        };
        this.show = () => {
            const className = this.getProperties().className || '';
            const isHidden = className.includes('hidden');
            const cls = isHidden
                ? className.replaceAll(/\bhidden\b/g, '').trim()
                : className;
            if (cls !== className)
                this.set({ className: cls });
        };
        __classPrivateFieldSet(this, _WrappedFormModel_parent, parent, "f");
        this.callbacks = __classPrivateFieldGet(this, _WrappedFormModel_parent, "f").callbacks;
        this.settings = settings;
        __classPrivateFieldSet(this, _WrappedFormModel_form, this.settings.form, "f");
        __classPrivateFieldGet(this, _WrappedFormModel_startup, "f").call(this, settings);
    }
    /**
     * Retrieves a field or nested wrapper by name. Supports dot notation for accessing deeply nested fields.
     * @param {string} name - The name of the field or nested wrapper to retrieve.
     * @returns {FormField | WrappedFormModel | undefined} The requested instance, or undefined if not found.
     */
    getField(name) {
        if (!name)
            return console.warn('You need to provide a name to get a field in form ', this.settings.name);
        if (!name.includes('.')) {
            let field = this.fields.get(name);
            if (!field) {
                this.wrappers.forEach((item) => {
                    const foundField = item.getField(name);
                    if (foundField)
                        field = foundField;
                });
            }
            return field;
        }
        const [wrapperName, ...others] = name.split('.');
        const currentWrapper = this.wrappers.get(wrapperName);
        const otherWrapper = others.join('.');
        return currentWrapper.getField(otherWrapper);
    }
    getForm() {
        return __classPrivateFieldGet(this, _WrappedFormModel_parent, "f");
    }
}
_a = WrappedFormModel, _WrappedFormModel_form = new WeakMap(), _WrappedFormModel_parent = new WeakMap(), _WrappedFormModel_startup = new WeakMap(), _WrappedFormModel_getInstance = new WeakMap(), _WrappedFormModel_checkReady = new WeakMap(), _WrappedFormModel_configFields = new WeakMap(), _WrappedFormModel_listenDependencies = new WeakMap();
//# sourceMappingURL=wrapper.js.map