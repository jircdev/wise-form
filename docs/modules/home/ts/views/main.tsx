import React from 'react';
import { ReactiveForm } from 'wise-form/form';
import { useFormContext } from './context';
import { Button } from 'pragmate-ui/components';
import { ReactSelect } from 'pragmate-ui/form/react-select';
import { Settings } from 'wise-form/settings';

export /*bundle*/
function Main(): JSX.Element {
	const { current } = useFormContext();
	const title = `Form: ${current[0]}`;
	return (
		<main>
			<h1>{title}</h1>
			<ReactiveForm
				types={{
					select: ReactSelect,
					pepito: ReactSelect,
				}}
				settings={current[1]}
			>
				<Button type='submit' variant='primary'>
					Enviar
				</Button>
			</ReactiveForm>
		</main>
	);
}
