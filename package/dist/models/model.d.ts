import { WrappedFormModel } from './wrapper';
import { BaseWiseModel } from './base';
import { PluginsManager } from './plugins';
export declare class FormModel extends BaseWiseModel {
    #private;
    get plugins(): PluginsManager;
    /**
     * since the fields can be children of the model or a
     * wrapper, this method is used to get the form model
     */
    get form(): this;
    get mode(): string;
    get update(): boolean;
    /**
     * Initializes a new instance of the `FormModel`, setting up the initial state, including field configurations,
     * callbacks, and reactive properties. This constructor also triggers the asynchronous setup process for the form.
     *
     * @param {Object} settings The configuration settings for the form, including fields, default values, and callbacks.
     * @param {Object} [reactiveProps] Optional reactive properties to enhance the form's reactivity.
     */
    constructor(settings: any, reactiveProps?: any);
    /**
     * Registers a wrapper model within the form model, allowing for nested form structures.
     * This method is crucial for managing complex forms where fields might be grouped into sections or wrappers.
     * @param {WrappedFormModel} wrapper - The wrapper instance to register.
     */
    registerWrapper: (wrapper: WrappedFormModel) => void;
    getForm(): this;
    hide: (fields: string[]) => void;
    show: (fields: string[]) => void;
    disable: (fields: string[]) => void;
    enable: (fields: string[]) => void;
    reset: (fields: string[]) => void;
    static create: (settings: any) => FormModel;
    getFormula(name: string): any;
}
//# sourceMappingURL=model.d.ts.map