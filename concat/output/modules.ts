/**
 * File: form\ts\interfaces\field-container.ts
 */
import { WiseFormField } from './interfaces';

export interface IFieldContainer {
	template: [number, string];
	items: WiseFormField[];
	styles?: any; // @todo: add correct type
	model: any;
}

/**
 * File: form\ts\interfaces\interfaces.ts
 */
import type { FormField, WrappedFormModel } from '@bgroup/wise-form/models';

// Interface for individual form field elements
export /*bundle*/ type WiseFormField = (FormField | WrappedFormModel)[];

// Interface for the general form structure
export /*bundle*/ interface IWiseForm {
	name: string;
	template: string;
	fields: WiseFormField;
}

/**
 * File: form\ts\interfaces\settings.ts
 */
import { WiseFormField } from './interfaces';
import { IFormTemplate } from './template';

export /*bundle*/ interface IFormSettings {
	name: 'string';
	template?: IFormTemplate;
	values?: Record<string, string>;
	fields: WiseFormField[];
	gap?: number;
}

/**
 * File: form\ts\interfaces\template.ts
 */
import { CSSProperties } from 'react';

export /*bundle */ interface IFormTemplate extends CSSProperties {
	structure?: string | (string | number | (string | number)[])[];
	gap?: string;
}

/**
 * File: form\ts\interfaces\wise-form-specs.ts
 */
import type { FormModel } from '@bgroup/wise-form/models';
import { IFormSettings } from './settings';

export /*bundle */ interface IWiseFormSpecs {
	children?: React.ReactNode;
	settings?: IFormSettings;
	model?: FormModel;
	types?: Record<string, React.ReactNode>;
}

/**
 * File: form\ts\view\components\containers\index.tsx
 */
import React from 'react';
import { useWiseFormContext } from '../../context';
import { RowFieldContainer } from '../rows/row-container';

export function Containers() {
	const {
		rows,
		model,
		template: { styles },
	} = useWiseFormContext();

	const fields = [...model.fields.values()];
	return rows.map((num, index) => {
		const items = fields.splice(0, num[0]);

		return (
			<RowFieldContainer
				model={model}
				template={num}
				items={items}
				key={`rf-row--${index}.${num}`}
				styles={styles}
			/>
		);
	});
}

/**
 * File: form\ts\view\components\error.tsx
 */
import React from 'react';

export function ErrorRenderer({ error }) {
	React.useEffect(() => {
		console.error(error);
	}, []);
	return <div className='alert alert--error pui-alert'>{error}</div>;
}

/**
 * File: form\ts\view\components\field\container.tsx
 */
import React from 'react';

export function ControlFieldContainer({ children }) {
	return <div className='rf-field-container'>{children}</div>;
}

/**
 * File: form\ts\view\components\field\index.tsx
 */
import React from 'react';
import { Input, Textarea } from 'pragmate-ui/form';
import { SelectionField } from './selection';
import { ControlFieldContainer } from './container';
import { useWiseFormContext } from '../../context';
import { WiseFormField } from '../../../interfaces/interfaces';
import type { FormModel, WrappedFormModel } from '@bgroup/wise-form/models';
import { useField } from './use-field';

type WiseFormFieldControlProps = {
	field: WiseFormField;
	index: number;
	model: FormModel | WrappedFormModel;
};
/**
 *
 * @param props.field WiseForm Json config
 * @param props.index Index of the field
 * @param props.model Field or Wrapper Model.
 * @returns
 */
export function Control({ field, index, model }: WiseFormFieldControlProps) {
	const { formTypes } = useWiseFormContext();

	const { attrs } = useField(model, field);
	const types = {
		...{
			checkbox: SelectionField,
			radio: SelectionField,
			select: SelectionField,
			textarea: Textarea,
			text: Input,
			password: Input,
			default: Input,
		},
		...formTypes,
	};

	const Control = types[field.type] ?? types.default;

	return (
		<ControlFieldContainer>
			<Control {...attrs} />
		</ControlFieldContainer>
	);
}

/**
 * File: form\ts\view\components\field\selection.tsx
 */
import React from 'react';
import { Checkbox, CheckboxGroup, Radio, Select } from 'pragmate-ui/form';
import { ErrorRenderer } from '../error';
import { useWiseFormContext } from '../../context';

export function SelectionField(props) {
	if (!props.options) return <ErrorRenderer error={`the field does not have options, field: ${props.name}`} />;

	const { name } = useWiseFormContext();
	const types = {
		checkbox: Checkbox,
		radio: Radio,
		select: SelectionField,
	};

	if (!types.hasOwnProperty(props.type)) return <ErrorRenderer error='the props type is not supported' />;
	const Control = types[props.type];

	if (props.type === 'select') return <Select {...props} />;

	if (props.type === 'checkbox') return <CheckboxGroup {...props} />;

	const output = props.options.map((option, key) => {
		const attributes = { ...option, name: props.name };
		return <Control {...attributes} key={`${name}.${props.name}.${key}`} />;
	});

	return output;
}

/**
 * File: form\ts\view\components\field\use-field.tsx
 */
import React from 'react';
import { useWiseFormContext } from '../../context';

export function useField(model, field) {
	const fieldModel = model.getField(field?.name);
	const { values } = useWiseFormContext();

	const value = fieldModel?.value ?? values[field?.name];
	const [attributes, setAttributes] = React.useState(fieldModel?.attributes);
	const onChange = event => model.setField(field.name, event.target.value);
	React.useEffect(() => {
		if (!fieldModel) return;
		const onChange = () => {
			setAttributes({ ...fieldModel.attributes });
		};
		fieldModel.on('change', onChange);
		const cleanUp = () => {
			fieldModel.off('change', onChange);
			fieldModel.cleanUp();
		};
		return cleanUp;
	}, [fieldModel]);

	/**
	 * It's necessary to change the field spread.
	 */

	const attrs = { value, ...attributes, onChange };

	return { attrs };
}

/**
 * File: form\ts\view\components\rows\row-container.tsx
 */
import React from 'react';
import { Control } from '../field';
import { FormSectionWrapper } from './wrapper';
import { IFieldContainer } from '../../../interfaces/field-container';

/**
 * Represents a container for form fields within a row, organizing them according to a specified grid style.
 * This component is used to group form fields dynamically based on the `template` property, allowing for
 * a flexible layout structure within the form. It supports wrapping fields in a div with a CSS grid layout
 * to align items as specified by the `template` and `styles` provided.
 *
 * @param {Object} props The properties passed to the RowFieldContainer component.
 * @param {[number, string]} props.template A tuple where the first element is the total number of fields in the row,
 * and the second element is a string representing the CSS grid template for the layout of these fields.
 * @param {WiseFormField[]} props.items An array of form field configurations that will be rendered within this row.
 * @param {any} [props.styles] Optional styles to be applied to the row container, allowing for further customization.
 * @param

*/
export function RowFieldContainer({ template: [totalFields, gridStyle], items, styles, model }: IFieldContainer) {
	const output = items.map((field, index) => {
		if (field.type === 'wrapper') {
			return <FormSectionWrapper key={`rf-row__item--${index}`} data={field} model={model} />;
		}
		return <Control index={index} model={model} field={field} key={`rf-row__item--${index}`} />;
	});

	const attrs = { className: `rf-fields-container`, style: {} };
	attrs.style = { gridTemplateColumns: `${gridStyle}`, ...styles };

	return <div {...attrs}>{output}</div>;
}

/**
 * File: form\ts\view\components\rows\wrapper.tsx
 */
import React from 'react';
import { useWiseFormContext } from '../../context';
/**
 *
 * @param data {WrappedFormModel}
 * @param model {FormModel} parent.
 * @returns
 */
export function FormSectionWrapper({ data, model }) {
	const { formTypes } = useWiseFormContext();

	const types = {
		...formTypes,
	};

	if (!data.control) throw new Error('Wrapper must have a control');
	if (!data.name) {
		console.error('Wrapper must have a name', data);
		return null;
	}

	const wrapperModel = model?.getField(data.name);
	const Control = types[data.control];
	// data = wrapperModel ? { ...data, ...wrapperModel.getProperties() } : data;
	return <Control model={wrapperModel} />;
}

/**
 * File: form\ts\view\components\wrapped-form.tsx
 */
import React from 'react';
import { WrappedWiseFormContext, useWiseFormContext } from '../context';
import { RowFieldContainer } from './rows/row-container';
import { useTemplate } from '../hooks/use-template';

export /*bundle */ function WrappedForm({ children, name, types }): JSX.Element {
	const { model: parent } = useWiseFormContext();
	const wrapper = parent.wrappers.get(name);
	const model = wrapper;
	const template = useTemplate(model.settings);
	const fields = [...model.settings.fields];
	const Containers = template.items.map((num, index) => {
		const items = fields.splice(0, num[0]);
		return <RowFieldContainer template={num} model={model} items={items} key={`rf-row--${index}.${num}`} />;
	});

	const value = {
		model,
		name,
		template,
		formTypes: types ?? {},
		parent,
	};

	return (
		<WrappedWiseFormContext.Provider value={value}>
			{Containers}
			{children}
		</WrappedWiseFormContext.Provider>
	);
}

/**
 * File: form\ts\view\context.tsx
 */
