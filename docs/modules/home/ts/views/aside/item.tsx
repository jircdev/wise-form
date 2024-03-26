import React from 'react';
import { List } from 'pragmate-ui/list';
import { useFormContext } from '../context';
import { Button } from 'pragmate-ui/components';
export function AsideItem({ item }) {
	const { store, current } = useFormContext();
	const onClick = () => {
		store.setForm(item);
	};

	const attrs = { variant: 'primary', bordered: true, onClick };
	// if (title === current[0]) attrs.bordered = false;

	return (
		<li>
			<Button {...attrs}>{item.title}</Button>
		</li>
	);
}
