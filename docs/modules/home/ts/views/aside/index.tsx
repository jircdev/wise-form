import React from 'react';
import { List } from 'pragmate-ui/list';
import { useFormContext } from '../context';
import { AsideItem } from './item';

export function Aside() {
	const { store } = useFormContext();
	const items = Object.values(store.forms);

	return (
		<aside className='page__aside'>
			<List className='list-unstyled' items={items} control={AsideItem} />
		</aside>
	);
}
