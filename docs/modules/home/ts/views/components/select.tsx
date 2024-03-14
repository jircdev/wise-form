import React from 'react';
import { ReactSelect } from 'pragmate-ui/form/react-select';
import { useWiseFormContext } from '@bgroup/wise-form/form';
import { useBinder } from '@beyond-js/react-18-widgets/hooks';

export /*bundle*/ const Select = ({ ...props }) => {
	const { model: generalModel } = useWiseFormContext();
	const instance = generalModel.getField(props.name);
	const [options, setOptions] = React.useState(props.options);
	// useBinder([instance], () => {
	// 	setOptions(instance.options);
	// });
	const attributes = { ...props, options };
	return <ReactSelect {...attributes} />;
};
