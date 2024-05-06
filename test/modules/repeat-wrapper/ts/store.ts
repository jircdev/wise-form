import type { IWidgetStore } from '@beyond-js/widgets/controller';
import { FormModel } from '@bgroup/wise-form/model';
import { ReactiveModel } from '@beyond-js/reactive/model';
import { WFSettings } from '@bgroup/wise-form/settings';
import { WrapperForm } from './views/wrapper';
export class StoreManager extends ReactiveModel<StoreManager> implements IWidgetStore {
	#form: FormModel;
	get form() {
		return this.#form;
	}

	get settings() {
		return {
			title: 'Example WiseForm',
			fields: [
				{
					type: 'fieldsWrapper',
					label: 'Custom Wrapper Field',
					key: 'customWrapper',
				},
			],
		};
	}

	constructor() {
		super();
		// this.load();
	}

	async load() {
		const form = await FormModel.create(this.settings);
		WFSettings.setFields({
			fieldsWrapper: WrapperForm,
		});
		this.#form = form;
		this.trigger('change');
	}
}
