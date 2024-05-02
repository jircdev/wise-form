import { BindlessInput } from '../views/components/bindless-input';

export const bindlessForm = {
	name: 'Bindless form',
	title: 'Bindless form',
	template: ['1fr'],
	fields: [
		{
			type: 'wrapper',
			control: 'div',
			template: ['1fr', '1fr'],
			name: 'blindessContainer',
			fields: [
				{
					name: 'bindless',
					label: 'Bindless Input',
					type: 'bindlessInput',
					events: {
						onChange: {
							url: 'http://localhost:3000',
							params: {
								fields: ['bindless'],
								specs: ['bindlessInput'],
							},
						},
					},
				},
				{
					type: 'percentageInput',
					name: 'percentageInput',
					label: 'Percentage Input',
				},
			],
		},
	],
};
