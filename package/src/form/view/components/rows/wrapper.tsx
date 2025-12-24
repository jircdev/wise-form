import React from "react";
import { useWiseFormContext } from "../../context";
/**
 *
 * @param data {WrappedFormModel}
 * @param model {FormModel} parent.
 * @returns
 */
export function FormSectionWrapper({ data, model }) {
	const { formTypes } = useWiseFormContext();

	const types = {
		...formTypes,
	};

	if (!data.control) {
		throw new Error("Wrapper must have a control");
	}
	if (!data.name) {
		return null;
	}
	if (data?.hidden) {
		return null;
	}

	const wrapperModel = model?.getField(data.name);
	if (!wrapperModel) {
		return null;
	}

	const Control = types[data.control];
	if (!Control) {
		return null;
	}

	// data = wrapperModel ? { ...data, ...wrapperModel.getProperties() } : data;
	return <Control model={wrapperModel} />;
}

