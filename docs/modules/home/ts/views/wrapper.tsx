import React from 'react';
import { ReactSelect } from 'pragmate-ui/form/react-select';
import { WrappedForm } from 'wise-form/form';

export function Wrapper({ data }) {
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
