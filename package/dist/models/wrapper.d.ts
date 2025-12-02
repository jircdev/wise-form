import type { FormModel } from './model';
import { IWrapperFormModelProps } from './types/wrapped-form-model-props';
import { BaseWiseModel } from './base';
export declare class WrappedFormModel extends BaseWiseModel {
    #private;
    get type(): string;
    get control(): any;
    get form(): FormModel;
    constructor({ parent, settings, specs }: IWrapperFormModelProps);
    /**
     * Retrieves a field or nested wrapper by name. Supports dot notation for accessing deeply nested fields.
     * @param {string} name - The name of the field or nested wrapper to retrieve.
     * @returns {FormField | WrappedFormModel | undefined} The requested instance, or undefined if not found.
     */
    getField(name: string): any;
    /**
     * Initializes all fields within the wrapper, preparing them for user interaction. Its used to know when the fields can start to listen for events or dependencies
     */
    initialize: () => void;
    /**
     * Registers a nested wrapper within this wrapper, adding it to the internal map of child wrappers.
     * @param {WrappedFormModel} wrapper - The child wrapper to register.
     */
    registerWrapper: (wrapper: WrappedFormModel) => void;
    cleanUp: () => void;
    getForm(): FormModel | WrappedFormModel;
    hide: () => void;
    show: () => void;
}
//# sourceMappingURL=wrapper.d.ts.map