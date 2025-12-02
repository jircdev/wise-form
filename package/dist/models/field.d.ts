import { ReactiveModel } from '@beyond-js/reactive/model';
import type { WrappedFormModel } from './wrapper';
import { FormModel } from './model';
import { IFormField, IFormFieldProps } from './types/form-field';
import { IDisabled } from './types/disabled';
/**
 * Represents a single form field within a `FormModel` or `WrappedFormModel`, providing mechanisms for data binding, validation, and interaction.
 * This class extends `ReactiveModel` to enable reactive updates and interactions within the form's lifecycle.
 *
 * @extends ReactiveModel<IFormField>
 */
export declare class FormField extends ReactiveModel<IFormField> {
    #private;
    get parent(): FormModel | WrappedFormModel;
    setEvents(events: string[]): void;
    /**
     * Evaluates and returns the disabled state of the field. If `#disabled` is an object, it checks the specified fields' values to determine the disabled state dynamically.
     * @returns {boolean} The disabled state of the field.
     */
    get disabled(): boolean | IDisabled;
    set disabled(value: boolean | IDisabled);
    get specs(): Record<string, any>;
    get attributes(): {
        disabled: boolean | IDisabled;
        value: string;
        name?: string;
        type?: string;
        placeholder?: string;
        required?: boolean;
        label?: string;
        variant?: string;
        hidden?: boolean;
        options?: Array<{
            value: any;
            label?: string;
            [key: string]: any;
        }>;
        className?: string;
        checked?: boolean;
        id?: string;
        icon?: string;
    };
    get value(): string;
    set value(value: string);
    /**
     * Constructs a FormField instance with specified properties and parent form model.
     * @param {Object} params - Construction parameters including the parent form model and field specifications.
     */
    constructor({ parent, specs }: {
        parent: any;
        specs: IFormFieldProps;
    });
    getProperties(): {
        value: string;
        name?: string;
        type?: string;
        placeholder?: string;
        required?: boolean;
        label?: string;
        variant?: string;
        disabled?: boolean;
        hidden?: boolean;
        options?: Array<{
            value: any;
            label?: string;
            [key: string]: any;
        }>;
        className?: string;
        checked?: boolean;
        id?: string;
        icon?: string;
    };
    /**
     *  This method is used to set the value property of the field and fire the value.change event
     *
     * @param value
     * @returns
     */
    setValue(value: string): void;
    generateRandomNumber: () => number;
    /**
     * Performs initial setup based on the field's specifications, setting up validation, default values, and any specified dynamic behavior.
     */
    initialize: () => void;
    /**
     * Resets the field to its initial value and state, including resetting the disabled state if it's statically defined.
     */
    clear: () => void;
    /**
     * Checks and applies the field's settings, particularly for dynamic disabling, establishing listeners on related fields as necessary.
     * @param {Object} props - The field's properties and settings to check and apply.
     */
    checkSettings(props: any): void;
    /**
     * Metodo para identificar si es field con multiples eventos configurados o solo es un evento configurado
     * hace la busqueda del evento lanzado al haber multiples
     * @returns
     */
    listenerEvents: (event2: any) => void;
    /**
     * Cleans up any established listeners and internal state when the field is removed or the form is reset, ensuring no memory leaks or stale data.
     */
    cleanUp(): void;
    /**
     * The `set` method sets one or more properties on the model.
     *
     *
     * This method overwrites the original reactiveModel set to pass the object as param
     * when the change event is fired.
     * Eventually this method will be removed and the original set method will be used, but
     * it requires an upgrade in the reactive model package.
     * @param {keyof ReactiveModelPublic<T>} property - The name of the property to set.
     * @param {*} value - The value to set the property to.
     * @returns {void}
     */
    set(properties: Partial<IFormField>): any;
    hide: () => void;
    show: () => void;
    private evaluations;
}
//# sourceMappingURL=field.d.ts.map