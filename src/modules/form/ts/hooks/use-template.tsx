import { IFormTemplate } from '../interfaces/template';

/**
 * Applies a template to create a structured layout, optionally using a gap between elements.
 *
 * @param template - The template to be applied. Can be an array or an object conforming to the IFormTemplate interface.
 * @param gap - Specifies the gap between elements.
 * The `gap` parameter is deprecated and will be removed in a future version. Use the gap property within the template object instead.
 * @returns An object representing the structured layout with type, styles, and items.
 */
export function useTemplate(settings, gap = undefined) {
	let { template } = settings;
	let structure = template;
	let styles = {};

	if (!template) {
		return {
			type: 'grid',
			styles: {},
			items: settings.fields.map(item => [1, '1fr']),
		};
	}

	if (gap) {
		template = { structure: template, gap: gap } as IFormTemplate;
	}
	const isArray = Array.isArray(template);

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

	return {
		type: 'grid',
		styles: styles,
		items: structure.map(item => {
			if (!Array.isArray(item)) return processString(item);
			return item;
		}),
	};
}
