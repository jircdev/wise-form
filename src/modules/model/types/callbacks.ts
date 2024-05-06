import { string } from 'mathjs';
import { FormField } from '../field';
import { FormModel } from '../model';

// Define un tipo que puede ser un string o un objeto con cualquier número de propiedades de tipo string,
// donde la clave es el nombre del campo y el valor es el alias.
export type FieldOrAlias = string | { [fieldName: string]: string };

export /*bundle */ interface ICallbackProps {
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
