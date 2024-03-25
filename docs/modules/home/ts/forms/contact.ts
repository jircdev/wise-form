export const contactForm = {
	name: 'Contact',
	title: 'Contact form',
	// template: '1;1;1x3',
	template: ['1', '1x2', [2, '50% 1fr 1fr'], 1],
	gap: '3rem',
	fields: [
		{
			type: 'wrapper',
			template: {
				structure: ['1x3'],
				gap: '3rem',
			},
			control: 'baseWrapper',
			name: 'wrapper-element',
			fields: [
				{
					name: 'Country',
					label: 'Sex',
					type: 'select',
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
			],
		},
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
