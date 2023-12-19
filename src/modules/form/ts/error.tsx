import React from 'react';
import { Alert } from 'pragmate-ui/alert';

export function ErrorRenderer({ error }) {
	React.useEffect(() => {
		console.error(error);
	}, []);
	return <Alert type='error'>{error}</Alert>;
}
