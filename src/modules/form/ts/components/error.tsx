import React from 'react';

export function ErrorRenderer({ error }) {
	React.useEffect(() => {
		console.error(error);
	}, []);
	return <div className='alert alert--error pui-alert'>{error}</div>;
}
