import React from 'react';
import { WFSettings } from '../../../settings';
import { SelectionField } from '../components/field/selection';
import { Input, Textarea } from '../../../components/ui';

export function useTypes(types) {
	return React.useMemo(() => {
		const defaultTypes = {
			checkbox: SelectionField,
			radio: SelectionField,
			select: SelectionField,
			textarea: Textarea,
			text: Input,
			password: Input,
			default: Input,
		};

		return { ...defaultTypes, ...WFSettings.types, ...types };
	}, [types]);
}

