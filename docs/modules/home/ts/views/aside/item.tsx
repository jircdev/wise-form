import React from 'react';
import { List } from 'pragmate-ui/list';
import { useFormContext } from '../context';
import { Button } from 'pragmate-ui/components';
export function AsideItem({ data }) {
	
	const { store, current } = useFormContext();
	const onClick = () => {
		store.selected = data;
	};

	const attrs = { variant: 'primary', bordered: true, onClick: onClick };
	if (data[0] === current[0]) attrs.bordered = false;

	return (
		<li>
			<Button {...attrs}>{data[0]}</Button>
		</li>
	);
}
