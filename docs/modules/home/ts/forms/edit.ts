export const EditUserForm = {
	name: 'edit',
	values: {
		name: 'Julio  Isaac',
		lastname: 'Rodriguez',
		genre: 'M',
	},
	fields: [
		{
			name: 'name',
			type: 'text',
			placeholder: 'First name',
			required: true,
			label: 'First Name',
			variant: 'floating',
		},
		{
			name: 'lastname',
			type: 'text',
			placeholder: 'Last name',
			required: true,
			label: 'Last Name',
			variant: 'floating',
		},
		{
			name: 'genre',
			type: 'select',
			options: [
				{ value: 'M', label: 'Male' },
				{ value: 'F', label: 'Female' },
			],
			required: true,
			label: 'Last Name',
			variant: 'floating',
		},
	],
};
	