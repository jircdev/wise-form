import React from 'react';
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    name?: string;
    value?: string | number;
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    disabled?: boolean;
    options?: Array<{
        value: string | number;
        label?: string;
        [key: string]: any;
    }>;
    className?: string;
    id?: string;
    placeholder?: string;
    [key: string]: any;
}
export declare const Select: React.ForwardRefExoticComponent<Omit<SelectProps, "ref"> & React.RefAttributes<HTMLSelectElement>>;
//# sourceMappingURL=Select.d.ts.map