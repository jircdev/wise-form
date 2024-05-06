export type TDisabledSettings = {
	name: string;
	value: any;
};
export interface IDisabled {
	fields: string[] | TDisabledSettings[];
}
