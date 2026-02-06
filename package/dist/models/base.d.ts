import { ReactiveModel } from '@beyond-js/reactive/model';
import type { WrappedFormModel } from './wrapper';
import type { FormField } from './field';
import { PendingPromise } from '../utils/pending-promise';
import { FieldOrAlias } from './types/callbacks';
import { IFormModelProps } from './types/model';
import { IBaseWiseModel } from './types/base-wise-model';
export declare class BaseWiseModel extends ReactiveModel<IBaseWiseModel> {
    #private;
    get settings(): any;
    set settings(value: any);
    get callbacks(): Record<string, (...args: any[]) => void>;
    set callbacks(value: Record<string, (...args: any[]) => void>);
    get originalValues(): Record<string, string>;
    get name(): any;
    get template(): any;
    get wrappers(): Map<string, WrappedFormModel>;
    set wrappers(value: Map<string, WrappedFormModel>);
    get fields(): Map<string, WrappedFormModel | FormField>;
    get values(): Record<string, any>;
    get specs(): any;
    set specs(value: any);
    protected loadedPromise: PendingPromise<boolean>;
    protected childWrappersReady: number;
    constructor(settings: IFormModelProps, reactiveProps?: any);
    /**
     * Sets the value of a specified field within the wrapper. If the field exists, its value is updated.
     * @param {string} name - The name of the field to update.
     * @param {any} value - The new value for the field.
     */
    setField(name: string, value: any): void;
    /**
     * Retrieves a field or nested wrapper by name. Supports dot notation for accessing deeply nested fields.
     * @param {string} name - The name of the field or nested wrapper to retrieve.
     * @param {Set<BaseWiseModel | WrappedFormModel>} visited - Set of already visited models to prevent infinite recursion.
     * @returns {FormField | WrappedFormModel | undefined} The requested instance, or undefined if not found.
     */
    getField(name: string, visited?: Set<BaseWiseModel | WrappedFormModel>): any;
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
    getFieldName(field: FieldOrAlias): string;
    /**
     * Clears all fields within the wrapper, resetting their values to their initial state.
     */
    clear: () => void;
    getParams(param: any): any;
}
//# sourceMappingURL=base.d.ts.map