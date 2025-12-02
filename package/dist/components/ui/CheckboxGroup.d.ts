import React from 'react';
export interface CheckboxGroupProps {
    name?: string;
    value?: string[] | number[];
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    options?: Array<{
        value: string | number;
        label?: string;
        [key: string]: any;
    }>;
    className?: string;
}
export declare const CheckboxGroup: React.FC<CheckboxGroupProps>;
//# sourceMappingURL=CheckboxGroup.d.ts.map