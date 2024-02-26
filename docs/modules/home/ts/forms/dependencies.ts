export const dependenciesForm = {
	name: 'Factiblidad',
	template: [[4, '1fr 1fr 1fr 1fr'], '1fr', '1fr', '1fr', '1fr', '1fr', '1fr', '1fr', '1fr'],
	fields: [
		{
			type: 'wrapper',
			control: 'div',
			name: 'secondSection',
			template: [[4, '1fr 1fr 1fr 1fr']],
			fields: [
				{
					name: 'plastified',
					disabled: true,
					type: 'select',
					label: 'Plastificado:',
					options: [
						{
							label: '1',
							value: '1',
						},
						{
							label: '2',
							value: '2',
						},
						{
							label: '3',
							value: '3',
						},
					],
					properties: ['currentFormat'],
					currentFormat: 0,
				},
				{
					name: 'binding',
					disabled: true,
					type: 'select',
					label: 'Encuadernacion:',
					options: [],
					properties: ['currentFormat'],
					currentFormat: 0,
				},
				{
					name: 'pantone',
					disabled: true,
					type: 'select',
					label: 'Pantone:',
					options: [],
				},
				{
					type: 'wrapper',
					control: 'div',
					name: 'selects',
					template: [[2, '1fr 1fr']],
					fields: [
						{
							name: 'pantone',
							disabled: true,
							type: 'select',
							value: { label: 'No aplica', value: 0 },
							options: [{ label: 'No aplica', value: 0 }],
						},
						{
							name: 'flap',
							type: 'checkbox',
							options: [
								{
									label: 'Solapa',
									className: 'secondary-label',
								},
							],
						},
					],
				},
			],
		},
		{
			name: 'coverPaper',
			type: 'select',
			label: 'Papel tapa: ',
			options: [],
			disabled: true,
		},
		{
			name: 'grammage',
			type: 'select',
			options: [],
			label: 'Gramaje: ',
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
