export const userRegistrationForm = {
	name: 'user-registration',
	title: 'User Registration',
	template: ['1', '1', '1x2', '1'],
	gap: '1.5rem',
	fields: [
		{
			name: 'firstName',
			type: 'text',
			placeholder: 'Enter your first name',
			required: true,
			label: 'First Name',
			variant: 'floating',
		},
		{
			name: 'lastName',
			type: 'text',
			placeholder: 'Enter your last name',
			required: true,
			label: 'Last Name',
			variant: 'floating',
		},
		{
			name: 'email',
			type: 'email',
			placeholder: 'Enter your email',
			required: true,
			label: 'Email Address',
			variant: 'floating',
		},
		{
			name: 'phone',
			type: 'tel',
			placeholder: 'Enter your phone number',
			label: 'Phone Number',
			variant: 'floating',
		},
		{
			name: 'country',
			type: 'select',
			label: 'Country',
			required: true,
			options: [
				{
					value: 'us',
					label: 'United States',
				},
				{
					value: 'mx',
					label: 'Mexico',
				},
				{
					value: 'es',
					label: 'Spain',
				},
				{
					value: 'ar',
					label: 'Argentina',
				},
			],
		},
		{
			name: 'newsletter',
			type: 'checkbox',
			label: 'Subscribe to newsletter',
		},
	],
};




