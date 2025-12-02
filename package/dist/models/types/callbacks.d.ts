import { FormModel } from '../model';
export type FieldOrAlias = string | {
    [fieldName: string]: string;
};
export interface ICallbackProps {
    form: FormModel;
    field: FieldOrAlias;
    [string: string]: any;
    /**
     * Additional fields to be passed to the callback.
     */
    fields?: Record<string, any>;
    /**
     * Additional data registered in the WiseForm settings.
     */
    specs?: Record<string, any>;
}
export type CallbackFunction = (props: ICallbackProps) => void;
//# sourceMappingURL=callbacks.d.ts.map