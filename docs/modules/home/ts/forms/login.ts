export const loginForm = {
	name: 'login',
	fields: [
		{
			name: 'username',
			type: 'text',
			placeholder: 'Username',
			required: true,
			label: 'Username',
			variant: 'floating',
		},
		{
			name: 'password',
			type: 'password',
			variant: 'floating',
			placeholder: 'Add your password',
			required: true,
			label: 'Password',
		},
	],
};
