export function useTemplate(template) {
	const isArray = Array.isArray(template);
	let structure = template;
	let styles = {};

	if (!isArray) {
		if (typeof template !== 'object' || !template.structure || !Array.isArray(template.structure)) {
			throw new Error('Template must be an array or an object');
		}

		structure = template.structure;

		styles = template.gap ? { gap: template.gap } : {};
	}
	const processString = str => {
		if (typeof str === 'number') return [1, '1fr'];
		const [num, times] = str.split('x').map(Number);

		const tpl = times
			? [
					times,
					Array(times)
						.fill(num)
						.reduce((acc, v) => `${acc} 1fr`, ''),
			  ]
			: [1, '1fr'];
		return tpl;
	};
	console.log(20, template, styles);
	return {
		type: 'grid',
		styles: styles,
		items: structure.map(item => {
			if (!Array.isArray(item)) return processString(item);
			return item;
		}),
	};
}
