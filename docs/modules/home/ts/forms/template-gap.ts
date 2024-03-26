export const templateGap = {
	name: 'template-gap',
	title: 'Template Gap',
	// template: '1;1;1x3',
	template: {
		structure: ['1', '1x2', [2, '50% 1fr 1fr'], 1],
		gap: '5rem',
	},
	fields: [
		{
			name: 'email',

			type: 'text',
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
