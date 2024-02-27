export const dependenciesForm = {
	name: 'Factiblidad',
	template: [[4, '1fr'], '1x8'],
	fields: [
		{
			name: 'country',
			type: 'select',
			label: 'Pais: ',
			options: [
				{ value: '1', label: 'Colombia' },
				{ value: '2', label: 'Ecuador' },
				{ value: '3', label: 'Peru' },
				{ value: '4', label: 'Venezuela' },
			],
		},
		{
			name: 'city',
			type: 'select',
			options: [],
			label: 'City',
			dependentOn: [
				{
					field: 'country',
					type: 'fetch',
					callback: 'loader',
				},
			],
		},
		{
			name: 'coverColors',
			type: 'select',
			options: [],
			label: 'Cover colors: ',
		},
		{
			type: 'wrapper',
			control: 'div',
			name: 'thirdSection',
			template: [],
			fields: [],
		},
	],
};
