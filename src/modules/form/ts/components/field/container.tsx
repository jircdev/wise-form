import React from 'react';

export function ControlFieldContainer({ children }) {
	console.log(3, children);
	return <div className='rf-field-container'>{children}</div>;
}
