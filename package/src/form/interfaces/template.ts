import { CSSProperties } from 'react';

export interface IFormTemplate extends CSSProperties {
	structure?: string | (string | number | (string | number)[])[];
	gap?: string;
}

