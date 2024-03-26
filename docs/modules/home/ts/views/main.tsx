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
import { useBinder } from '@beyond-js/react-18-widgets/hooks';
interface ISettings {
	[key: string]: any;
}

export /*bundle*/
function Main(): JSX.Element {
	const { store } = useFormContext();

	const [active, setActive] = React.useState<FormModel>(store.active);
	const current = store.selected;
	const title = `Form: ${active.name}`;
	let settings: ISettings = current;
	useBinder([store], () => setActive(store.active));
	settings.callbacks = store.callbacks;

	const types = {
		select: Select,
		baseWrapper: Wrapper,
		appInput: AppInput,
		div: Div,
		section: Section,
		button: Button,
	};
	return (
		<main>
			<h1>{title}</h1>
			{/* @ts-ignore */}
			<WiseForm types={types} model={active}>
				<Button type='submit' variant='primary'>
					Enviar
				</Button>
			</WiseForm>
		</main>
	);
}
