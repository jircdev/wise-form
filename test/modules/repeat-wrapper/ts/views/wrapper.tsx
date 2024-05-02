import React, { useState } from 'react';
import { ItemForm } from './item';

export function WrapperForm() {
	const [items, setItems] = useState([]);
	const [formData, setFormData] = useState([]);
	const addItem = () => {
		setFormData([...formData, {}]);
		setItems(prevItems => [...prevItems, { id: Date.now(), data: {} }]);
	};

	const removeItem = id => {
		setItems(prevItems => prevItems.filter(item => item.id !== id));
	};

	const updateItem = (id, newData) => {
		setItems(prevItems => prevItems.map(item => (item.id === id ? { ...item, data: newData } : item)));
	};

	return (
		<div>
			<button onClick={addItem}>Add New Item</button>
			{items.map((item, index) => (
				<ItemForm
					key={item.id}
					index={index}
					onRemove={() => removeItem(item.id)}
					onUpdate={data => updateItem(item.id, data)}
				/>
			))}
		</div>
	);
}
