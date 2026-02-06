export type TDisabledSettings = {
	name: string;
	value: any;
	condition?: string;
	property?: string;
	operator?: 'and' | 'or';
	valueFromField?: string;
};

export interface IDisabled {
	fields: string[] | TDisabledSettings[];
	action?: 'enable' | 'disable';
	operator?: 'and' | 'or'; // Operator for the top-level list of fields/conditions
}

