import React from 'react';
import { ReactiveForm } from 'reactive-form/form';
import { loginForm } from '../forms/login';
import { Aside } from './aside';
import { FormContext } from './context';
import { Main } from './main';
export /*bundle*/
function View({ store }): JSX.Element {
	const [current, setCurrent] = React.useState(store.forms.login);
	return (
		<FormContext.Provider value={{ current, setCurrent, store }}>
			<div className='page__container'>
				<Aside />
				<Main />
			</div>
		</FormContext.Provider>
	);
}
