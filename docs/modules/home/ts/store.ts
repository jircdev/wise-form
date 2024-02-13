import type { IWidgetStore } from '@beyond-js/widgets/controller';
import { loginForm } from './forms/login';
import { contactForm } from './forms/contact';
import { IForm } from './interfaces/form';
import { templateGap } from './forms/template-gap';
import { ReactiveModel } from '@beyond-js/reactive/model';
import { WFSettings } from '@bgroup/wise-form/settings';
import { ReactSelect } from 'pragmate-ui/form/react-select';

type FormItem = Record<string, [string, IForm]>;
export class StoreManager extends ReactiveModel<StoreManager> {
	get forms(): FormItem {
		return {
			login: ['Login', loginForm],
			contact: ['Contact', contactForm],
			templateGap: ['Template gap', templateGap],
		};
	}

	constructor() {
		super();
		this.reactiveProps(['selected']);
		this.selected = 'templateGap';
		WFSettings.setFields({
			select: ReactSelect,
		});
	}
}
