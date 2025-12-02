import React from 'react';
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name?: string;
    value?: string | number;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    placeholder?: string;
    type?: string;
    className?: string;
    id?: string;
    [key: string]: any;
}
export declare const Input: React.ForwardRefExoticComponent<Omit<InputProps, "ref"> & React.RefAttributes<HTMLInputElement>>;
//# sourceMappingURL=Input.d.ts.map