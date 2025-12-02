import React from 'react';
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name?: string;
    value?: string | number;
    checked?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    className?: string;
    id?: string;
    label?: string;
    [key: string]: any;
}
export declare const Checkbox: React.ForwardRefExoticComponent<Omit<CheckboxProps, "ref"> & React.RefAttributes<HTMLInputElement>>;
//# sourceMappingURL=Checkbox.d.ts.map