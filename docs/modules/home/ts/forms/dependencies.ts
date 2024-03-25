export const dependenciesForm = {
	name: 'Factiblidad',
	title: 'Factibilidad',
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
					callback: 'onLoad',
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
		{
			type: 'button',
			name: 'tu-madre',
			children: 'Prueba',
			variant: 'primary',
			// disabled: {
			// 	fields: [
			// 		{
			// 			name: 'country',
			// 			value: '4',
			// 		},
			// 		'city',
			// 	],
			// },
		},
	],
};