import React from 'react';
import type { FormModel } from '@bgroup/wise-form/models';
export interface IFormContext {
	model?: FormModel;
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

export /*bundle */ interface IWrappedFormContext extends IFormContext {
	parent: IFormContext;
}
const value: IFormContext = {};
export const WiseFormContext = React.createContext(value);
export /*bundle*/ const useWiseFormContext = () => React.useContext(WiseFormContext);

export const WrappedWiseFormContext = React.createContext(value);
export /*bundle*/ const useWrappedWiseFormContext = () => React.useContext(WrappedWiseFormContext);

/**
 * File: form\ts\view\hooks\use-model.ts
 */
import React from 'react';
import { FormModel } from '@bgroup/wise-form/models';
import { useTemplate } from './use-template';

export function useModel(settings, form?: FormModel) {
	const [model, setModel] = React.useState(form);
	const [ready, setReady] = React.useState(false);
	const [values, setValues] = React.useState(form?.values || {});
	const templateSpecs = settings ? settings : form;
	const { type, styles, items } = useTemplate(templateSpecs, templateSpecs.gap);
	const startup = () => {
		setReady(false);
		const onChange = () => {
			setReady(form.ready);
			setValues({ ...form.values });
		};

		if (!form) {
			const properties = settings.fields.map(item => item.name);
			const values = settings.values || {};
			form = new FormModel(settings, { properties, ...values });
		}

		setModel(form);
		form.on('change', onChange);

		onChange();

		return () => {
			form.off('change', onChange);
		};
	};

	React.useEffect(startup, [form?.name]);

	return { ready, model, values, type, styles, items };
}

/**
 * File: form\ts\view\hooks\use-template.tsx
 */
import { IFormTemplate } from '../../interfaces/template';

/**
 * Applies a template to create a structured layout, optionally using a gap between elements.
 *
 * @param template - The template to be applied. Can be an array or an object conforming to the IFormTemplate interface.
 * @param gap - Specifies the gap between elements.
 * The `gap` parameter is deprecated and will be removed in a future version. Use the gap property within the template object instead.
 * @returns An object representing the structured layout with type, styles, and items.
 */
export function useTemplate(settings, gap = undefined) {
	if (!settings?.template) throw new Error(`${settings?.name} Doesn't have a template`);

	let template = settings?.template;
	let structure = template;
	let styles = {};

	if (!template) {
		return {
			type: 'grid',
			styles: {},
			items: settings.fields.map(item => [1, '1fr']),
		};
	}

	if (gap) {
		template = { structure: template, gap: gap } as IFormTemplate;
	}
	const isArray = Array.isArray(template);

	if (!isArray) {
		if (typeof template !== 'object' || !template.structure || !Array.isArray(template.structure)) {
			throw new Error('Template must be an array or an object');
		}
		structure = template.structure;

		styles = template.gap ? { gap: template.gap } : {};
	}

	const processString = str => {
		if (typeof str === 'number') return [1, '1fr'];
		const [num, times] = str.split('x').map(Number);

		const tpl = times
			? [
					times,
					Array(times)
						.fill(num)
						.reduce((acc, v) => `${acc} 1fr`, ''),
			  ]
			: [1, '1fr'];
		return tpl;
	};

	return {
		type: 'grid',
		styles: styles,
		items: structure.map(item => {
			if (!Array.isArray(item)) return processString(item);
			return item;
		}),
	};
}

/**
 * File: form\ts\view\hooks\use-types.ts
 */
import React from 'react';
import { WFSettings } from '@bgroup/wise-form/settings';
import { SelectionField } from '../components/field/selection';
import { Input, Textarea } from 'pragmate-ui/form';

export function useTypes(types) {
	return React.useMemo(() => {
		const defaultTypes = {
			checkbox: SelectionField,
			radio: SelectionField,
			select: SelectionField,
			textarea: Textarea,
			text: Input,
			password: Input,
			default: Input,
		};

		return { ...defaultTypes, ...WFSettings.types, ...types };
	}, [types]);
}

/**
 * File: form\ts\view\index.tsx
 */
import React from 'react';
import { useModel } from './hooks/use-model';
import { WiseFormContext } from './context';
import { useTypes } from './hooks/use-types';

import { IWiseFormSpecs } from '../interfaces/wise-form-specs';
import { Containers } from './components/containers';

export /*bundle */ function WiseForm({ children, settings, types, model }: IWiseFormSpecs): JSX.Element {
	const { ready, model: instance, type, styles, items } = useModel(settings, model);
	const formTypes = useTypes(types);

	if (!ready) return null;

	if (!settings && !model) {
		console.error('the form does not have settings or model defined', settings);
	}

	const onSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		instance.onSubmit(event);
	};

	const value = {
		model: instance,
		items,
		rows: items,
		values: instance.values,
		name: instance.name,
		template: { type, styles, items },
		formTypes,
	};

	return (
		<WiseFormContext.Provider value={value}>
			<form className="reactive-form-container" onSubmit={onSubmit}>
				<Containers />
				{children}
			</form>
		</WiseFormContext.Provider>
	);
}

/**
 * File: formulas\helpers\condition-types.ts
 */
export const conditionsTypes = {
    every: "validateAll",
    some: "validateAny"
}
/**
 * File: formulas\helpers\evaluations.ts
 */
export class EvaluationsManager {
	private static evaluations: Record<string, (value: any, comparisonValue?: any) => boolean> = {
		equal: (value, comparisonValue) => value == comparisonValue,
		lower: (value, comparisonValue) => Number(value) < Number(comparisonValue),
		upper: (value, comparisonValue) => Number(value) > Number(comparisonValue),
		between: (value, [min, max]) => {
			const numValue = Number(value);
			return numValue >= Number(min) && numValue <= Number(max);
		},
		different: (value, comparisonValue) => value != comparisonValue,
		hasValue: value => ![undefined, null, ''].includes(value),
		empty: value => [undefined, null, ''].includes(value),
		lessOrEqual: (value, comparisonValue) => Number(value) <= Number(comparisonValue),
		greaterOrEqual: (value, comparisonValue) => Number(value) >= Number(comparisonValue),
	};

	static validate(identifier: string, value: any, comparisonValue?: any): boolean {
		if (!this.evaluations[identifier]) {
			throw new Error(`Evaluation identifier "${identifier}" not recognized.`);
		}

		const result = this.evaluations[identifier](value, comparisonValue);
		return result;
	}

	/**
   * Evalúa un arreglo de valores para ver si alguno cumple con la condición especificada.
   * Retorna true si al menos uno de los valores cumple con la condición.
   */
	static validateAny(identifier: string, values: any[], comparisonValue?: any): boolean {
		if (!this.evaluations[identifier]) {
			throw new Error(`Evaluation identifier "${identifier}" not recognized.`);
		}
		return values.some(value => this.evaluations[identifier](value, comparisonValue));
	}

	/**
	 * Evalúa un arreglo de valores para ver si todos cumplen con la condición especificada.
	 * Retorna true solo si todos los valores cumplen con la condición.
	 */
	static validateAll(identifier: string, values: any[], comparisonValue?: any): boolean {
		if (!this.evaluations[identifier]) {
			throw new Error(`Evaluation identifier "${identifier}" not recognized.`);
		}
		return values.every(value => this.evaluations[identifier](value, comparisonValue));
	}
}

/**
 * File: formulas\helpers\formula.ts
 */
import { Lexer } from './lexer';
import { Parser } from './parser';
import { Token } from './token';

type ParserData = {
	parser: Parser;
	tokens: Token[];
	[key: string]: any;
};

export class Formula {
	#lexer = new Lexer();
	#parsers: Map<string, ParserData> = new Map();
	#tokens: Token[];
	constructor(data) {
		if (!data.formula) throw new Error('To get a parser you must provide a formula');
		// if (this.#parsers.has(data.formula)) return this.#parsers.get(data.formula);
		const tokens = this.#lexer.tokenize(data.formula);
		const parser = new Parser(tokens);
		const result = { tokens, parser, ...data };
		this.#parsers.set(data.formula, result);
		return result;
	}

	initialize() {}
}

/**
 * File: formulas\helpers\lexer.ts
 */
import { Token } from './token';
import { TokenType } from '../types';

export class Lexer {
	private tokenRegex: RegExp = /\s*(\(|\)|\+|\-|\*|\/|\d+\.\d+|\d+|[A-Za-z_][A-Za-z0-9_]*)\s*/g;
	private flattenTokens: boolean;

	constructor(flattenTokens: boolean = false) {
		this.flattenTokens = flattenTokens;
	}

	tokenize(formula: string): Token[] {
		this.tokenRegex.lastIndex = 0;
		const tokens: Token[] = [];
		const stack: Array<Token[]> = [tokens]; // Stack to manage nested token lists
		let match: RegExpExecArray | null;

		while ((match = this.tokenRegex.exec(formula)) !== null) {
			const tokenValue = match[1];
			let tokenType: TokenType = this.determineTokenType(tokenValue);

			if (tokenType === 'parenthesis') {
				if (tokenValue === '(') {
					if (!this.flattenTokens) {
						// Start a new scope for tokens
						stack.push([]);
					}
				} else {
					if (!this.flattenTokens) {
						// End the current scope
						const subTokens = stack.pop();
						if (!subTokens) {
							throw new Error('Mismatched parentheses in the formula');
						}
						// Create a parenthesis token with these subtokens as children
						const parentTokens = stack[stack.length - 1];
						parentTokens.push(new Token('parenthesis', '()', null, subTokens));
					}
				}
			} else {
				// Add this token to the current scope
				stack[stack.length - 1].push(new Token(tokenType, tokenValue));
			}
		}

		if (stack.length !== 1) {
			throw new Error('Mismatched parentheses in the formula');
		}

		// If flattenTokens is true, flatten all tokens into a single array
		if (this.flattenTokens) {
			return this.flatten(tokens);
		}

		return tokens; // Return the outermost list of tokens
	}

	private determineTokenType(value: string): TokenType {
		const operators = {
			'+': 'operator',
			'-': 'operator',
			'*': 'operator',
			'/': 'operator',
			'(': 'parenthesis',
			')': 'parenthesis',
		};
		return operators[value] || (!isNaN(parseFloat(value)) ? 'number' : 'variable');
	}

