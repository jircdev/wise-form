//@ts-ignore // this line generates error because we need to generate the declarations.
import { ICallbackProps } from '@bgroup/wise-form/models';
import { countries } from '../hardcoded/countries';
type ItemOption = {
	value: string;
	label: string;
};

const statesMap = new Map<string, ItemOption[]>();
const citiesMap = new Map<string, ItemOption[]>();

function getStates({ country }: { country: string }): ItemOption[] {
	if (statesMap.has(country)) {
		return statesMap.get(country)!;
	}

	const data = countries.find(item => item.name === country);
	const states = data ? data.states.map(state => ({ value: state.name, label: state.name })) : [];
	statesMap.set(country, states);
	return states;
}

function getCities({ state }: { state: string }): ItemOption[] {
	if (citiesMap.has(state)) {
		return citiesMap.get(state)!;
	}

	for (const country of countries) {
		const stateData = country.states.find(item => item.name === state);
		if (stateData) {
			const options = stateData.cities.map(city => ({ value: city, label: city }));
			citiesMap.set(state, options);
			return options;
		}
	}
	return [];
}

export /*bundle */ async function fetchData(specs: ICallbackProps) {
	const URLS = { '/cities': getCities, '/states': getStates };
	const callback = URLS[specs.url];
	if (!callback) throw new Error('url to call not found');

	const options = await callback(specs.fields);
	console.log(99, options, specs.field);
	specs.field.set({ options });
}
