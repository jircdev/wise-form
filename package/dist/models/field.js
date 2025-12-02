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
var _FormField_instances, _FormField_parent, _FormField_NATIVE_ACTIONS, _FormField_EVENTS, _FormField_isReady, _FormField_disabled, _FormField_specs, _FormField_value, _FormField_listeningItems, _FormField_listenSiblings, _FormField_executeEvent, _FormField_getEvent;
import { ReactiveModel } from '@beyond-js/reactive/model';
/**
 * Represents a single form field within a `FormModel` or `WrappedFormModel`, providing mechanisms for data binding, validation, and interaction.
 * This class extends `ReactiveModel` to enable reactive updates and interactions within the form's lifecycle.
 *
 * @extends ReactiveModel<IFormField>
 */
export class FormField extends ReactiveModel {
    get parent() {
        return __classPrivateFieldGet(this, _FormField_parent, "f");
    }
    setEvents(events) {
        __classPrivateFieldGet(this, _FormField_EVENTS, "f").concat(events);
    }
    /**
     * Evaluates and returns the disabled state of the field. If `#disabled` is an object, it checks the specified fields' values to determine the disabled state dynamically.
     * @returns {boolean} The disabled state of the field.
     */
    get disabled() {
        if (typeof __classPrivateFieldGet(this, _FormField_disabled, "f") !== 'object' || !__classPrivateFieldGet(this, _FormField_disabled, "f")?.fields)
            return __classPrivateFieldGet(this, _FormField_disabled, "f");
        const validate = (field) => {
            if (typeof field !== 'object')
                return !__classPrivateFieldGet(this, _FormField_parent, "f").form.getField(field).value;
            const { name, value } = field;
            const fieldInstance = __classPrivateFieldGet(this, _FormField_parent, "f").getField(name);
            if (!fieldInstance)
                return false;
            if (field.hasOwnProperty('condition')) {
                const compare = this.evaluations[field.condition](fieldInstance.value, field.value);
                return compare;
            }
            const { value: fieldValue } = fieldInstance;
            return value !== fieldValue;
        };
        return __classPrivateFieldGet(this, _FormField_disabled, "f").fields.some(validate);
    }
    set disabled(value) {
        if (value === __classPrivateFieldGet(this, _FormField_disabled, "f"))
            return;
        __classPrivateFieldSet(this, _FormField_disabled, value, "f");
        this.triggerEvent();
    }
    get specs() {
        return __classPrivateFieldGet(this, _FormField_specs, "f");
    }
    get attributes() {
        const props = this.getProperties();
        return {
            ...props,
            disabled: __classPrivateFieldGet(this, _FormField_disabled, "f"),
        };
    }
    get value() {
        return __classPrivateFieldGet(this, _FormField_value, "f");
    }
    set value(value) {
        this.setValue(value);
    }
    /**
     * Constructs a FormField instance with specified properties and parent form model.
     * @param {Object} params - Construction parameters including the parent form model and field specifications.
     */
    constructor({ parent, specs }) {
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
        _FormField_instances.add(this);
        // The parent model, either FormModel or WrappedFormModel, containing this field.
        _FormField_parent.set(this, void 0);
        _FormField_NATIVE_ACTIONS.set(this, ['hide', 'disable', 'enable', 'show', 'reset']);
        _FormField_EVENTS.set(this, ['onClick', 'onChange', 'onKeyup']);
        _FormField_isReady.set(this, false);
        // Can be a boolean or an object specifying dynamic disablingvas logic based on other fields' values.
        _FormField_disabled.set(this, false);
        // Field specifications including its type, validation rules, and other metadata.
        _FormField_specs.set(this, void 0);
        _FormField_value.set(this, void 0);
        // Tracks other fields this field listens to for changes, enabling reactive behavior and allowing the cleanup of event listeners.
        _FormField_listeningItems.set(this, new Map());
        this.generateRandomNumber = () => {
            return Math.floor(Math.random() * (1000000 - 10000 + 1)) + 10000;
        };
        /**
         * Performs initial setup based on the field's specifications, setting up validation, default values, and any specified dynamic behavior.
         */
        this.initialize = () => {
            this.checkSettings(__classPrivateFieldGet(this, _FormField_specs, "f"));
            this.on('change', this.listenerEvents);
            // this.on('value.change', this.listenerEvents);
        };
        /**
         * Resets the field to its initial value and state, including resetting the disabled state if it's statically defined.
         */
        this.clear = () => {
            // Get initial values from specs or use empty object
            const initValues = __classPrivateFieldGet(this, _FormField_specs, "f") || {};
            this.set(initValues);
            if (initValues.hasOwnProperty('disabled'))
                this.disabled = initValues.disabled;
            this.triggerEvent('clear');
        };
        /**
         * Listens to changes in sibling fields (specified in dynamic disabling logic) and updates its state accordingly.
         */
        _FormField_listenSiblings.set(this, () => {
            this.triggerEvent('change');
            this.triggerEvent();
            this.triggerEvent('value.change');
        });
        /**
         * Metodo para identificar si es field con multiples eventos configurados o solo es un evento configurado
         * hace la busqueda del evento lanzado al haber multiples
         * @returns
         */
        this.listenerEvents = (event2) => {
            if (!__classPrivateFieldGet(this, _FormField_isReady, "f")) {
                __classPrivateFieldSet(this, _FormField_isReady, true, "f");
                return;
            }
            if (!this.specs?.events) {
                const event = __classPrivateFieldGet(this, _FormField_instances, "m", _FormField_getEvent).call(this, this.specs);
                if (!event)
                    return;
                __classPrivateFieldGet(this, _FormField_instances, "m", _FormField_executeEvent).call(this, this.specs[event]);
                return;
            }
            const event = __classPrivateFieldGet(this, _FormField_instances, "m", _FormField_getEvent).call(this, this.specs.events);
            if (!event)
                return;
            const item = this.specs.events[event].hasOwnProperty(this.value)
                ? this.specs.events[event][this.value]
                : null;
            if (!item)
                return;
            __classPrivateFieldGet(this, _FormField_instances, "m", _FormField_executeEvent).call(this, item);
        };
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
                ? className.replace(/\bhidden\b/g, '').trim()
                : className;
            if (cls !== className)
                this.set({ className: cls });
        };
        this.evaluations = {
            equal: (value, comparisonValue) => value == comparisonValue,
            lower: (value, comparisonValue) => Number(value) < Number(comparisonValue),
            upper: (value, comparisonValue) => Number(value) > Number(comparisonValue),
            between: (value, [min, max]) => {
                const numValue = Number(value);
                return numValue >= Number(min) && numValue <= Number(max);
            },
            different: (value, comparisonValue) => value != comparisonValue,
            hasValue: (value) => ![undefined, null, '', false].includes(value),
            empty: (value) => [undefined, null, ''].includes(value),
            lessOrEqual: (value, comparisonValue) => Number(value) <= Number(comparisonValue),
            greaterOrEqual: (value, comparisonValue) => Number(value) >= Number(comparisonValue),
        };
        this.__instanceID = `${specs.name}.${this.generateRandomNumber()}`;
        __classPrivateFieldSet(this, _FormField_specs, specs, "f");
        __classPrivateFieldSet(this, _FormField_parent, parent, "f");
        this.__instance = Math.random();
        const toSet = {};
        /**
         * @todo:  review this code
         */
        Object.keys(props).forEach((key) => {
            if (key === 'properties')
                return;
            if (typeof props[key] === 'string' &&
                props[key]?.includes('state:')) {
                const state = props[key].split('state:')[1];
                if (state === 'create' && !__classPrivateFieldGet(this, _FormField_parent, "f").form.update) {
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
        return { ...properties, value: __classPrivateFieldGet(this, _FormField_value, "f") };
    }
    /**
     *  This method is used to set the value property of the field and fire the value.change event
     *
     * @param value
     * @returns
     */
    setValue(value) {
        if (value === this.value)
            return;
        __classPrivateFieldSet(this, _FormField_value, value, "f");
        this.trigger('change');
        this.trigger('value.change', this);
    }
    /**
     * Checks and applies the field's settings, particularly for dynamic disabling, establishing listeners on related fields as necessary.
     * @param {Object} props - The field's properties and settings to check and apply.
     */
    checkSettings(props) {
        if (props.hasOwnProperty('disabled')) {
            if (typeof props.disabled === 'boolean') {
                __classPrivateFieldSet(this, _FormField_disabled, props.disabled, "f");
                return;
            }
            if (typeof props.disabled !== 'object') {
                throw new Error(`The disabled property of the field ${props.name} must be a boolean or an object`);
            }
            if (!props.disabled.fields && !props.disabled.mode) {
                throw new Error(`The disabled property of the field ${props.name} must have a fields property or a mode defined`);
            }
            if (props.disabled.mode) {
                // posible modes : create, update;
                __classPrivateFieldSet(this, _FormField_disabled, __classPrivateFieldGet(this, _FormField_parent, "f").form.mode === props.disabled.mode, "f");
                return;
            }
            let allValid;
            props.disabled.fields.forEach((item) => {
                const name = typeof item === 'string' ? item : item.name;
                const instance = __classPrivateFieldGet(this, _FormField_parent, "f").form.getField(name);
                allValid = instance;
                if (!allValid)
                    return;
                instance.on('change', __classPrivateFieldGet(this, _FormField_listenSiblings, "f"));
                instance.on('value.change', __classPrivateFieldGet(this, _FormField_listenSiblings, "f"));
                __classPrivateFieldGet(this, _FormField_listeningItems, "f").set(name, {
                    item: instance,
                    listener: __classPrivateFieldGet(this, _FormField_listenSiblings, "f"),
                });
            });
            if (!allValid) {
                const fieldName = this.getProperties().name || 'unknown';
                throw new Error(`the field ${allValid} does not exist in the form ${__classPrivateFieldGet(this, _FormField_parent, "f").name}, field passed in invalid settings of field "${fieldName}"`);
            }
            __classPrivateFieldSet(this, _FormField_disabled, props.disabled, "f");
        }
    }
    /**
     * Cleans up any established listeners and internal state when the field is removed or the form is reset, ensuring no memory leaks or stale data.
     */
    cleanUp() {
        __classPrivateFieldGet(this, _FormField_listeningItems, "f").forEach(({ item, listener }) => item.off('change', listener));
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
    set(properties) {
        let updated = false;
        try {
            Object.keys(properties).forEach((prop) => {
                const currentProperties = Object.keys(this.getProperties());
                if (!currentProperties || !currentProperties.includes(prop))
                    return;
                const sameObject = typeof properties[prop] === 'object' &&
                    JSON.stringify(properties[prop]) ===
                        JSON.stringify(this[prop]);
                if (this[prop] === properties[prop] || sameObject)
                    return;
                const descriptor = Object.getOwnPropertyDescriptor(this, prop);
                if (descriptor?.set)
                    return;
                this[prop] = properties[prop];
                updated = true;
            });
        }
        catch (e) {
            console.error(`Error setting properties:`, e);
            throw new Error(`Error setting properties: ${e}`);
        }
        finally {
            if (updated)
                this.trigger('change', this);
        }
    }
}
_FormField_parent = new WeakMap(), _FormField_NATIVE_ACTIONS = new WeakMap(), _FormField_EVENTS = new WeakMap(), _FormField_isReady = new WeakMap(), _FormField_disabled = new WeakMap(), _FormField_specs = new WeakMap(), _FormField_value = new WeakMap(), _FormField_listeningItems = new WeakMap(), _FormField_listenSiblings = new WeakMap(), _FormField_instances = new WeakSet(), _FormField_executeEvent = 
/**
 * En este metodo se recorre el objeto asociado al evento y ejecuta cada una de las acciones asociadas
 * como las acciones nativas del FormModel (HIDE, SHOW, DISABLE, ENABLE), hace el seteo de propiedades
 * en caso de recibir field y ejecuta las callbacks asociadas
 * @param actions objeto  con las acciones que se van a realizar al ejecutarse el evento asociado
 * @returns
 */
async function _FormField_executeEvent(actions) {
    if (typeof actions !== 'object' || Array.isArray(actions))
        return;
    const formModel = __classPrivateFieldGet(this, _FormField_parent, "f").form;
    const sortedKeys = Object.keys(actions).sort((a, b) => actions[a]?.__order - actions[b]?.__order);
    for (let action of sortedKeys) {
        if (action === 'fields') {
            for (let fieldName in actions[action]) {
                const field = __classPrivateFieldGet(this, _FormField_parent, "f").form.getField(fieldName);
                if (!field)
                    continue;
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
        if (__classPrivateFieldGet(this, _FormField_NATIVE_ACTIONS, "f").includes(action) &&
            formModel.hasOwnProperty(action)) {
            formModel[action](actions[action].target);
        }
    }
}, _FormField_getEvent = function _FormField_getEvent(item) {
    let event;
    const keys = Object.keys(item);
    keys.forEach((key) => {
        if (event)
            return;
        if (__classPrivateFieldGet(this, _FormField_EVENTS, "f").includes(key))
            event = key;
    });
    return event;
};
//# sourceMappingURL=field.js.map