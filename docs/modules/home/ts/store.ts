import { loginForm } from './forms/login';
import { contactForm } from './forms/contact';
import { IForm } from './interfaces/form';
import { templateGap } from './forms/template-gap';
import { ReactiveModel } from '@beyond-js/reactive/model';
import { WFSettings } from '@bgroup/wise-form/settings';
import { ReactSelect } from 'pragmate-ui/form/react-select';
import { EditUserForm } from './forms/edit';
import { composedWrapper } from './forms/composed-wrapper';
import { FormModel } from '@bgroup/wise-form/form';
import { Wrapper } from './views/wrapper';
import { AppInput } from './views/components/app-input';
import { dependenciesForm } from './forms/dependencies';
import { Div } from './views/components/div';
import { Section } from './views/components/section';
import { formulasForm } from './forms/formulas';
import { callbacksTesting } from './forms/callbacks-testing';

type FormItem = Record<string, [string, IForm]>;
export class StoreManager extends ReactiveModel<StoreManager> {
	#forms: Map<string, FormModel> = new Map();
	#active: FormModel;
	get active() {
		return this.#active;
	}
	#instances = new Map();

	get forms() {
		return {
			loginForm,
			contactForm,
			templateGap,
			EditUserForm,
			composedWrapper,
			dependenciesForm,
			formulasForm,
		};
	}

	constructor() {
		super();

		this.reactiveProps(['selected']);
		this.selected = this.forms.formulasForm;
		this.setForm(this.forms.formulasForm);
		// this.setForm(this.forms.contactForm);
		WFSettings.setFields({
			select: ReactSelect,
			baseWrapper: Wrapper,
			appInput: AppInput,
			div: Div,
			section: Section,
		});
	}

	async setForm(item) {
		if (this.#instances.has(item.name)) {
			this.#active = this.#instances.get(item.name);
			return this.trigger('change');
		}

		const callbacks = {
			onLoad: this.loadData,
			copyValue: this.copyValue,
		};
		const form = await FormModel.create({ ...item, callbacks });
		this.#instances.set(item.name, form);
		this.#active = form;
		this.trigger('change');
	}
	loadData = async specs => {
		specs.dependency.on('change', async () => {
			const response = await fetch('https://jsonplaceholder.typicode.com/users');
			const data = await response.json();

			specs.field.set({ options: data.map(item => ({ value: item.id, label: item.name })) });
		});
	};
}
