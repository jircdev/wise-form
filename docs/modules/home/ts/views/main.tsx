import React from 'react';
import { ReactiveForm } from 'reactive-form/form';
import { useFormContext } from './context';

export /*bundle*/
function Main(): JSX.Element {
	const {
		current: [label, form],
		store: { data },
	} = useFormContext();
	const title = `Form: ${label}`;
	console.log(0.2, data, form.name, data[form.name]);
	return (
		<main>
			<h1>{title}</h1>
			<ReactiveForm settings={form} data={data[form.name]} />
		</main>
	);
}
