export const feedbackForm = {
	name: 'feedback',
	title: 'Feedback Form',
	template: ['1', '1x2', '1'],
	gap: '2rem',
	fields: [
		{
			name: 'subject',
			type: 'text',
			placeholder: 'Enter subject',
			required: true,
			label: 'Subject',
			variant: 'floating',
		},
		{
			name: 'category',
			type: 'select',
			label: 'Category',
			required: true,
			options: [
				{
					value: 'bug',
					label: 'Bug Report',
				},
				{
					value: 'feature',
					label: 'Feature Request',
				},
				{
					value: 'improvement',
					label: 'Improvement',
				},
				{
					value: 'other',
					label: 'Other',
				},
			],
		},
		{
			name: 'priority',
			type: 'select',
			label: 'Priority',
			required: true,
			options: [
				{
					value: 'low',
					label: 'Low',
				},
				{
					value: 'medium',
					label: 'Medium',
				},
				{
					value: 'high',
					label: 'High',
				},
			],
		},
		{
			name: 'message',
			type: 'textarea',
			variant: 'floating',
			placeholder: 'Enter your feedback message',
			required: true,
			label: 'Message',
		},
		{
			name: 'rating',
			type: 'radio',
			label: 'Rating',
			required: true,
			options: [
				{
					value: '1',
					label: '1 - Poor',
				},
				{
					value: '2',
					label: '2 - Fair',
				},
				{
					value: '3',
					label: '3 - Good',
				},
				{
					value: '4',
					label: '4 - Very Good',
				},
				{
					value: '5',
					label: '5 - Excellent',
				},
			],
		},
	],
};




