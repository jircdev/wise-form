import { FormField } from './field';
import type { FormModel } from './model';
import { IWrapperFormModelProps } from './types/wrapped-form-model-props';
import { CallbackManager } from './callback-manager';
import { BaseWiseModel } from './base';

export
class WrappedFormModel extends BaseWiseModel {
    get type() {
        return 'wrapper';
    }

    get control() {
        return this.settings.control;
    }

    #form: FormModel;
    get form() {
        return this.#form;
    }

    // Reference to the parent FormModel or WrappedFormModel.
    #parent: FormModel | WrappedFormModel;
    constructor({ parent, settings, specs }: IWrapperFormModelProps) {
        const { properties = [], ...props } = specs;
        super({
            ...props,
            properties: ['name', 'className', 'hidden', ...properties],
        } as any);

        this.#parent = parent;
        this.callbacks = this.#parent.callbacks;
        this.settings = settings;
        this.#form = this.settings.form;
        this.#startup(settings);
    }

    /**
     * Initializes the wrapper model by setting up its fields and nested wrappers according to the provided settings.
     * @param {Object} settings - The settings object defining fields and wrapper configurations.
     */
    #startup = async (settings) => {
        const values = settings.values || {};
        const createItems = (item) => {
            const instance = this.#getInstance(item, values);
            const onChange = () => {
                // FormField has value, WrappedFormModel doesn't
                if ('value' in instance) {
                    (this as any)[item.name] = (instance as FormField).value;
                }
                this.triggerEvent(); // Posible performance improvement.
            };
            instance.on('change', onChange);
            this.fields.set(item.name, instance);
        };
        this.settings.fields.map(createItems);

        await this.#checkReady();
        this.#parent.triggerEvent('wrappers.children.loaded');
        this.#configFields();
        this.ready = true;
        this.specs = settings;
        this.set(settings);
        this.#parent.triggerEvent('wrappers.children.loaded');
    };

    /**
     * Creates an instance of a FormField or WrappedFormModel based on the provided item configuration.
     *
     * @param {Object} item - The configuration object for the field or nested wrapper.
     * @param {Record<string, unknown>} values - Initial values for the fields.
     * @returns {WrappedFormModel | FormField} The created instance.
     */
    #getInstance = (item, values: Record<string, unknown>) => {
        let instance: WrappedFormModel | FormField;
        let externalValues: Record<string, any> = {};
        if (Array.isArray(item?.properties)) {
            item?.properties.forEach(
                (item) => (externalValues[item.name] = item.value)
            );
        }

        if (item.type === 'wrapper') {
            if (!item.fields)
                throw new Error(
                    `Wrapper ${item.name} must have fields property`
                );
            const fieldsProperties = item.fields.map((item) => item.name);
            const properties = [
                ...fieldsProperties,
                ...(item?.properties || []),
            ];
            const values = item.values || {};

            instance = new WrappedFormModel({
                parent: this,
                settings: { ...item, form: this.#form },
                specs: { properties: properties || [], ...values },
            });

            let toSet = {};
            Object.keys(instance?.getProperties()).forEach(
                (property) => (toSet[property] = item[property] || '')
            );
            instance.set(toSet);

            this.registerWrapper(instance);
            return instance;
        }

        instance = new FormField({
            parent: this.#form,
            specs: {
                ...item,
                value: values[item.name] || item?.value,
                properties: item?.properties || [],
            },
        });

        if (item?.properties) {
            let toSet = {};
            item?.properties.forEach(
                (property) => (toSet[property] = item[property] || '')
            );
            instance.set(toSet);
        }

        return instance;
    };

    /**
     * Retrieves a field or nested wrapper by name. Supports dot notation for accessing deeply nested fields.
     * @param {string} name - The name of the field or nested wrapper to retrieve.
     * @returns {FormField | WrappedFormModel | undefined} The requested instance, or undefined if not found.
     */
    getField(name: string) {
        if (!name)
            return console.warn(
                'You need to provide a name to get a field in form ',
                this.settings.name
            );

        if (!name.includes('.')) {
            let field = this.fields.get(name);

            if (!field) {
                this.wrappers.forEach((item) => {
                    const foundField = item.getField(name);
                    if (foundField) field = foundField;
                });
            }
            return field;
        }

        const [wrapperName, ...others] = name.split('.');
        const currentWrapper = this.wrappers.get(wrapperName);

        const otherWrapper = others.join('.');
        return currentWrapper.getField(otherWrapper);
    }

    /**
     * Checks whether all nested wrappers within this wrapper are loaded and sets the wrapper's state to loaded if so.
     */
    #checkReady = () => {
        const onReady = () => {
            const areAllWrappersLoaded =
                this.childWrappersReady === this.wrappers.size;

            if (!areAllWrappersLoaded)
                return (this.childWrappersReady = this.childWrappersReady + 1);
            this.loaded = true;
            this.#parent.triggerEvent('wrappers.children.loaded');
            this.loadedPromise.resolve(true);
            this.off('wrappers.children.loaded', onReady);
        };

        if (this.loaded) return this.loaded;
        if (!this.wrappers.size) {
            onReady();
            return this.loaded;
        }

        this.on('wrappers.children.loaded', onReady);
        return this.loadedPromise;
    };

    /**
     * Configures the fields within the wrapper, setting up any dependencies they might have.
     */
    #configFields = () => {
        this.fields.forEach(this.#listenDependencies);
    };

    /**
     * Initializes all fields within the wrapper, preparing them for user interaction. Its used to know when the fields can start to listen for events or dependencies
     */
    initialize = () => {
        this.fields.forEach((field) => field.initialize());
    };

    /**
     * Sets up dependency listeners for a field within the wrapper, allowing fields to react to changes in other fields.
     * @param {FormField | WrappedFormModel} instance - The field or nested wrapper instance to set dependencies for.
     */
    #listenDependencies = (instance) => {
        if (!instance?.specs?.dependentOn?.length) return;
        new CallbackManager(this.#form, instance);
    };

    /**
     * Registers a nested wrapper within this wrapper, adding it to the internal map of child wrappers.
     * @param {WrappedFormModel} wrapper - The child wrapper to register.
     */
    registerWrapper = (wrapper: WrappedFormModel) => {
        this.wrappers.set(wrapper.name, wrapper);
        this.#form.registerWrapper(wrapper);
    };

    cleanUp = this.clear;

    getForm() {
        return this.#parent;
    }

    hide = () => {
        const className = (this.getProperties() as any).className || '';
        const isHidden = className.includes('hidden');
        const cls = isHidden ? className : `${className} hidden`;
        if (cls !== className) this.set({ className: cls } as any);
    };

    show = () => {
        const className = (this.getProperties() as any).className || '';
        const isHidden = className.includes('hidden');
        const cls = isHidden
            ? className.replaceAll(/\bhidden\b/g, '').trim()
            : className;
        if (cls !== className) this.set({ className: cls } as any);
    };
}

