import type { IWidgetStore } from '@beyond-js/widgets/controller';
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

	get forms(): FormItem {
		return {
			login: ['Login', loginForm],
			contact: ['Contact', contactForm],
			templateGap: ['Template gap', templateGap],
			editUserForm: ['Edition Form', EditUserForm],
			composedWrapper: ['Composed form', composedWrapper],
			dependenciesForm: ['Dependencies form', dependenciesForm],
			formulasForm: ['Formulas Form', formulasForm],
			callbacksTesting: ['Callbacks testing', callbacksTesting],
		};
	}

	// #selected;
	// get selected() {
	// 	return this.#selected;
	// }
	// set selected(name) {
	// 	if (name === this.#selected.name) return;
	// 	this.#selected = this.#update(name);
	// 	this.triggerEvent();
	// }
	constructor() {
		super();

		this.reactiveProps(['selected']);
		this.selected = 'dependenciesForm';
		WFSettings.setFields({
			select: ReactSelect,
			baseWrapper: Wrapper,
			appInput: AppInput,
			div: Div,
			section: Section,
		});
		this.callbacks = {
			onLoad: this.loadData,
			copyValue: this.copyValue,
		};
	}

	loadData = async specs => {
		specs.dependency.on('change', async () => {
			const response = await fetch('https://jsonplaceholder.typicode.com/users');
			const data = await response.json();

			specs.field.set({ options: data.map(item => ({ value: item.id, label: item.name })) });
		});
	};

	copyValue = ({ dependency, field }) => {
		console.log('DEPDENCY', dependency, field);
		dependency.on('change', () => field.set({ value: dependency.value }));
	};

	#update(name: string) {
		if (this.#forms.has(name)) {
			return this.#forms.get(name);
		}

		const settings: any = this.forms[name][1];
		settings.callbacks = {
			onLoad: this.loadData,
		};
		const properties = settings.fields.map(item => item.name);
		const values = settings.values || {};
		const form = new FormModel(settings, { properties, ...values });

		this.#forms.set(name, form);
		return form;
	}
}
