import React from 'react';
import { WrappedForm } from '@bgroup/wise-form/form';

export /*bundle*/ const Div = ({ data: { model, ...props } }) => {
	console.log('PROPS => ', props);

	return (
		<div className=' separator'>
			<WrappedForm settings={props} data={model} />
		</div>
	);
};
