import { countries } from '../hardcoded/countries';

export const dependentWrapperCase = {
	name: 'dependentWrapperCase',
	title: 'Dependent On Wrapper case',
	template: [1],
	fields: [
		{
			name: 'mainWrapper',
			type: 'wrapper',
			control: 'div',
			template: [1, 1, 1, 1],
			fields: [
				{
					name: 'country',
					type: 'select',
					label: 'Select Country',
					options: countries.map(country => ({ value: country.name, label: country.name })),
				},
				{
					name: 'state',
					type: 'select',
					label: 'Select State',
					options: [], // Opciones iniciales vacías, se llenarán basadas en el país
					dependentOn: [
						{
							field: 'country',
							callback: 'fetchData',
							url: '/states',
							fields: ['passport'],
						},
					],
				},
				{
					name: 'city',
					type: 'select',
					label: 'Select City',
					options: [], // Opciones iniciales vacías, se llenarán basadas en el estado
					dependentOn: [
						{
							field: {
								state: 'parent', // Sobreescribe 'state' por 'parent' como el nombre del campo en la solicitud
							},
							url: '/cities',
							callback: 'fetchData',
							fields: ['passport'],
							params: ['token'], // Asume que 'token' es un parámetro global configurado en WiseForm
						},
					],
				},
			],
		},
	],
};
