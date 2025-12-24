import React from 'react';

export function ErrorRenderer({ error }) {
	return <div className='alert alert--error pui-alert'>{error}</div>;
}

