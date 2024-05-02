type State = {
	name: string;
	cities: string[];
};

type Country = {
	name: string;
	states: State[];
};

export const countries: Country[] = [
	{
		name: 'United States',
		states: [
			{ name: 'California', cities: ['Los Angeles', 'San Francisco', 'San Diego'] },
			{ name: 'Texas', cities: ['Houston', 'Dallas', 'San Antonio'] },
			{ name: 'Florida', cities: ['Miami', 'Orlando', 'Tampa'] },
		],
	},
	{
		name: 'Canada',
		states: [
			{ name: 'Ontario', cities: ['Toronto', 'Ottawa', 'Hamilton'] },
			{ name: 'Quebec', cities: ['Montreal', 'Quebec City', 'Gatineau'] },
			{ name: 'British Columbia', cities: ['Vancouver', 'Victoria', 'Kelowna'] },
		],
	},
	{
		name: 'Germany',
		states: [
			{ name: 'Bavaria', cities: ['Munich', 'Nuremberg', 'Augsburg'] },
			{ name: 'Berlin', cities: ['Berlin', 'Potsdam', 'Berlin-Schönefeld'] },
			{ name: 'Hamburg', cities: ['Hamburg', 'Hamburg-Altona', 'Hamburg-Harburg'] },
		],
	},
	{
		name: 'Australia',
		states: [
			{ name: 'New South Wales', cities: ['Sydney', 'Newcastle', 'Wollongong'] },
			{ name: 'Victoria', cities: ['Melbourne', 'Geelong', 'Ballarat'] },
			{ name: 'Queensland', cities: ['Brisbane', 'Gold Coast', 'Cairns'] },
		],
	},
	{
		name: 'India',
		states: [
			{ name: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur'] },
			{ name: 'Delhi', cities: ['New Delhi', 'Delhi', 'Gurgaon'] },
			{ name: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Madurai'] },
		],
	},
];
