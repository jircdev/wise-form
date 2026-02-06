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
    operator?: 'and' | 'or';
}
//# sourceMappingURL=disabled.d.ts.map