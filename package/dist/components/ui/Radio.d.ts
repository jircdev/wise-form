import React from 'react';
export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
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
export declare const Radio: React.ForwardRefExoticComponent<Omit<RadioProps, "ref"> & React.RefAttributes<HTMLInputElement>>;
//# sourceMappingURL=Radio.d.ts.map