	private flatten(tokens: Token[]): Token[] {
		const flatList: Token[] = [];
		for (const token of tokens) {
			if (token.type === 'parenthesis' && token.children) {
				flatList.push(...this.flatten(token.children)); // Flatten nested tokens
			} else {
				flatList.push(token);
			}
		}
		return flatList;
	}
}

/**
 * File: formulas\helpers\parser.ts
 */
import { Token } from './token';

type TokenType = 'variable' | 'number' | 'operator';

/**
 * The Parser class is responsible for parsing a sequence of tokens into an abstract syntax tree (AST).
 * The tokens should be an array of objects with `type` and `value` properties.
 *
 * The Parser handles mathematical expressions and ensures that the tokens are in the correct order
 * for later evaluation. It understands variables, numbers, and parentheses, and is extendable to support
 * additional operations and precedence rules.
 *
 * Example usage:
 * ```
 * const tokens: Token[] = [...];
 * const parser = new Parser(tokens);
 * const ast = parser.parse();
 * ```
 */
export /*bundle */ class Parser {
	private tokens: Token[];
	private currentTokenIndex: number;

	constructor(tokens: Token[]) {
		this.tokens = tokens;
		this.currentTokenIndex = 0;
	}

	public parse(): Token | undefined {
		return this.parseExpression();
	}

	private parseExpression(): Token | undefined {
		let token = this.tokens[this.currentTokenIndex];
		if (token && token.type === 'variable') {
			this.currentTokenIndex++;
			return token;
		} else if (token && token.type === 'number') {
			this.currentTokenIndex++;
			return token;
		} else if (token && token.value === '(') {
			this.currentTokenIndex++; // Skip '('
			let expr = this.parseExpression(); // Parse subexpression
			if (this.tokens[this.currentTokenIndex] && this.tokens[this.currentTokenIndex].value === ')') {
				this.currentTokenIndex++; // Skip ')'
				return expr;
			}
		}
		// TODO: Add cases for parsing different operations (like addition, multiplication etc.)
		// TODO: Implement precedence handling for different operations
		// This function should be extended to fully construct the AST.
		return undefined;
	}
}

/**
 * File: formulas\helpers\token.ts
 */
import { TokenType } from '../types';

/**
 * The Token class now includes a stringValue property for storing the original string value
 * of the expression inside the parentheses and an optional parent property for storing the parent token.
 */
export /*bundle*/ class Token {
	type: TokenType;
	value: string;
	stringValue?: string;
	children?: Token[];
	parent?: Token;

	constructor(type: TokenType, value: string, stringValue?: string, children?: Token[], parent?: Token) {
		this.type = type;
		this.value = value;
		this.stringValue = stringValue;
		this.children = children;
		this.parent = parent;
	}
}

/**
 * File: formulas\index.ts
 */
