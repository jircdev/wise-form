export const contactForm = {
	name: 'Contact',
	template: '1;1;1x3',
	fields: [
		{
			name: 'Country',
			label: 'Sex',
			type: 'pepito',
			options: [
				{
					value: 'arg',
					label: 'Argentina',
				},
				{
					value: 've',
					label: 'Venezuela',
				},
			],
		},
		{
			name: 'email',
			type: 'password',
			required: true,
			label: 'Username',
		},
		{
			name: 'age',
			pattern: '^[0-9]*$',
			label: 'Age',
		},
		{
			name: 'sex',
			label: 'Sex',
			type: 'select',
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
			label: 'Preferences',
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
