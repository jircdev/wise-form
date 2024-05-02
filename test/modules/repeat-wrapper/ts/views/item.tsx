import React, { useState } from 'react';

export function ItemForm({ itemData, setter, index, onRemove, onUpdate }) {
	const [formData, setFormData] = useState({});

	const handleChange = event => {
		const { name, value } = event.target;
		setter(prevFormData => ({
			...prevFormData,
			[name]: value,
		}));
	};

	const handleUpdate = () => {
		onUpdate(formData);
	};

	return (
		<div>
			<input type='text' name='name' value={formData.name || ''} onChange={handleChange} placeholder='Name' />
			<input
				type='text'
				name='description'
				value={formData.description || ''}
				onChange={handleChange}
				placeholder='description'
			/>
			<input type='text' name='price' value={formData.price || ''} onChange={handleChange} placeholder='Price' />
			{/* Add more inputs as needed */}
			<button onClick={handleUpdate}>Update</button>
			<button onClick={onRemove}>Remove</button>
		</div>
	);
}
