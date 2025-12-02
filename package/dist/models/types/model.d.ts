import { IFormField } from './form-field';
type Callback = (...args: any[]) => void | Promise<any>;
export interface IFormModelProps {
    name?: string;
    params?: Record<string, any>;
    callbacks?: Record<string, Callback>;
    fields?: IFormField[];
    template?: Array<string | number>;
    properties?: string[];
    [key: string]: any;
}
export {};
//# sourceMappingURL=model.d.ts.map