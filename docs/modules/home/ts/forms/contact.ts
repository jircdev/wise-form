export const contactForm = {
	name: 'Contact',
	fields: [
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
