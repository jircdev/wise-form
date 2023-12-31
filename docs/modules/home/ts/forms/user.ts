export const userForm = {
	name: 'user',
	fields: [
		{
			name: 'name',
			type: 'text',
			required: true,
			label: 'Username',
			variant: 'floating',
		},
		,
		{
			name: 'lastname',
			type: 'text',
			required: true,
			label: 'Username',
			variant: 'floating',
		},
		{
			name: 'email',
			type: 'email',
			required: true,
			label: 'Username',
			variant: 'floating',
		},
		{
			name: 'sex',
			type: '+',
			options: [
				{
					value: 'M',
					label: 'Male',
				},
				{
					value: 'F',
					label: 'Female',
				},
			],
		},
		{
			name: 'preferences',
			type: 'checkbox',
			options: [
				{
					value: 'Javascript',
					label: 'Javascript',
				},
				{
					value: 'Typescript',
					label: 'Typescript',
				},
			],
		},
		{
			name: 'comments',
			type: 'textarea',
			variant: 'floating',
			placeholder: 'Add your comments',
			required: true,
			label: 'Comments',
		},
	],
};
