import React from 'react';
import { ReactSelect } from 'pragmate-ui/form/react-select';
import { WrappedForm } from '@bgroup/wise-form/form';

export function Wrapper({ data }) {
	console.log(0.2, data);
	return (
		<WrappedForm
			types={{
				select: ReactSelect,
				baseWrapper: Wrapper,
			}}
			settings={data}
		/>
	);
}
