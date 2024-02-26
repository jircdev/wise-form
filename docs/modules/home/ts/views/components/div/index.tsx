import React from 'react';
import { WrappedForm } from '@bgroup/wise-form/form';

export /*bundle*/ const Div = ({ data: { model, ...props } }) => {
	console.log('PROPS => ', props);

	const styles: React.CSSProperties = {};
	return (
		<div style={styles} className=" separator">
			<WrappedForm settings={props.data} data={model} />
		</div>
	);
};
