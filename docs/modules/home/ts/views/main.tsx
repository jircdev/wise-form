import React from 'react';
import { ReactiveForm } from '@bgroup/reactive-form/form';
import { useFormContext } from './context';

export /*bundle*/
function Main(): JSX.Element {
	const { current } = useFormContext();
	const title = `Form: ${current[0]}`;
	return (
		<main>
			<h1>{title}</h1>
			<ReactiveForm settings={current[1]} />
		</main>
	);
}
