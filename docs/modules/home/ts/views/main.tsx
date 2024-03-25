import React from 'react';
import { WiseForm } from '@bgroup/wise-form/form';
import { useFormContext } from './context';
import { Button } from 'pragmate-ui/components';
import { ReactSelect } from 'pragmate-ui/form/react-select';
import { Wrapper } from './wrapper';
import { AppInput } from './components/app-input';
import { FormModel } from '@bgroup/wise-form/form';
import { Div } from './components/div';
import { Section } from './components/section';
import { Select } from './components/select';
interface ISettings {
	[key: string]: any;
}
export /*bundle*/
function Main(): JSX.Element {
	const { store } = useFormContext();

	const current = store.selected;
	const title = `Form: ${current.title}`;
	let settings: ISettings = current;
	const properties = settings.fields.map(item => item.name);

	const values = settings.values || {};
	settings.callbacks = store.callbacks;
	const form = new FormModel(settings, { properties, ...values });

	const types = {
		// @ts-ignore
		select: Select,
		// @ts-ignore
		baseWrapper: Wrapper,
		// @ts-ignore
		appInput: AppInput,
		// @ts-ignore
		div: Div,
		// @ts-ignore
		section: Section,
		// @ts-ignore
		button: Button,
	};
	return (
		<main>
			<h1>{title}</h1>
			{/* @ts-ignore */}
			<WiseForm types={types} model={form}>
				<Button type='submit' variant='primary'>
					Enviar
				</Button>
			</WiseForm>
		</main>
	);
}
