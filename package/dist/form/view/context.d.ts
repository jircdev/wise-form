import React from 'react';
import type { FormModel, WrappedFormModel } from '@bgroup/wise-form/models';
export interface IFormContext {
    model?: FormModel | WrappedFormModel;
    name?: string;
    values?: Record<string, any>;
    items?: any;
    rows?: [number, string][];
    template?: {
        type: string;
        styles: any;
        items: any[];
    };
    formTypes?: Record<string, React.ElementType>;
}
export interface IWrappedFormContext extends IFormContext {
    parent: IFormContext;
}
export declare const WiseFormContext: React.Context<IFormContext>;
export declare const useWiseFormContext: () => IFormContext;
export declare const WrappedWiseFormContext: React.Context<IFormContext>;
export declare const useWrappedWiseFormContext: () => IFormContext;
//# sourceMappingURL=context.d.ts.map