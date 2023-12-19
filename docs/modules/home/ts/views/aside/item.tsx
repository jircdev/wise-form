import React from 'react';
import { List } from 'pragmate-ui/list';
import { useFormContext } from '../context';
import { Button } from 'pragmate-ui/components';
export function AsideItem({ data }) {
	const { store, setCurrent } = useFormContext();
	const onClick = () => setCurrent(data);
	return (
		<li>
			<Button variant='primary' bordered onClick={onClick}>
				{data[0]}
			</Button>
		</li>
	);
}
