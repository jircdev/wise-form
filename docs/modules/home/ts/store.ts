import type { IWidgetStore } from '@beyond-js/widgets/controller';
import { loginForm } from './forms/login';
import { contactForm } from './forms/contact';
import { IForm } from './interfaces/form';
import { userForm } from './forms/user';

type FormItem = Record<string, [string, IForm]>;
export class StoreManager implements IWidgetStore {
	get forms(): FormItem {
		return {
			login: ['Login', loginForm],
			contact: ['Contact', contactForm],
			user: ['User', userForm],
		};
	}

	get data() {
		return {
			user: {
				name: 'Julio',
				lastname: 'Rodriguez',
				email: 'jircdev@gmail.com',
				sex: 'M',
				preferences: ['Typescript'],
				comments: 'This is a comment',
			},
		};
	}
}
