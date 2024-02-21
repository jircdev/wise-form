import React from 'react';
import { WiseForm } from '@bgroup/wise-form/form';
import { useFormContext } from './context';
import { Button } from 'pragmate-ui/components';
import { ReactSelect } from 'pragmate-ui/form/react-select';
import { Wrapper } from './wrapper';
import { AppInput } from './components/app-input';
import { FormModel } from '@bgroup/wise-form/form';
export /*bundle*/
function Main(): JSX.Element {
	const { current } = useFormContext();
	const title = `Form: ${current[0]}`;
	const settings = current[1];
	const properties = settings.fields.map(item => item.name);
	//@ts-ignore
	const values = settings.values || {};
	const form = new FormModel(settings, { properties, ...values });
	return (
		<main>
			<h1>{title}</h1>
			<WiseForm
				types={{
					pepito: ReactSelect,
					baseWrapper: Wrapper,
					appInput: AppInput,
				}}
				settings={settings}
				model={form}>
				<Button type="submit" variant="primary">
					Enviar
				</Button>
			</WiseForm>
		</main>
	);
}