import { parse } from 'mathjs';
import { EvaluationsManager } from './helpers/evaluations';
import { ReactiveModel } from '@beyond-js/reactive/model';
import { Lexer } from './helpers/lexer';
import { Parser } from './helpers/parser';
import { Token } from './helpers/token';
import { IComplexCondition, IConditionalFormula, FormulaObserver, FormulaType } from './types/formulas';
import { FormulaBasic } from './variants/basic';
import { FormulaConditional } from './variants/conditional';
import { FormulaPerValue } from './variants/per-value';
import { FormulaComparison } from './variants/comparison';
type ParserData = {
	parser: Parser;
	tokens: Token[];
	[key: string]: any;
};
export /*bundle */ class FormulaManager extends ReactiveModel<FormulaManager> {
	#lexer = new Lexer(true);

	#tokens: Token[];
	get tokens() {
		return this.#tokens;
	}
	#parser: Parser;
	get parser() {
		return this.#parser;
	}

	#specs: FormulaObserver;
	get formula() {
		return this.#specs.formula;
	}
	get name() {
		return this.#specs.name;
	}

	get conditional() {
		return typeof this.#specs.formula === 'object';
	}

	get conditions() {
		if (typeof this.#specs.formula === 'string') return;
		const formula = this.#specs.formula as IComplexCondition;
		return formula.conditions;
	}

	/**
	 *  Represents the fields defined in the plugin settings
	 */
	get fields() {
		const formula = <IComplexCondition>this.formula;
		return typeof formula?.fields === 'string' ? [formula?.fields] : formula?.fields;
	}

	#parsedBase;
	get parsedBase() {
		return this.#parsedBase;
	}
	#type: string;
	get type() {
		return this.#type;
	}

	get base() {
		const formula = <IComplexCondition>this.#specs.formula;
		return formula.base;
	}

	#variables: string[] = [];
	get variables() {
		return this.#variables;
	}

	get value() {
		return this.#instance.value;
	}

	#parsers: Map<string, ParserData> = new Map();
	#plugin: any;
	#instance: any;

	constructor(plugin, specs) {
		super();
		this.#plugin = plugin;
		this.#specs = specs;
		this.#initialize();
	}

	#initialize() {
		this.#type = this.getType();

		const objects = {
			basic: FormulaBasic,
			'base-conditional': FormulaConditional,
			'value-conditions': FormulaPerValue,
			comparison: FormulaComparison,
		};

		if (!objects[this.type]) {
			throw new Error(`this type ${this.type} not found`);
		}

		this.#instance = new objects[this.type](this, this.#plugin, this.#specs);
	}

	initialize() {
		this.#instance.initialize();
	}
	/**
	 * Returns the models that are part of the formula
	 * The models could be fields or formulas
	 * @param variables
	 * @returns
	 */
	getModels(variables: string[]) {
		return variables.map(name => {
			if (this.#plugin.formulas.has(name)) return this.#plugin.formulas.get(name);
			return this.#plugin.form.getField(name);
		});
	}

	private getType(): FormulaType {
		const { type, formula } = this.#specs;
		if (type) return type;
		if (typeof formula === 'string') return 'basic';
		if (formula.conditions) return formula.base ? 'base-conditional' : 'value-conditions';
	}

	processConditional() {
		const formula = <IComplexCondition>this.formula;
		if (this.base) {
			this.#parsedBase = this.getParser({ formula: this.base });
		}
	}
	calculate() {
		if (!this.#instance || this.#instance.calculate) {
			console.warn('No instance or calculate method found', this.#instance);
		}
		this.#instance.calculate();

		this.trigger('change');
		return;
	}

	/**
	 * Returns the parser for the formula, if the parser is already created it will return the memoized parser
	 *
	 *
	 * The formula is tokenized and parsed to create a parser instance
	 * the object returned contains the tokens, the parser and the formula
	 * @param data Receives the formula to be parsed
	 * @returns
	 */
	getParser(data): ParserData {
		if (!data.formula) throw new Error('To get a parser you must provide a formula');
		if (this.#parsers.has(data.formula)) return this.#parsers.get(data.formula);
		const tokens = this.#lexer.tokenize(data.formula);
		const parser = new Parser(tokens);
		const result = { tokens, parser, ...data };

		this.#parsers.set(data.formula, result);
		return result;
	}

	getParams(variables: string[]) {
		const params = {};
		const { form, formulas } = this.#plugin;
		const build = value => {
			/**
			 * the value could be a formula or a field
			 */
			const element = formulas.has(value) ? formulas.get(value) : form.getField(value);
			if (!element)
				throw new Error(`Field ${value} used in formula ${this.name}, not found in form ${form.name}, `);

			params[value] = [undefined, '', null, NaN].includes(element.value) ? 0 : element.value;
		};
		variables.forEach(build);

		return params;
	}

	/**
	 * A form can have multiple formulas, this method will create an instance of the formula manager
	 * and memoize it to avoid creating multiple instances of the same formula.
	 * @param specs
	 * @returns
	 */
	static async create(plugin, specs) {
		const instance = new FormulaManager(plugin, specs);
		// FormulaManager.instances.set(plugin.form.name, instance);
		return instance;
	}
}

/**
 * File: formulas\types\formulas.ts
 */
import type { Parser } from '../helpers/parser';
import type { Token } from '../helpers/token';

export interface ISimpleFormula {
	name: string;
	formula: string;
	type?: FormulaType;
	emptyValue?: string | number;
	fields?: FormulaFields;
}

export interface IFormulaCondition {
	condition: 'hasValue' | 'upper' | 'lower' | 'equal' | 'different' | 'between' | 'lessOrEqual' | 'greaterOrEqual';
	value?: string | number | [number, number];
	formula: string;
	conditions?: IConditionalField[],
	fields?: string[]
}

type FormulaFields = string | string[];
export type EvaluatedFormula = { value?: string | number; formula: string; condition?: string };
export interface IConditionalFormula { }

export interface IConditionalField {
	field?: string | string[];
	condition?: string;
	values?: [EvaluatedFormula];
	conditions?: IFormulaCondition[];
	fields?: string[];
	formula?: string;
	type?: string,
	value: string | number
}

export interface IComplexCondition {
	fields: FormulaFields;
	base?: string;
	conditions: IConditionalField[];
}

export interface IConditionalFormula {
	name: string;
	type?: FormulaType;
	fields?: FormulaFields;
	formula: IComplexCondition | string;
	conditions?: IConditionalField[];
	emptyValue?: string | number
}

export type ParserData = {
	parser: Parser;
	tokens: Token[];
	[key: string]: any;
};

export type FormulaType = 'basic' | 'base-conditional' | 'value-conditions' | undefined;

export type FormulaObserver = ISimpleFormula | IConditionalFormula;

/**
 * File: formulas\types\index.ts
 */
/**
 * Defines the type of token based on the part of the expression it represents.
 */
export type TokenType = 'variable' | 'number' | 'operator' | 'parenthesis';

/**
 * File: formulas\variants\base.ts
 */
export abstract class WiseFormFormulaPlugin {
	abstract initialize(): void;
	abstract validate(): void;
	abstract calculate(): void;
}

/**
 * File: formulas\variants\basic.ts
 */
import type { FormulaManager } from '..';
import { EvaluationsManager } from '../helpers/evaluations';
import { Token } from '../helpers/token';
import { EvaluatedFormula, FormulaObserver, IComplexCondition, IConditionalField } from '../types/formulas';
import { parse } from 'mathjs';

export class FormulaBasic {
	#plugin: any;
	#specs: FormulaObserver;
	#tokens: Token[];
	get formula() {
		return this.#specs.formula;
	}
	get base() {
		const formula = <IComplexCondition>this.#specs.formula;
		return formula.base;
	}
	#value: string | number | undefined | 0;
	get value() {
		return this.#value;
	}
	get name() {
		return this.#specs.name;
	}
	/**
	 *  Represents the fields defined in the plugin settings
	 */
	get fields() {
		const formula = <IComplexCondition>this.formula;
		return typeof formula?.fields === 'string' ? [formula?.fields] : formula?.fields;
	}

	get conditions() {
		if (typeof this.#specs.formula === 'string') return;
		const formula = this.#specs.formula as IComplexCondition;
		return formula.conditions;
	}

	#emptyValue: undefined;
	#variables: string[] = [];
	get variables() {
		return this.#variables;
	}

	#round: boolean;

	#parent: FormulaManager;
	constructor(parent, plugin, specs) {
		this.#parent = parent;
		this.#plugin = plugin;
		this.#specs = specs;
		this.#round = specs.round;
		if (this.#specs.emptyValue) this.#emptyValue = this.#specs.emptyValue;
	}

	initialize() {
		const { tokens } = this.#parent.getParser(this.#specs);
		this.#tokens = tokens;
		const variables = this.#tokens.filter(token => token.type === 'variable').map(item => item.value);
		this.#variables = variables;
		const models = this.#parent.getModels(variables);
		models.forEach(model => {
			if ([undefined].includes(model)) {
				return;
			}

			model.on('change', this.calculate.bind(this));
		});
	}

	calculate() {
		const variables = this.#variables;

		const formulaField = this.#plugin.form.getField(this.name);

		let params = this.#parent.getParams(variables);
		const models = this.#parent.getModels(variables);

		const empty = (models as any[]).every(model => [null, undefined, ''].includes(model.value));

		if (empty) {
			// If all models are empty, set the input to empty if exists.
			if (formulaField) formulaField.set({ value: '' });
			this.#value = undefined;
			return;
		}

		try {
			let result = models.length === 1 ? models[0].value : parse(this.formula as string).evaluate(params);
			const isInvalidResult = [-Infinity, Infinity, undefined, null, NaN].includes(result);
			if (this.#round && !isInvalidResult) result = Math.round(result);
			this.#value = isInvalidResult ? this.#emptyValue : Number(result.toFixed(2));
			if (formulaField) formulaField.set({ value: this.#value });

			this.#parent.trigger('change');
		} catch (e) {
			console.log('formula', this.name, this.formula, params);
			console.trace(e);
			throw new Error(`Error calculating the formula: ${e.message}`);
		}
	}
}

/**
 * File: formulas\variants\comparison.ts
 */
import type { FormulaManager } from '..';
import { EvaluationsManager } from '../helpers/evaluations';

import { Token } from '../helpers/token';
import { FormulaObserver, IComplexCondition, IConditionalField } from '../types/formulas';
import { number, parse } from 'mathjs';

export class FormulaComparison {
	#plugin: any;
	#specs: FormulaObserver;
	#emptyValue: undefined;
	#tokens: Token[];
	get formula() {
		return this.#specs.formula;
	}
	get base() {
		const formula = <IComplexCondition>this.#specs.formula;
		return formula.base;
	}
	#value: string | number | undefined | 0;
	get value() {
		return this.#value;
	}
	get name() {
		return this.#specs.name;
	}
	/**
	 *  Represents the fields defined in the plugin settings
	 */
	get fields() {
		const formula = <IComplexCondition>this.formula;
		return typeof formula?.fields === 'string' ? [formula?.fields] : formula?.fields;
	}

	get conditions() {
		if (typeof this.#specs.formula === 'string') return;
		const formula = this.#specs.formula as IComplexCondition;
		return formula.conditions;
	}

	#variables: string[] = [];
	get variables() {
		return this.#variables;
	}

	#parent: FormulaManager;
	constructor(parent, plugin, specs) {
		this.#parent = parent;
		this.#plugin = plugin;
		this.#specs = specs;
	}

	initialize() {
		if (!Array.isArray(this.#specs.fields)) {
			throw new Error('The fields property must be an array');
		}
		const models = this.#parent.getModels(this.#specs.fields);
		models.forEach(model => model.on('change', this.calculate.bind(this)));
	}

	start() { }

	evaluate() {
		const formula = <IComplexCondition>this.#specs.formula;

		if (typeof formula === 'string' || !formula.conditions) {
			console.error('Invalid formula configuration');
			return null;
		}
		const models = this.#parent.getModels(this.#specs.fields);
		let fieldValues = models.map(fieldModel => {
			if (!fieldModel) return
			return { name: fieldModel.name, value: fieldModel ? fieldModel.value : null };
		});

		// Utilizar reduce para comparar cada par de valores consecutivos y determinar cuál cumple la condición
		const resultField = fieldValues.reduce((prevField, currentField) => {
			if (!prevField) return currentField;

			// Si el campo previo cumple la condición con respecto al actual, se mantiene como el campo elegido
			if (EvaluationsManager.validate(formula.condition, prevField.value, currentField.value)) {
				return prevField;
			}
			// De lo contrario, el campo actual se convierte en el nuevo campo elegido
			return currentField;
		}, null);

		if (resultField) {
			// Ajustar según la lógica específica deseada, como devolver una fórmula particular basada en el resultado
			return resultField;
		} else {
			// Manejar el caso de que ninguno cumpla la condición
			return null;
		}
	}


	calculate() {
		let applied = this.evaluate();
		if (!applied) {
			// any formula apply, so we need to reset the value
			this.#value = 0;
			return;
		}
		/**
		 * Get the formula analyzer
		 */

		const formulaString = this.#specs.formula.conditions[applied.name];
		const formula = this.#parent.getParser({ formula: formulaString });
		const variables = formula.tokens.filter(token => token.type === 'variable').map(item => item.value);
		const params = this.#parent.getParams(variables);

		try {
			const keys = Object.keys(params);
			const result = keys.length === 1 ? params[keys[0]] : parse(this.formula as string).evaluate(params);

			this.#value = [-Infinity, Infinity, undefined, null, NaN].includes(result) ? this.#emptyValue : Number(result.toFixed(2));;
			this.#parent.trigger('change');
			return this.#value;
		} catch (e) {
			console.log('formula', this.name, this.formula, params);
			throw new Error('Error calculating the formula');
		}
	}

	calculateUpper(models) {
		let glue;
		models.forEach(item => {
			if (Number(item.value) > Number(glue?.value ?? 0)) glue = item;
		});

		return glue;
	}
}

/**
 * File: formulas\variants\conditional.ts
 */
import type { FormulaManager } from '..';
import { conditionsTypes } from '../helpers/condition-types';
import { EvaluationsManager } from '../helpers/evaluations';
import { EvaluatedFormula, FormulaObserver, IComplexCondition, IConditionalField } from '../types/formulas';
import { parse } from 'mathjs';

export class FormulaConditional {
	#plugin: any;
	#specs: FormulaObserver;
	#emptyValue: undefined;
	get formula() {
		return this.#specs.formula;
	}
	get base() {
		const formula = <IComplexCondition>this.#specs.formula;
		return formula.base;
	}
	#value: string | number | undefined | 0;
	get value() {
		return this.#value;
	}
	get name() {
		return this.#specs.name;
	}
	/**
	 *  Represents the fields defined in the plugin settings
	 */
	get fields() {
		const formula = <IComplexCondition>this.formula;
		return typeof formula?.fields === 'string' ? [formula?.fields] : formula?.fields;
	}

	get conditions() {
		if (typeof this.#specs.formula === 'string') return;
		const formula = this.#specs.formula as IComplexCondition;
		return formula.conditions;
	}

	/**
	 * FormField type
	 */
	#fields: any;

	#parent: FormulaManager;

	#round: boolean
	constructor(parent, plugin, specs) {
		this.#parent = parent;
		this.#plugin = plugin;
		this.#specs = specs;
		this.#round = specs.round
	}

	initialize() {
		try {
			const { form } = this.#plugin;

			if (!this.fields) {
				throw new Error(`Fields not found in formula ${this.name}`);
			}
			const fields = this.fields.map(name => form.getField(name));
			this.#fields = fields;

			fields.forEach(field => {
				if (!field) {
					throw new Error(`Field ${this.name} not found in form ${form.name}`);
				}
				field.on('change', this.calculate.bind(this));
			});
		} catch (e) { }
	}

	evaluate() {
		const formula = <IComplexCondition>this.#specs.formula;
		let evaluatedFormula: any = { formula: formula.base }; // Use the base formula by default
		if (formula.conditions) {
			for (const condition of formula.conditions) {
				let conditionMet = false;
				if (condition.conditions) {
					// If there are nested conditions, all must be met
					conditionMet = condition.conditions.every((subCondition) => {
						const fieldValues = subCondition.fields.map(fieldName => {
							const field = this.#fields.find(f => f.name === fieldName);
							return field ? field.value : this.#emptyValue;
						});
						return EvaluationsManager.validateAll(subCondition.condition, fieldValues, subCondition.value)
					});
				} else {
					const fieldValues = condition.fields.map(fieldName => {
						const field = this.#fields.find(f => f.name === fieldName);
						return field ? field.value : this.#emptyValue;
					});
					const conditionType = !!condition.type && conditionsTypes[condition.type] ? conditionsTypes[condition.type] : conditionsTypes.some;
					// Check if any of the specified fields meet the condition
					conditionMet = EvaluationsManager[conditionType](condition.condition, fieldValues, condition.value);
				}

				if (conditionMet) {
					evaluatedFormula.formula = condition.formula;
					evaluatedFormula.fi = condition
					break;
				}
			}
		}

		return evaluatedFormula;
	}

	calculate() {

		/**
		 * the formula is taken from the evaluate method since the conditions are evaluated there and
		 * can change the formula to be applied
		 */
		const formula = this.evaluate();

		// todo: Review if this section can be replaced by formulaManager.variables property.
		const { tokens } = this.#parent.getParser(formula);
		const variables = tokens.filter(token => token.type === 'variable').map(item => item.value);
		const params = this.#parent.getParams(variables);
		try {
			const keys = Object.keys(params);
			let result = keys.length === 1 ? params[keys[0]] : parse(formula.formula as string).evaluate(params);
			const isInvalidResult = [-Infinity, Infinity, undefined, null, NaN].includes(result)
			if (this.#round && !isInvalidResult) result = Math.round(result)

			this.#value = isInvalidResult || typeof result === "object" ? this.#emptyValue : Number(result.toFixed(2));

			this.#parent.trigger('change');

			const model = this.#plugin.form.getField(this.name);
			model && model.set({ value: this.#value });
			return this.#value;
		} catch (e) {
			console.log('formula', this.name, formula.formula, params);
			console.error(e);
			throw new Error('Error calculating the formula');
		}
	}
}

/**
 * File: formulas\variants\per-value.ts
 */
import type { FormulaManager } from '../';
import { EvaluationsManager } from '../helpers/evaluations';
import { Parser } from '../helpers/parser';
import { FormulaObserver, IComplexCondition, ParserData } from '../types/formulas';
import { filter, parse } from 'mathjs';

export class FormulaPerValue {
	#plugin: any;
	#emptyValue: undefined;
	#specs: FormulaObserver;
	get formula() {
		return this.#specs.formula;
	}
	#value: string | number | undefined | 0;
	get value() {
		return this.#value;
	}
	get name() {
		return this.#specs.name;
	};

	#observers: string[];
	get observers() {
		return this.#observers
	}
	/**
	 *  Represents the fields defined in the plugin settings
	 */
	get fields() {
		const formula = <IComplexCondition>this.formula;
		return typeof formula?.fields === 'string' ? [formula?.fields] : formula?.fields;
	}

	get conditions() {
		if (typeof this.#specs.formula === 'string') return;
		const formula = this.#specs.formula as IComplexCondition;
		return formula.conditions;
	}

	#parent: FormulaManager;
	#parsers: ParserData[];
	#mainFields: any[];

	constructor(parent, plugin, specs) {
		this.#parent = parent;
		this.#plugin = plugin;
		this.#specs = specs;
		this.#observers = specs.formula.observers
	}

	initialize() {
		const { form } = this.#plugin;
		const fields = new Set<string>();

		this.#mainFields = this.#parent.getModels(this.fields);

		/**
		 * The method will iterate over the conditions to get the parser for each value
		 * and get access to the fields that are part of the formula and be able to evaluate it
		 * changes.
		 */
		this.conditions.forEach(condition => {
			if (!condition.condition) {
				throw new Error('the formula per value must contain a condition property in the condition`s item');
			}
			if (!condition.values) {
				throw new Error('the formula per value must contain a values property in the condition`s item');
			}

			const parsers = condition.values.map(item => this.#parent.getParser(item));
			this.#parsers = parsers;
			parsers.forEach(parser => {
				parser.tokens.filter(token => token.type === 'variable').forEach(token => fields.add(token.value));
			});
		});

		fields.forEach(field => {
			const model = form.getField(field);
			if (model) model.on('change', this.listenConditionals.bind(this));
		});

		this.listenConditionals();
		this.#mainFields.forEach(item => item.on('change', this.calculate.bind(this)));
		if (this.#observers && Array.isArray(this.#observers) && !!this.#observers.length) {
			const fields = this.#parent.getModels(this.#observers);
			fields.forEach(field => {
				if (!field) return;
				field.on("change", this.calculateAll.bind(this))
			})
		}
	}

	calculateAll() {
		this.#mainFields.forEach(field => this.calculate(field));
	}
	listenConditionals() {
		this.#mainFields.forEach(field => {
			if (!field) return
			field.on('change', this.calculate.bind(this));
		});
	}

	calculate(field) {
		const { form } = this.#plugin;
		const formula = this.evaluate(field.value);

		if (!formula) return;

		const variables = formula.tokens.filter(token => token.type === 'variable').map(item => item.value);
		const params = this.#parent.getParams(variables);
		const formulaField = form.getField(this.name);

		try {
			const keys = Object.keys(params);
			const result = keys.length === 1 ? params[keys[0]] : parse(formula.formula as string).evaluate(params);
			this.#value = [-Infinity, Infinity, undefined, null, NaN].includes(result) ? this.#emptyValue : Number(result.toFixed(2));;
			formulaField && formulaField.set({ value: this.#value });
			this.#parent.trigger('change');
		} catch (e) {
			console.log(e);
			throw new Error('Error calculating the formula');
		}
	}

	evaluate(value) {
		let formula = undefined;
		if ([null, undefined].includes(value)) {
			return;
		}
		this.conditions.forEach(item => {
			const { condition, values } = item;
			if (!condition) {
				throw new Error('the formula per value must contain a condition property in the condition`s item');
			}
			if (!values) {
				throw new Error('the formula per value must contain a values property in the condition`s item');
			}
			const index = values.findIndex(item => EvaluationsManager.validate(condition, value, item.value));

			if (index > -1) formula = this.#parent.getParser(values[index]);
		});

		return formula;
	}
}

/**
 * File: models\actions-manager.ts
 */
/**
 * Manages default actions for form fields, facilitating common field interactions this is the default callbacks functionalitu
 */
export class ActionManager {}

/**
 * File: models\base.ts
 */
import { ReactiveModel } from '@beyond-js/reactive/model';
import type { WrappedFormModel } from './wrapper';
import { FormField } from './field';
import { PendingPromise } from '@beyond-js/kernel/core';

export class BaseWiseModel extends ReactiveModel<BaseWiseModel> {
	#settings;
	get settings() {
		return this.#settings;
	}

	set settings(value) {
		this.#settings = value;
	}

	#callbacks: Record<string, (...args) => void> = {};
	get callbacks() {
		return this.#callbacks;
	}
	#initialValues: Record<string, string> = {};
	get originalValues() {
		return this.#initialValues;
	}

	get name() {
		return this.#settings.name;
	}
	get template() {
		return this.#settings.template;
	}

	#wrappers: Map<string, WrappedFormModel> = new Map();
	get wrappers() {
		return this.#wrappers;
	}

	set wrappers(value) {
		this.#wrappers = value;
	}

	#fields: Map<string, FormField | WrappedFormModel> = new Map();
	get fields() {
		return this.#fields;
	}
	get values() {
		const data = {};
		this.#fields.forEach((field, key) => {
			data[key] = field.value;
		});
		return data;
	}

	#specs;
	get specs() {
		return this.#specs;
	}
	set specs(value) {
		this.#specs = value;
	}

	protected loadedPromise: PendingPromise<boolean> = new PendingPromise();
	protected childWrappersReady: number = 0;

	constructor(settings, reactiveProps?) {
		super(settings);

		this.#settings = settings;
		this.#callbacks = settings.callbacks ?? {};
	}

	/**
	 * Sets the value of a specified field within the wrapper. If the field exists, its value is updated.
	 * @param {string} name - The name of the field to update.
	 * @param {any} value - The new value for the field.
	 */
	setField(name: string, value) {
		if (!this.getField(name)) {
			console.error('Field not found', name, this.settings.name, this.fields.keys());
			return;
		}

		this.getField(name).set({ value });
	}

	/**
	 * Examines each field for dependencies and sets up listeners to respond to changes in dependent fields. This ensures dynamic interactions within the form based on field dependencies.
	 * @param {FormField|WrappedFormModel} instance - The field or wrapper instance to check for dependencies.
	 */
	listenDependencies = instance => {
		if (!instance?.specs?.dependentOn?.length) return;
		const checkField = item => {
			const DEFAULT = {
				type: 'change',
			};

			const dependency = this.getField(item.field);

			['field', 'callback'].forEach(prop => {
				if (!item[prop]) throw new Error(`${item?.field} is missing ${prop}`);
			});

			if (!dependency) throw new Error(`${item?.field} is not a registered field`);

			const settings = { ...DEFAULT, ...item };
			if (!this.callbacks[item.callback]) {
				throw new Error(`${item.callback} is not  a registered callback ${item.name}`);
			}

			const callback = this.callbacks[item.callback];
			callback({ dependency, settings, field: instance, form: this });
		};

		instance?.specs?.dependentOn.forEach(checkField);
	};

	/**
	 * Retrieves a field or nested wrapper by name. Supports dot notation for accessing deeply nested fields.
	 * @param {string} name - The name of the field or nested wrapper to retrieve.
	 * @returns {FormField | WrappedFormModel | undefined} The requested instance, or undefined if not found.
	 */
	getField(name: string) {
		if (!name) return console.warn('You need to provide a name to get a field in form ', this.#settings.name);

		if (!name.includes('.')) {
			let field = this.#fields.get(name);

			if (!field) {
				this.#wrappers.forEach(item => {
					const foundField = item.getField(name);
					if (foundField) field = foundField;
				});
			}
			return field;
		}

		const [wrapperName, ...others] = name.split('.');
		const currentWrapper = this.#wrappers.get(wrapperName);

		const otherWrapper = others.join('.');
		return currentWrapper.getField(otherWrapper);
	}

	/**
	 * Clears all fields within the wrapper, resetting their values to their initial state.
	 */
	clear = () => {
		this.fields.forEach(field => field.clear());
		this.triggerEvent();
		this.triggerEvent('clear');
	};
}

/**
 * File: models\field.ts
 */
import { ReactiveModel } from '@beyond-js/reactive/model';
import type { WrappedFormModel } from './wrapper';
import type { FormModel } from './model';
import { IFormField, IFormFieldProps } from './types/form-field';
import { IDisabled } from './types/disabled';

/**
 * Represents a single form field within a `FormModel` or `WrappedFormModel`, providing mechanisms for data binding, validation, and interaction.
 * This class extends `ReactiveModel` to enable reactive updates and interactions within the form's lifecycle.
 *
 * @extends ReactiveModel<IFormField>
 */
export class FormField extends ReactiveModel<IFormField> {
	// The parent model, either FormModel or WrappedFormModel, containing this field.
	#parent: WrappedFormModel | FormModel;

	// Can be a boolean or an object specifying dynamic disablingvas logic based on other fields' values.
	#disabled: boolean | IDisabled = false;

	/**
	 * Evaluates and returns the disabled state of the field. If `#disabled` is an object, it checks the specified fields' values to determine the disabled state dynamically.
	 * @returns {boolean} The disabled state of the field.
	 */
	get disabled() {
		if (typeof this.#disabled !== 'object' || !this.#disabled?.fields) return this.#disabled;

		const validate = field => {
			if (typeof field !== 'object') return !this.#parent.form.getField(field).value;
			const { name, value } = field;
			const { value: fieldValue } = this.#parent.getField(name);
			return value !== fieldValue;
		};

		return this.#disabled.fields.some(validate);
	}

	set disabled(value) {
		if (value === this.#disabled) return;
		this.#disabled = value;
		this.triggerEvent();
	}

	// Field specifications including its type, validation rules, and other metadata.
	#specs: Record<string, any>;
	get specs() {
		return this.#specs;
	}

	get attributes() {
		const props = this.getProperties();
		return {
			...props,
			disabled: this.#disabled,
		};
	}

	// Tracks other fields this field listens to for changes, enabling reactive behavior and allowing the cleanup of event listeners.
	#listeningItems = new Map();

	/**
	 * Constructs a FormField instance with specified properties and parent form model.
	 * @param {Object} params - Construction parameters including the parent form model and field specifications.
	 */
	constructor({ parent, specs }: { parent; specs: IFormFieldProps }) {
		let { properties, disabled, ...props } = specs;

		super({
			...props,
			properties: [
				'name',
				'type',
				'placeholder',
				'required',
				'label',
				'variant',
				'value',
				'options',
				'className',
				'checked',
				'id',
				'icon',
				...properties,
			],
		});

		this.__instanceID = `${specs.name}.${this.generateRandomNumber()}`;

		this.#specs = specs;
		this.#parent = parent;
		this.__instance = Math.random();

		const toSet: Record<string, any> = {};
		Object.keys(props).forEach(key => {
			if (key === 'properties') return;

			if (typeof props[key] === 'string' && props[key]?.includes('state:')) {
				const state = props[key].split('state:')[1];
				if (state === 'create' && !this.#parent.form.update) {
					props[key] = true;
				}
			}
			toSet[key] = props[key];
		});
		//	this.#disabled = disabled
		this.set(toSet);
	}
	generateRandomNumber = () => {
		return Math.floor(Math.random() * (1000000 - 10000 + 1)) + 10000;
	};

	/**
	 * Performs initial setup based on the field's specifications, setting up validation, default values, and any specified dynamic behavior.
	 */
	initialize = () => {
		this.checkSettings(this.#specs);
	};

	/**
	 * Resets the field to its initial value and state, including resetting the disabled state if it's statically defined.
	 */
	clear = () => {
		const initValues = this.initialValues();
		this.set(initValues);
		if (initValues.hasOwnProperty('disabled')) this.disabled = initValues.disabled;
		this.triggerEvent('clear');
	};

	/**
	 * Listens to changes in sibling fields (specified in dynamic disabling logic) and updates its state accordingly.
	 */
	#listenSiblings = () => {
		this.triggerEvent('change');
	};

	/**
	 * Checks and applies the field's settings, particularly for dynamic disabling, establishing listeners on related fields as necessary.
	 * @param {Object} props - The field's properties and settings to check and apply.
	 */
	checkSettings(props) {
		if (props.hasOwnProperty('disabled')) {
			if (typeof props.disabled === 'boolean') {
				this.#disabled = props.disabled;
				return;
			}

			if (typeof props.disabled !== 'object') {
				throw new Error(`The disabled property of the field ${props.name} must be a boolean or an object`);
			}
			if (!props.disabled.fields && !props.disabled.mode) {
				throw new Error(
					`The disabled property of the field ${props.name} must have a fields property or a mode defined`
				);
			}

			if (props.disabled.mode) {
				// posible modes : create, update;
				this.#disabled = this.#parent.form.mode === props.disabled.mode;
				return;
			}

			let allValid;
			props.disabled.fields.forEach(item => {
				const name = typeof item === 'string' ? item : item.name;

				const instance = this.#parent.form.getField(name);
				allValid = instance;
				if (!allValid) return;
				instance.on('change', this.#listenSiblings);
				this.#listeningItems.set(name, { item: instance, listener: this.#listenSiblings });
			});

			if (!allValid) {
				throw new Error(
					`the field ${allValid} does not exist in the form ${
						this.#parent.name
					}, field passed in invalid settings of field "${this.name}"`
				);
			}
			this.#disabled = props.disabled;
		}
	}

	/**
	 * Cleans up any established listeners and internal state when the field is removed or the form is reset, ensuring no memory leaks or stale data.
	 */
	cleanUp() {
		this.#listeningItems.forEach(({ item, listener }) => item.off('change', listener));
		// todo: remove all events
	}

	/**
	 * The `set` method sets one or more properties on the model.
	 *
	 *
	 * This method overwrites the original reactiveModel set to pass the object as param
	 * when the change event is fired.
	 * Eventually this method will be removed and the original set method will be used, but
	 * it requires an upgrade in the reactive model package.
	 * @param {keyof ReactiveModelPublic<T>} property - The name of the property to set.
	 * @param {*} value - The value to set the property to.
	 * @returns {void}
	 */
	set(properties): void {
		let updated = false;
		try {
			Object.keys(properties).forEach(prop => {
				if (!this.properties || !this.properties.includes(prop)) return;
				const sameObject =
					typeof properties[prop] === 'object' &&
					JSON.stringify(properties[prop]) === JSON.stringify(this[prop]);

				if (this[prop] === properties[prop] || sameObject) return;
				const descriptor = Object.getOwnPropertyDescriptor(this, prop);
				if (descriptor?.set) return;

				this[prop] = properties[prop];
				updated = true;
			});
		} catch (e) {
			throw new Error(`Error setting properties: ${e}`);
		} finally {
			if (updated) this.trigger('change', this);
		}
	}

	hide = () => {
		if (!this.className) this.className = '';
		const isHidden = this.className.includes('hidden');
		const cls = isHidden ? this.className : `${this.className} hidden`;
		if (cls !== this.className) this.set({ className: cls });
	};

	show = () => {
		if (!this.className) this.className = '';
		const isHidden = this.className.includes('hidden');
		const cls = isHidden ? this.className.replaceAll(/\bhidden\b/g, '').trim() : this.className;
		if (cls !== this.className) this.set({ className: cls });
	};
}

/**
 * File: models\model.ts
 */
import { FormField } from './field';
import { WrappedFormModel } from './wrapper';
import { BaseWiseModel } from './base';
import { PluginsManager } from './plugins';

export /*bundle*/
class FormModel extends BaseWiseModel {
	#childWrappers: number = 0;
	#plugins: PluginsManager;
	get plugins() {
		return this.#plugins;
	}

	/**
	 * since the fields can be children of the model or a
	 * wrapper, this method is used to get the form model
	 */
	get form() {
		return this;
	}
	#mode: string;
	get mode() {
		return this.#mode;
	}
	#update: boolean;
	get update() {
		return this.#update;
	}
	/**
	 * Initializes a new instance of the `FormModel`, setting up the initial state, including field configurations,
	 * callbacks, and reactive properties. This constructor also triggers the asynchronous setup process for the form.
	 *
	 * @param {Object} settings The configuration settings for the form, including fields, default values, and callbacks.
	 * @param {Object} [reactiveProps] Optional reactive properties to enhance the form's reactivity.
	 */
	constructor(settings, reactiveProps?) {
		super(settings, reactiveProps);
		this.#startup(settings);
		if (!globalThis._wiseForms) globalThis._wiseForms = [];
		globalThis._wiseForms.push(this);
		this.#update = settings.update;
		this.#mode = this.#update ? 'update' : 'create';
	}

	#startup = async settings => {
		const values = settings?.values || {};
		const createItems = item => {
			const instance = this.#getFieldModel(item, values);
			const onChange = () => (this[item.name] = instance.value);
			instance.on('change', onChange);
			this.fields.set(item.name, instance);
		};

		this.settings.fields.map(createItems);

		await this.#checkReady();
		this.#configFields();
		// todo: @everyone Define if is required to wait for the plugins to be ready.
		this.#plugins = new PluginsManager(this);
		this.ready = true;
		this.specs = settings;
		this.trigger('change');
	};

	/**
	 * Checks if all wrappers and fields within the form are loaded and sets the form to a loaded state. This method ensures that the form is fully operational before any interaction.
	 * Its used for the start to listen the dependencies
	 */
	#checkReady = () => {
		const onReady = () => {
			const areAllWrappersLoaded = this.childWrappersReady === this.#childWrappers;

			if (!areAllWrappersLoaded) {
				this.childWrappersReady = this.childWrappersReady + 1;
				return;
			}

			this.loaded = true;
			this.loadedPromise.resolve(true);
			this.off('wrappers.children.loaded', onReady);
		};

		if (this.loaded) return this.loaded;

		if (!this.wrappers.size) {
			onReady();
			return this.loaded;
		}

		this.on('wrappers.children.loaded', onReady);
		return this.loadedPromise;
	};

	/**
	 * Configures all fields by initializing them and setting up dependencies. This method ensures that each field is ready for interaction and that any field dependencies are respected.
	 */
	#configFields = () => {
		this.fields.forEach(this.#listenDependencies);
		this.fields.forEach(field => field.initialize());
	};

	/**
	 * Creates a new instance of a field or a wrapper based on the provided item configuration. It initializes the field or wrapper with specified values and properties.
	 * @param {Object} item - The field or wrapper configuration.
	 * @param {Object} values - The initial values for the fields.
	 * @returns {FormField|WrappedFormModel} A new field or wrapper instance.
	 */
	#getFieldModel = (item, values: Record<string, unknown>) => {
		let externalValues: Record<string, any> = {};

		// @todo: @veD-tnayrB: Review this code and document it
		if (Array.isArray(item?.properties)) {
			item?.properties.forEach(item => (externalValues[item.name] = item.value));
		}
		if (item.type === 'wrapper') return this.#getWrapper(item);
		const instance = new FormField({
			parent: this,
			specs: {
				...item,
				value: values[item.name] || item?.value,
				properties: item?.properties || [],
			},
		});

		if (item?.properties) {
			let toSet = {};
			item?.properties.forEach(property => (toSet[property] = item[property] || ''));
			instance.set(toSet);
		}

		return instance;
	};

	/**
	 * Examines each field for dependencies and sets up listeners to respond to changes in dependent fields. This ensures dynamic interactions within the form based on field dependencies.
	 * @param {FormField|WrappedFormModel} instance - The field or wrapper instance to check for dependencies.
	 */
	#listenDependencies = instance => {
		if (!instance?.specs?.dependentOn?.length) return;
		const checkField = item => {
			const DEFAULT = {
				type: 'change',
			};

			const dependency = this.getField(item.field);

			['field', 'callback'].forEach(prop => {
				if (!item[prop]) throw new Error(`${item?.field} is missing ${prop}`);
			});

			if (!dependency) throw new Error(`${item?.field} is not a registered field`);

			const settings = { ...DEFAULT, ...item };
			if (!this.callbacks[item.callback]) {
				throw new Error(`${item.callback} is not  a registered callback ${item.name}`);
			}

			const callback = this.callbacks[item.callback];
			callback({ dependency, settings, field: instance, form: this });
		};

		instance?.specs?.dependentOn.forEach(checkField);
	};

	/**

	 * @param item 
	 * @param values 
	 * @returns 
	 */

	#getWrapper = item => {
		let instance: WrappedFormModel | FormField;
		if (!item.fields) throw new Error(`Wrapper ${item.name} must have fields property`);
		const fieldsProperties = item.fields.map(item => item.name);

		const properties = [...fieldsProperties, ...(item?.properties || [])];
		const defaultValues = item.values || {};

		instance = new WrappedFormModel({
			parent: this,
			settings: { ...item, form: this },
			specs: { properties: properties || [], ...defaultValues },
		});

		let toSet = {};
		Object.keys(instance?.getProperties()).forEach(property => (toSet[property] = item[property] || ''));
		instance.set(toSet);

		this.registerWrapper(instance);
		this.#childWrappers = this.#childWrappers + 1;

		return instance;
	};

	/**
	 * Registers a wrapper model within the form model, allowing for nested form structures.
	 * This method is crucial for managing complex forms where fields might be grouped into sections or wrappers.
	 * @param {WrappedFormModel} wrapper - The wrapper instance to register.
	 */
	registerWrapper = (wrapper: WrappedFormModel) => {
		this.wrappers.set(wrapper.name, wrapper);
	};

	getForm() {
		return this;
	}

	hide = (fields: string[]) => {
		fields.forEach(field => {
			const instance = this.getField(field);
			if (!instance) throw new Error(`Field ${field} does not exist in form ${this.name}`);

			instance.hide();
		});
	};

	show = (fields: string[]) => {
		fields.forEach(field => {
			const instance = this.getField(field);
			if (!instance) throw new Error(`Field ${field} does not exist in form ${this.name}`);

			instance.show();
		});
	};

	disable = (fields: string[]) => {
		fields.forEach(field => {
			const instance = this.getField(field);
			if (!instance) throw new Error(`Field ${field} does not exist in form ${this.name}`);

			instance.disabled = true;
		});
	};

	enable = (fields: string[]) => {
		fields.forEach(field => {
			const instance = this.getField(field);
			if (!instance) throw new Error(`Field ${field} does not exist in form ${this.name}`);

			instance.disabled = false;
		});
	};

	static create = settings => {
		const properties = settings.fields.map(item => item.name);
		const values = settings.values || {};
		const instance = new FormModel(settings, { ...properties, ...values });

		return instance;
	};
}

/**
 * File: models\plugins\base.ts
 */
import { FormModel } from '../model';
import { IPluginFormSpecs } from '../types/plugins';

export abstract class WiseFormPluginBase {
	abstract readonly name: string;
	abstract readonly ready: boolean;
	abstract init(): Promise<void>;

	static settings?(model: FormModel, specs: IPluginFormSpecs): Promise<WiseFormPluginBase>;
}

/**
 * File: models\plugins\formula.ts
 */
// esta interfaz existe para poder esperar
// a que el plugin esté listo.
import { parse } from 'mathjs';
import type { FormModel } from '../model';
import { IPluginFormSpecs } from '../types/plugins';
import { FormulaManager } from '@bgroup/wise-form/formulas';
import { FormField } from '../field';
import { WiseFormPluginBase } from './base';
// pensar porque no manejarlo con eventos.
export class FormulaPlugin extends WiseFormPluginBase {
	#form: FormModel;
	get form() {
		return this.#form;
	}
	#settings: IPluginFormSpecs;
	get name() {
		return 'formula';
	}

	get ready() {
		return true;
	}
	#formulas: Map<string, any> = new Map();
	get formulas() {
		return this.#formulas;
	}

	#value: string | number = 0;
	get value() {
		return this.#value;
	}

	set value(v) {
		if (v === this.#value) return;
		this.#value = v;
	}

	constructor(form: FormModel, settings: IPluginFormSpecs) {
		super();
		this.#form = form;
		this.#settings = settings;
	}

	async init() {
		if (!this.#form.settings?.observers) return;
		const promises = this.#form.settings.observers.map(this.create.bind(this));
		const formulas = await Promise.all(promises);
		formulas.forEach(formula => {
			this.#formulas.set(formula.name, formula);
		});
		this.#formulas.forEach(formula => {
			if (!formula.initialize) console.log(-1, formula);
			formula.initialize();
		});
	}

	async create(observer) {
		const { formula } = observer;

		if (!observer.name) {
			throw new Error(`Observer in form "${this.#form.name}" must have a name`);
		}
		if (!formula) {
			throw new Error(`Observer ${observer.name} in form "${this.#form.name}" must have a formula`);
		}

		return FormulaManager.create(this, observer);
	}

	static async settings(model, settings): Promise<WiseFormPluginBase> {
		try {
			const instance = new FormulaPlugin(model, settings);
			await instance.init();
			return instance;
		} catch (e) {
			console.error(e);
		}
	}
}

/**
 * File: models\plugins\index.ts
 */
import { ReactiveModel } from '@beyond-js/reactive/model';
import type { FormModel } from '../model';
import { PLUGINS } from './plugins';
import { IPluginForm } from '../types/plugins';
export class PluginsManager extends ReactiveModel<PluginsManager> {
	#plugins: Record<string, any> = ['formula'];

	private static items: Map<string, any> = new Map();
	#instances = new Map<string, IPluginForm>();
	get instances() {
		return this.#instances;
	};
	static formulas: Record<string, any> = {};
	#model: FormModel;
	constructor(model) {
		super();
		this.#model = model;

		globalThis.f = model;
		this.initialize();
	}

	private async initialize() {
		const plugins = Object.keys(PLUGINS);
		const promises: Promise<IPluginForm>[] = [];

		plugins.forEach(plugin => {
			const manager = PLUGINS[plugin].object;
			const instance = manager.settings(this.#model);
			promises.push(instance);
		});

		const results = await Promise.allSettled(promises);

		const installed = results
			.filter(result => result.status === 'fulfilled')
			.map(result => (result as PromiseFulfilledResult<any>).value);

		const failed = results.filter(result => result.status === 'rejected');
		if (failed.length) {
			console.warn('Failed to install plugins', failed);
		}
		installed.forEach((plugin: IPluginForm) => this.#instances.set(plugin.name, plugin));

		this.ready = true;
	}
}

/**
 * File: models\plugins\plugins.ts
 */
import { FormulaManager } from '@bgroup/wise-form/formulas';
import { FormulaPlugin } from './formula';
export const PLUGINS = {
	formula: {
		object: FormulaPlugin,
	},
};

/**
 * File: models\types\disabled.ts
 */
export type TDisabledSettings = {
	name: string;
	value: any;
};
export interface IDisabled {
	fields: string[] | TDisabledSettings[];
}

/**
 * File: models\types\form-field.ts
 */
export interface IFormField {
	name: string;
	type: string;
	placeholder: string;
	required: boolean;
	label: string;
	variant: string;
	disabled: boolean;
}

export interface IFormFieldProps {
	propertiea: string[];
	value: string | number | boolean | Object | any[];
	[key: string]: any;
}

/**
 * File: models\types\plugins.ts
 */
import type { FormModel } from '../model';

export interface IPluginFormSpecs {
	object: IPluginForm;
	property: string;
}

export interface IPluginForm {
	readonly ready: boolean;
	readonly name: string;
	settings: (model: FormModel, specs: IPluginFormSpecs) => Promise<IPluginForm>;
}

/**
 * File: models\types\wrapped-form-model-props.ts
 */
import type { FormModel } from '../model';
import type { WrappedFormModel } from '../wrapper';

export interface IWrapperFormModelProps {
	parent: FormModel | WrappedFormModel;
	settings;
	specs: { properties: string[] };
}

/**
 * File: models\wrapper.ts
 */
import { ReactiveModel } from '@beyond-js/reactive/model';
import { FormField } from './field';
import type { FormModel } from './model';
import { PendingPromise } from '@beyond-js/kernel/core';
import { IWrapperFormModelProps } from './types/wrapped-form-model-props';

export /*bundle*/
class WrappedFormModel extends ReactiveModel<WrappedFormModel> {
	// Holds the wrapper's specific settings.
	#settings;
	get settings() {
		return this.#settings;
	}

	get type() {
		return 'wrapper';
	}

	get callbacks() {
		return this.#parent.callbacks;
	}

	get control() {
		return this.settings.control;
	}

	get template() {
		return this.settings.template;
	}

	get name() {
		return this.#settings.name;
	}
	#form: FormModel;
	get form() {
		return this.#form;
	}

	// Stores the original values of the fields within the wrapper for reset purposes.
	#initialValues: Record<string, string> = {};
	get originalValues() {
		return this.#initialValues;
	}

	// A map of child wrapper models, allowing nested wrappers.
	#wrappers: Map<string, WrappedFormModel> = new Map();
	get wrappers() {
		return this.#wrappers;
	}

	get values() {
		const data = {};
		this.#fields.forEach((field, key) => {
			data[key] = field.value;
		});
		return data;
	}

	// A map of FormField and WrappedFormModel instances representing the wrapper's content.
	#fields: Map<string, FormField | WrappedFormModel> = new Map();
	get fields() {
		return this.#fields;
	}

	// Utilized to track the loading state of the wrapper and its children.
	#loadedPromise: PendingPromise<boolean> = new PendingPromise();

	// Counter for tracking the readiness of nested wrappers.
	#childWrappersReady: number = 0;

	// Reference to the parent FormModel or WrappedFormModel.
	#parent: FormModel | WrappedFormModel;
	#specs;
	get specs() {
		return this.#specs;
	}
	constructor({ parent, settings, specs }: IWrapperFormModelProps) {
		const { properties, ...props } = specs;
		super({
			...props,
			properties: ['name', ...properties],
		});

		this.#parent = parent;
		this.#settings = settings;
		this.#form = this.#settings.form;
		this.#startup(settings);
	}

	/**
	 * Initializes the wrapper model by setting up its fields and nested wrappers according to the provided settings.
	 * @param {Object} settings - The settings object defining fields and wrapper configurations.
	 */
	#startup = async settings => {
		const values = settings.values || {};
		this.#settings.fields.map(item => {
			const instance = this.#getInstance(item, values);
			const onChange = () => {
				this[item.name] = instance.value;
				this.triggerEvent();
			};
			instance.on('change', onChange);
			this.#fields.set(item.name, instance);
		});

		this.#parent.triggerEvent('wrappers.children.loaded');
		await this.#checkReady();
		this.#configFields();
		this.ready = true;
		this.#specs = settings;
		this.set(settings);
	};

	/**
	 * Creates an instance of a FormField or WrappedFormModel based on the provided item configuration.
	 *
	 * @param {Object} item - The configuration object for the field or nested wrapper.
	 * @param {Record<string, unknown>} values - Initial values for the fields.
	 * @returns {WrappedFormModel | FormField} The created instance.
	 */
	#getInstance = (item, values: Record<string, unknown>) => {
		let instance: WrappedFormModel | FormField;
		let externalValues: Record<string, any> = {};
		if (Array.isArray(item?.properties)) {
			item?.properties.forEach(item => (externalValues[item.name] = item.value));
		}

		if (item.type === 'wrapper') {
			if (!item.fields) throw new Error(`Wrapper ${item.name} must have fields property`);
			const fieldsProperties = item.fields.map(item => item.name);
			const properties = [...fieldsProperties, ...(item?.properties || [])];
			const values = item.values || {};

			instance = new WrappedFormModel({
				parent: this,
				settings: { ...item, form: this.#form },
				specs: { properties: properties || [], ...values },
			});

			let toSet = {};
			Object.keys(instance?.getProperties()).forEach(property => (toSet[property] = item[property] || ''));
			instance.set(toSet);

			this.registerWrapper(instance);
			return instance;
		}

		instance = new FormField({
			parent: this,
			specs: {
				...item,
				value: values[item.name] || item?.value,
				properties: item?.properties || [],
			},
		});

		if (item?.properties) {
			let toSet = {};
			item?.properties.forEach(property => (toSet[property] = item[property] || ''));
			instance.set(toSet);
		}

		return instance;
	};

	/**
	 * Checks whether all nested wrappers within this wrapper are loaded and sets the wrapper's state to loaded if so.
	 */
	#checkReady = () => {
		const onReady = () => {
			const areAllWrappersLoaded = this.#childWrappersReady === this.#wrappers.size;

			if (!areAllWrappersLoaded) return (this.#childWrappersReady = this.#childWrappersReady + 1);
			this.loaded = true;
			this.#parent.triggerEvent('wrappers.children.loaded');
			this.#loadedPromise.resolve(true);
			this.off('wrappers.children.loaded', onReady);
		};

		if (this.loaded) return this.loaded;
		if (!this.#wrappers.size) {
			onReady();
			return this.loaded;
		}

		this.on('wrappers.children.loaded', onReady);
		return this.#loadedPromise;
	};

	/**
	 * Configures the fields within the wrapper, setting up any dependencies they might have.
	 */
	#configFields = () => {
		this.#fields.forEach(this.#listenDependencies);
	};

	/**
	 * Initializes all fields within the wrapper, preparing them for user interaction. Its used to know when the fields can start to listen for events or dependencies
	 */
	initialize = () => {
		this.#fields.forEach(field => field.initialize());
	};

	/**
	 * Sets up dependency listeners for a field within the wrapper, allowing fields to react to changes in other fields.
	 * @param {FormField | WrappedFormModel} instance - The field or nested wrapper instance to set dependencies for.
	 */
	#listenDependencies = instance => {
		if (!instance?.specs?.dependentOn?.length) return;

		const checkField = item => {
			const DEFAULT = {
				type: 'change',
			};

			const dependency = this.#form.getField(item.field);

			['field', 'callback'].forEach(prop => {
				if (!item[prop]) throw new Error(`${item?.field} is missing ${prop}`);
			});

			if (!dependency) throw new Error(`${item?.field} is not a registered field`);

			const type = item.type ?? 'change';
			const settings = { ...DEFAULT, ...item };
			if (!this.callbacks[item.callback]) {
				throw new Error(`${item.callback} is not  a registered callback`);
			}

			const callback = this.callbacks[item.callback];
			callback({ dependency, settings, field: instance, form: this.#form });
		};

		instance?.specs?.dependentOn.forEach(checkField);
	};

	/**
	 * Registers a nested wrapper within this wrapper, adding it to the internal map of child wrappers.
	 * @param {WrappedFormModel} wrapper - The child wrapper to register.
	 */
	registerWrapper = (wrapper: WrappedFormModel) => {
		this.#wrappers.set(wrapper.name, wrapper);
		this.#form.registerWrapper(wrapper);
	};

	/**
	 * Sets the value of a specified field within the wrapper. If the field exists, its value is updated.
	 * @param {string} name - The name of the field to update.
	 * @param {any} value - The new value for the field.
	 */
	setField(name: string, value) {
		if (!this.getField(name)) {
			console.error('Field not found', name, this.#settings.name, this.#fields.keys());
			return;
		}

		this.getField(name).set({ value });
	}

	/**
	 * Retrieves a field or nested wrapper by name. Supports dot notation for accessing deeply nested fields.
	 * @param {string} name - The name of the field or nested wrapper to retrieve.
	 * @returns {FormField | WrappedFormModel | undefined} The requested instance, or undefined if not found.
	 */
	getField(name: string) {
		if (!name) return console.warn('You need to provide a name to get a field in form ', this.#settings.name);

		if (!name.includes('.')) {
			let field = this.#fields.get(name);
			if (!field) {
				this.#wrappers.forEach(item => {
					const foundField = item.getField(name);
					if (foundField) field = foundField;
				});
			}
			return field;
		}

		const [wrapperName, ...others] = name.split('.');
		const currentWrapper = this.#wrappers.get(wrapperName);

		const otherWrapper = others.join('.');
		return currentWrapper.getField(otherWrapper);
	}

	/**
	 * Clears all fields within the wrapper, resetting their values to their initial state.
	 */
	clear = () => {
		this.#fields.forEach(field => field.clear());
		this.triggerEvent();
		this.triggerEvent('clear');
	};

	cleanUp = this.clear;

	getForm() {
		return this.#parent;
	}
}

/**
 * File: settings\index.ts
 */
export /*bundle*/ class RFSettings {
	#types: Record<string, any> = {};
	get types() {
		return this.#types;
	}
	setFields(specs) {
		this.#types = { ...this.#types, ...specs };
	}
}

export /*bundle */ const WFSettings = new RFSettings();

