export const callbacksTesting = {
	name: 'Callbacks testing',
	template: [[4, '1fr'], '1x8'],
	fields: [
		{
			name: 'country',
			type: 'select',
			label: 'Pais: ',
			options: [
				{
					value: 'Colombia',
					label: 'Colombia',
				},
				{
					value: 'Ecuador',
					label: 'Ecuador',
				},
				{
					value: 'Peru',
					label: 'Peru',
				},
				{
					value: 'Venezuela',
					label: 'Venezuela',
				},
			],
		},
		{
			name: 'selectedCountry',
			label: 'Country Copy',
			disabled: true,
			dependentOn: [
				{
					field: 'country',
					callback: 'copyValue',
				},
			],
		},
	],
};
