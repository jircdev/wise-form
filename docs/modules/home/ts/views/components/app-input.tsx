import React from 'react';
import { Input } from 'pragmate-ui/form';

export function AppInput(props) {
	return (
		<>
			<Input type='text' placeholder='name 1' />
			<Input type='text' placeholder='name 2' />
			<Input type='text' placeholder='name 3' />
		</>
	);
}
