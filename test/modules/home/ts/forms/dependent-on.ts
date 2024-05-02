import { countries } from '../hardcoded/countries';

export const dependentOnForm = {
	name: 'registrationForm',
	template: [1, 1, 1, 1],
	fields: [
		{
			name: 'passport',
			value: 'passport-value',
			label: 'Passport',
			type: 'text',
		},
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
};
