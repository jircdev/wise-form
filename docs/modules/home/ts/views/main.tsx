import React from 'react';
import { WiseForm } from 'wise-form/form';
import { useFormContext } from './context';
import { Button } from 'pragmate-ui/components';
import { ReactSelect } from 'pragmate-ui/form/react-select';
import { Wrapper } from './wrapper';

export /*bundle*/
function Main(): JSX.Element {
	const { current } = useFormContext();
	const title = `Form: ${current[0]}`;

	return (
		<main>
			<h1>{title}</h1>
			<WiseForm
				types={{
					pepito: ReactSelect,
					baseWrapper: Wrapper,
				}}
				settings={current[1]}
			>
				<Button type='submit' variant='primary'>
					Enviar
				</Button>
			</WiseForm>
		</main>
	);
}
