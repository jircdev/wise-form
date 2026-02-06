import type { FormField } from './field';
import type { FormModel } from './model';
import { CallbackFunction, ICallbackProps } from './types/callbacks';

/**
 * Maximum number of recursive executions allowed for a callback before preventing further execution.
 * This can be overridden if specific use cases require a higher limit.
 */
export const MAX_CALLBACK_RECURSION_DEPTH = 3;

/**
 * Map to track callback execution depth per unique execution context.
 * Key format: "callbackName:fieldName:dependencyName" or "callbackName:fieldName" if no dependency
 */
const callbackExecutionDepth = new Map<string, number>();

/**
 * Set to track callbacks currently executing (prevents concurrent executions of the same callback)
 */
const currentlyExecutingCallbacks = new Set<string>();

export class CallbackManager {
  #field: FormField;
  #model: FormModel;
  #callbacks: CallbackFunction[] = [];
  #listeners = [];
  constructor(model, field) {
    this.#field = field;
    this.#model = model;
    this.#callbacks = model.callbacks;
    this.initialize();
  }

  initialize() {
    const instance = this.#field;
    const checkField = async (settings, index) => {
      const dependency = this.#model.getField(this.#model.getFieldName(settings.field));
      await dependency.isReady;
      const required = ['field', 'callback'];
      required.forEach(prop => {
        if (!settings[prop]) throw new Error(`${settings?.field} is missing ${prop}`);
      });

      if (!dependency) throw new Error(`${settings?.field} is not a registered field`);

      if (!this.#callbacks[settings.callback]) {
        throw new Error(`${settings.callback} is not  a registered callback ${settings.name}`);
      }

      // Asignar un ID único a cada configuración de callback para tracking individual
      if (!settings.__callbackId) {
        const instanceName = (instance as any).name || 'unknown';
        settings.__callbackId = `${instanceName}_${settings.callback}_${settings.field}_${index}_${Date.now()}`;
      }

      // saved in listener array to be able to remove the listener if is required.
      const event = settings.event || 'value.change';
      const caller = () => this.executeCallback(settings);
      this.#listeners.push(caller);
      dependency.on(event, caller);

      //callback({ dependency, settings, field: instance, form: this });
    };

    instance?.specs?.dependentOn.forEach(checkField);
  }

  /**
   * Generates a unique execution key for tracking callback recursion.
   * Uses the unique __callbackId from settings if available, otherwise falls back to name-based key.
   */
  #getExecutionKey(settings: any, fieldName: string): string {
    // Si el settings tiene un __callbackId único, usarlo para permitir múltiples callbacks del mismo tipo
    if (settings?.__callbackId) {
      return settings.__callbackId;
    }
    // Fallback para compatibilidad con código legacy
    const callbackName = settings?.callback || 'unknown';
    const fieldNameStr = fieldName || 'unknown';
    const dependencyFieldName = typeof settings?.field === 'string' ? settings.field : settings?.field?.field || 'unknown';
    return `${callbackName}:${fieldNameStr}:${dependencyFieldName}`;
  }

  executeCallback = async settings => {
    if (!settings) {
      console.warn('the field does not have dependentOn settings');
      return;
    }

    const callbackName = settings.callback;
    if (!callbackName) {
      console.warn('[CallbackManager] executeCallback called without callback name in settings');
      return;
    }

    const fieldName = (this.#field as { name?: string })?.name || 'unknown';
    const dependencyFieldName = typeof settings.field === 'string' ? settings.field : settings.field?.field || 'unknown';

    const executionKey = this.#getExecutionKey(settings, fieldName);

    // Check if already executing (prevent concurrent executions)
    if (currentlyExecutingCallbacks.has(executionKey)) {
      console.warn(
        `[CallbackManager] Callback "${callbackName}" is already executing for field "${fieldName}" with dependency "${dependencyFieldName}". Skipping concurrent execution.`
      );
      return;
    }

    // Check recursion depth
    const currentDepth = callbackExecutionDepth.get(executionKey) || 0;
    const maxDepth = settings.maxRecursionDepth !== undefined ? settings.maxRecursionDepth : MAX_CALLBACK_RECURSION_DEPTH;

    if (currentDepth >= maxDepth) {
      console.error(
        `[CallbackManager] RECURSION DETECTED: Callback "${callbackName}" exceeded maximum recursion depth of ${maxDepth}`,
        `\n  Field: ${fieldName}`,
        `\n  Dependency: ${dependencyFieldName}`,
        `\n  Current depth: ${currentDepth + 1}`,
        `\n  Execution key: ${executionKey}`,
        `\n  Callback ID: ${settings?.__callbackId || 'N/A'}`,
        `\n  This indicates a circular dependency in callbacks. Please review the form configuration.`
      );
      return;
    }

    // Mark as currently executing and increment depth
    currentlyExecutingCallbacks.add(executionKey);
    callbackExecutionDepth.set(executionKey, currentDepth + 1);

    try {
      const params: ICallbackProps = {
        ...settings,
        form: this.#model,
        field: this.#field,
        settings,
      };

      const callback: CallbackFunction = this.#callbacks[callbackName];

      if (!callback) {
        console.error(`[CallbackManager] Callback "${callbackName}" not found in registered callbacks`);
        return;
      }

      const dependency = this.#model.getField(this.#model.getFieldName(settings.field));
      await dependency.isReady;
      const fields = { [dependency.name]: dependency };
      if (settings.hasOwnProperty('fields')) {
        for (const field of settings.fields) {
          const instance = this.#model.getField(this.#model.getFieldName(field));
          if (instance) await instance.isReady;
          const propName = typeof field === 'string' ? field : field.alias;
          fields[propName] = instance;
        }

        params.fields = fields;
      }
      params.dependency = dependency;

      //global wiseForm params
      if (settings.hasOwnProperty('params')) {
        const specs = {};
        settings.params.forEach(param => {
          if (!this.#model?.getParams(param)) {
            console.warn(`param ${param} is not registered in the form`);
            return;
          }

          specs[param] = this.#model.getParams(param);
        });
        params.specs = specs;
      }

      // Execute the callback (handle both sync and async callbacks)
      const result = callback(params) as any;
      if (result && typeof result.then === 'function') {
        await result;
      }
    } catch (error) {
      console.error(`[CallbackManager] Error executing callback "${callbackName}":`, error);
    } finally {
      // Clean up execution tracking
      currentlyExecutingCallbacks.delete(executionKey);

      const finalDepth = callbackExecutionDepth.get(executionKey) || 0;
      if (finalDepth <= 1) {
        callbackExecutionDepth.delete(executionKey);
      } else {
        callbackExecutionDepth.set(executionKey, finalDepth - 1);
      }
    }
  };
}
