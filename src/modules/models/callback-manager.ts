import type {FormField} from "./field";
import type {FormModel} from "./model";
import {CallbackFunction, ICallbackProps} from "./types/callbacks";

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
		const checkField = settings => {
			const dependency = this.#model.getField(this.#model.getFieldName(settings.field));

			["field", "callback"].forEach(prop => {
				if (!settings[prop]) throw new Error(`${settings?.field} is missing ${prop}`);
			});

			if (!dependency) throw new Error(`${settings?.field} is not a registered field`);

			if (!this.#callbacks[settings.callback]) {
				throw new Error(`${settings.callback} is not  a registered callback ${settings.name}`);
			}

			// saved in listener array to be able to remove the listener if is required.

			const caller = () => this.executeCallback(settings);
			this.#listeners.push(caller);
			dependency.on("value.change", caller);

			//callback({ dependency, settings, field: instance, form: this });
		};

		instance?.specs?.dependentOn.forEach(checkField);
	}

	executeCallback = async settings => {
		const params: ICallbackProps = {form: this.#model, field: this.#field, url: settings.url};
		if (!settings) {
			console.warn("the field does not have dependentOn settings");
		}

		const callback: CallbackFunction = this.#callbacks[settings.callback];

		const dependency = this.#model.getField(this.#model.getFieldName(settings.field));
		const fields = {[dependency.name]: dependency.value};
		if (settings.hasOwnProperty("fields")) {
			settings.fields.forEach(field => {
				const instance = this.#model.getField(this.#model.getFieldName(field));
				const propName = typeof field === "string" ? field : field.alias;
				fields[propName] = instance.value;
			});
			params.fields = fields;
		}

		//global wiseForm params
		if (settings.hasOwnProperty("params")) {
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
		callback(params);
	};
}
