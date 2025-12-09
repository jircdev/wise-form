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
export class FormField extends ReactiveModel<IFormField> {
    // The parent model, either FormModel or WrappedFormModel, containing this field.
    #parent: WrappedFormModel | FormModel;
    get parent() {
        return this.#parent;
    }

    #NATIVE_ACTIONS = ['hide', 'disable', 'enable', 'show', 'reset'];
    #EVENTS = ['onClick', 'onChange', 'onKeyup'];
    setEvents(events: string[]) {
        this.#EVENTS.concat(events);
    }
    #isReady: boolean = false;
    // Can be a boolean or an object specifying dynamic disablingvas logic based on other fields' values.
    #disabled: boolean | IDisabled = false;

    /**
     * Evaluates and returns the disabled state of the field. If `#disabled` is an object, it checks the specified fields' values to determine the disabled state dynamically.
     * @returns {boolean} The disabled state of the field.
     */
    get disabled() {
        if (typeof this.#disabled !== 'object' || !this.#disabled?.fields)
            return this.#disabled;

        const validate = (field) => {
            if (typeof field !== 'object')
                return !this.#parent.form.getField(field).value;
            const { name, value } = field;
            const fieldInstance = this.#parent.getField(name);
            if (!fieldInstance) return false;
            if (field.hasOwnProperty('condition')) {
                const compare = this.evaluations[field.condition](
                    fieldInstance.value,
                    field.value
                );
                return compare;
            }
            const { value: fieldValue } = fieldInstance;
            return value !== fieldValue;
        };

        return this.#disabled.fields.some(validate);
    }

    set disabled(value) {
        if (value === this.#disabled) return;
        this.#disabled = value;
        this.triggerEvent();
    }

    // Field specifications including its type, validation rules, and other metadata.
    #specs: Record<string, any>;
    get specs() {
        return this.#specs;
    }

    get attributes() {
        const props = this.getProperties();
        return {
            ...props,
            disabled: this.#disabled,
        };
    }

    #value: string;
    get value() {
        return this.#value;
    }

    set value(value) {
        this.setValue(value);
    }

    // Tracks other fields this field listens to for changes, enabling reactive behavior and allowing the cleanup of event listeners.
    #listeningItems = new Map();

    /**
     * Constructs a FormField instance with specified properties and parent form model.
     * @param {Object} params - Construction parameters including the parent form model and field specifications.
     */
    constructor({ parent, specs }: { parent; specs: IFormFieldProps }) {
        let { properties, disabled, ...props } = specs;
        super({
            ...props,
            properties: [
                'name',
                'type',
                'placeholder',
                'required',
                'label',
                'variant',
                'options',
                'className',
                'checked',
                'id',
                'icon',
                'hidden',

                ...properties,
            ],
        });

        (this as any).__instanceID = `${
            specs.name
        }.${this.generateRandomNumber()}`;

        this.#specs = specs;
        this.#parent = parent;
        (this as any).__instance = Math.random();

        const toSet: Record<string, any> = {};
        /**
         * @todo:  review this code
         */
        Object.keys(props).forEach((key) => {
            if (key === 'properties') return;

            if (
                typeof props[key] === 'string' &&
                props[key]?.includes('state:')
            ) {
                const state = props[key].split('state:')[1];
                if (state === 'create' && !this.#parent.form.update) {
                    props[key] = true;
                }
            }
            toSet[key] = props[key];
        });
        // this.#disabled = disabled;
        // this.set(toSet);

        this.set(specs);
    }

    getProperties() {
        const properties = super.getProperties();
        return { ...properties, value: this.#value };
    }

    /**
     *  This method is used to set the value property of the field and fire the value.change event
     *
     * @param value
     * @returns
     */
    setValue(value: string) {
        if (value === this.value) return;
        this.#value = value;
        this.trigger('change');
        this.trigger('value.change', this);
    }

    generateRandomNumber = () => {
        return Math.floor(Math.random() * (1000000 - 10000 + 1)) + 10000;
    };

    /**
     * Performs initial setup based on the field's specifications, setting up validation, default values, and any specified dynamic behavior.
     */
    initialize = () => {
        this.checkSettings(this.#specs);
        this.on('change', this.listenerEvents);
        // this.on('value.change', this.listenerEvents);
    };

    /**
     * Resets the field to its initial value and state, including resetting the disabled state if it's statically defined.
     */
    clear = () => {
        // Get initial values from specs or use empty object
        const initValues = this.#specs || {};
        this.set(initValues);
        if (initValues.hasOwnProperty('disabled'))
            this.disabled = initValues.disabled;
        this.triggerEvent('clear');
    };

    /**
     * Listens to changes in sibling fields (specified in dynamic disabling logic) and updates its state accordingly.
     */
    #listenSiblings = () => {
        this.triggerEvent('change');
        this.triggerEvent();
        this.triggerEvent('value.change');
    };

    /**
     * Checks and applies the field's settings, particularly for dynamic disabling, establishing listeners on related fields as necessary.
     * @param {Object} props - The field's properties and settings to check and apply.
     */
    checkSettings(props) {
        if (props.hasOwnProperty('disabled')) {
            if (typeof props.disabled === 'boolean') {
                this.#disabled = props.disabled;
                return;
            }

            if (typeof props.disabled !== 'object') {
                throw new Error(
                    `The disabled property of the field ${props.name} must be a boolean or an object`
                );
            }
            if (!props.disabled.fields && !props.disabled.mode) {
                throw new Error(
                    `The disabled property of the field ${props.name} must have a fields property or a mode defined`
                );
            }

            if (props.disabled.mode) {
                // posible modes : create, update;
                this.#disabled = this.#parent.form.mode === props.disabled.mode;
                return;
            }

            let allValid;
            props.disabled.fields.forEach((item) => {
                const name = typeof item === 'string' ? item : item.name;

                const instance = this.#parent.form.getField(name);
                allValid = instance;
                if (!allValid) return;
                instance.on('change', this.#listenSiblings);
                instance.on('value.change', this.#listenSiblings);
                this.#listeningItems.set(name, {
                    item: instance,
                    listener: this.#listenSiblings,
                });
            });

            if (!allValid) {
                const fieldName = this.getProperties().name || 'unknown';
                throw new Error(
                    `the field ${allValid} does not exist in the form ${
                        (this.#parent as any).name
                    }, field passed in invalid settings of field "${fieldName}"`
                );
            }
            this.#disabled = props.disabled;
        }
    }

    /**
     * En este metodo se recorre el objeto asociado al evento y ejecuta cada una de las acciones asociadas
     * como las acciones nativas del FormModel (HIDE, SHOW, DISABLE, ENABLE), hace el seteo de propiedades
     * en caso de recibir field y ejecuta las callbacks asociadas
     * @param actions objeto  con las acciones que se van a realizar al ejecutarse el evento asociado
     * @returns
     */
    async #executeEvent(actions) {
        if (typeof actions !== 'object' || Array.isArray(actions)) return;

        const formModel = this.#parent.form;

        const sortedKeys = Object.keys(actions).sort(
            (a, b) => actions[a]?.__order - actions[b]?.__order
        );

        for (let action of sortedKeys) {
            if (action === 'fields') {
                for (let fieldName in actions[action]) {
                    const field = this.#parent.form.getField(fieldName);

                    if (!field) continue;
                    await field.isReady;
                    field.set(actions[action][fieldName]);
                }
                continue;
            }
            if (formModel.callbacks.hasOwnProperty(action)) {
                formModel.callbacks[action]({
                    ...actions[action],
                    form: formModel,
                });
                continue;
            }

            if (
                this.#NATIVE_ACTIONS.includes(action) &&
                formModel.hasOwnProperty(action)
            ) {
                formModel[action](actions[action].target);
            }
        }
    }

    /**
     * Busca el evento configurado en el field
     * @param item objeto que tiene el evento
     * @returns
     */
    #getEvent(item) {
        let event: string;
        const keys = Object.keys(item);
        keys.forEach((key) => {
            if (event) return;
            if (this.#EVENTS.includes(key)) event = key;
        });
        return event;
    }

    /**
     * Metodo para identificar si es field con multiples eventos configurados o solo es un evento configurado
     * hace la busqueda del evento lanzado al haber multiples
     * @returns
     */
    listenerEvents = (event2) => {
        if (!this.#isReady) {
            this.#isReady = true;
            return;
        }

        if (!this.specs?.events) {
            const event = this.#getEvent(this.specs);
            if (!event) return;
            this.#executeEvent(this.specs[event]);
            return;
        }

        const event = this.#getEvent(this.specs.events);
        if (!event) return;
        const item = this.specs.events[event].hasOwnProperty(this.value)
            ? this.specs.events[event][this.value]
            : null;
        if (!item) return;
        this.#executeEvent(item);
    };

    /**
     * Cleans up any established listeners and internal state when the field is removed or the form is reset, ensuring no memory leaks or stale data.
     */
    cleanUp() {
        this.#listeningItems.forEach(({ item, listener }) =>
            item.off('change', listener)
        );
        // todo: remove all events
    }

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
    set(properties: Partial<IFormField>): any {
        let updated = false;
        try {
            Object.keys(properties).forEach((prop) => {
                const currentProperties = Object.keys(this.getProperties());

                // Verificar si la propiedad está registrada en el modelo reactivo
                // Si no está en getProperties(), verificar si está en la lista de properties del constructor
                const isRegisteredProperty =
                    currentProperties.includes(prop) ||
                    (this.#specs?.properties &&
                        this.#specs.properties.includes(prop));

                if (!isRegisteredProperty) {
                    return;
                }

                const newValue = properties[prop];
                const currentValue = this[prop];

                // Si los valores son iguales por referencia, no actualizar
                if (currentValue === newValue) return;

                // Si ambos son arrays y tienen la misma referencia, no actualizar
                if (
                    Array.isArray(currentValue) &&
                    Array.isArray(newValue) &&
                    currentValue === newValue
                ) {
                    return;
                }

                // Si el tipo cambia (array a string, string a array, etc.), siempre actualizar
                const currentIsArray = Array.isArray(currentValue);
                const newIsArray = Array.isArray(newValue);
                const currentIsObject =
                    typeof currentValue === 'object' &&
                    currentValue !== null &&
                    !currentIsArray;
                const newIsObject =
                    typeof newValue === 'object' &&
                    newValue !== null &&
                    !newIsArray;

                if (
                    (currentIsArray && !newIsArray) ||
                    (!currentIsArray && newIsArray) ||
                    (currentIsObject && !newIsObject) ||
                    (!currentIsObject && newIsObject)
                ) {
                    this[prop] = newValue;
                    updated = true;
                    return;
                }

                // Para arrays y objetos, hacer comparación más robusta
                if (typeof newValue === 'object' && newValue !== null) {
                    // Si currentValue es undefined/null, siempre actualizar
                    if (currentValue === undefined || currentValue === null) {
                        this[prop] = newValue;
                        updated = true;
                        return;
                    }

                    // Comparar arrays
                    if (newIsArray && currentIsArray) {
                        // Si las longitudes son diferentes, actualizar
                        if (newValue.length !== currentValue.length) {
                            this[prop] = newValue;
                            updated = true;
                            return;
                        }
                        // Si el array está vacío y ambos están vacíos, no actualizar
                        if (
                            newValue.length === 0 &&
                            currentValue.length === 0
                        ) {
                            return;
                        }
                        // Comparar contenido del array de forma más robusta
                        // Primero intentar comparación rápida por referencia de todo el array usando JSON.stringify
                        // Esto es más eficiente para detectar si el contenido es realmente diferente
                        try {
                            // Normalizar ambos arrays antes de comparar para evitar problemas con orden de propiedades
                            const normalizeForComparison = (arr: any[]) => {
                                return arr.map((item) => {
                                    if (
                                        typeof item === 'object' &&
                                        item !== null &&
                                        !Array.isArray(item)
                                    ) {
                                        // Ordenar propiedades del objeto para comparación estable
                                        const sorted = Object.keys(item)
                                            .sort()
                                            .reduce((acc, key) => {
                                                acc[key] = item[key];
                                                return acc;
                                            }, {} as any);
                                        return sorted;
                                    }
                                    return item;
                                });
                            };

                            const normalizedCurrent =
                                normalizeForComparison(currentValue);
                            const normalizedNew =
                                normalizeForComparison(newValue);

                            const currentStr =
                                JSON.stringify(normalizedCurrent);
                            const newStr = JSON.stringify(normalizedNew);

                            if (currentStr === newStr) {
                                // Si el contenido es igual, no actualizar para evitar bucles infinitos
                                return;
                            }
                        } catch (e) {
                            // Si JSON.stringify falla, hacer comparación elemento por elemento
                            let arraysEqual = true;
                            for (let idx = 0; idx < newValue.length; idx++) {
                                const newVal = newValue[idx];
                                const currentVal = currentValue[idx];

                                // Comparación por referencia primero (más rápida)
                                if (newVal === currentVal) continue;

                                // Si son objetos, comparar con JSON.stringify
                                if (
                                    typeof newVal === 'object' &&
                                    newVal !== null &&
                                    typeof currentVal === 'object' &&
                                    currentVal !== null
                                ) {
                                    try {
                                        const newStr = JSON.stringify(newVal);
                                        const currentStr =
                                            JSON.stringify(currentVal);
                                        if (newStr !== currentStr) {
                                            arraysEqual = false;
                                            break;
                                        }
                                    } catch (e) {
                                        // Si JSON.stringify falla, comparar por referencia
                                        if (newVal !== currentVal) {
                                            arraysEqual = false;
                                            break;
                                        }
                                    }
                                } else {
                                    // Para valores primitivos, comparación directa
                                    if (newVal !== currentVal) {
                                        arraysEqual = false;
                                        break;
                                    }
                                }
                            }
                            if (arraysEqual) return;
                        }
                        this[prop] = newValue;
                        updated = true;
                        return;
                    }

                    // Para objetos, comparar con JSON.stringify pero manejar undefined
                    if (newIsObject && currentIsObject) {
                        try {
                            const currentStr = JSON.stringify(currentValue);
                            const newStr = JSON.stringify(newValue);
                            if (currentStr === newStr) return;
                        } catch (e) {
                            // Si JSON.stringify falla (por ejemplo, con funciones), comparar por referencia
                            if (currentValue === newValue) return;
                        }
                    }
                }

                const descriptor = Object.getOwnPropertyDescriptor(this, prop);

                if (descriptor?.set) return;
                this[prop] = newValue;
                updated = true;
            });
        } catch (e) {
            console.error(`Error setting properties:`, e);
            throw new Error(`Error setting properties: ${e}`);
        } finally {
            if (updated) this.trigger('change', this);
        }
    }

    hide = () => {
        const className = this.getProperties().className || '';
        const isHidden = className.includes('hidden');
        const cls = isHidden ? className : `${className} hidden`;
        if (cls !== className) this.set({ className: cls });
    };

    show = () => {
        const className = this.getProperties().className || '';
        const isHidden = className.includes('hidden');
        const cls = isHidden
            ? className.replace(/\bhidden\b/g, '').trim()
            : className;
        if (cls !== className) this.set({ className: cls });
    };

    private evaluations: Record<
        string,
        (value: any, comparisonValue?: any) => boolean
    > = {
        equal: (value, comparisonValue) => value == comparisonValue,
        lower: (value, comparisonValue) =>
            Number(value) < Number(comparisonValue),
        upper: (value, comparisonValue) =>
            Number(value) > Number(comparisonValue),
        between: (value, [min, max]) => {
            const numValue = Number(value);
            return numValue >= Number(min) && numValue <= Number(max);
        },
        different: (value, comparisonValue) => value != comparisonValue,
        hasValue: (value) => ![undefined, null, '', false].includes(value),
        empty: (value) => [undefined, null, ''].includes(value),
        lessOrEqual: (value, comparisonValue) =>
            Number(value) <= Number(comparisonValue),
        greaterOrEqual: (value, comparisonValue) =>
            Number(value) >= Number(comparisonValue),
    };
}
