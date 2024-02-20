import React from 'react';
import { ReactSelect } from 'pragmate-ui/form/react-select';
import { WrappedForm } from '@bgroup/wise-form/form';
import { AppInput } from './components/app-input';
import { useWiseFormContext } from '@bgroup/wise-form/form';
export function Wrapper({ data }) {
	const { model } = useWiseFormContext();
	console.log(40, model);
	return (
		<WrappedForm
			types={{
				pepito: ReactSelect,
				baseWrapper: Wrapper,
				appInput: AppInput,
			}}
			settings={data}
		/>
	);
}
