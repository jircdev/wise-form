# Dependencies

Dependencies are a powerful feature within `wise-form`, allowing for interactive and dynamic form behaviors by linking
fields and wrappers based on their states or actions. This feature enhances the form's interactivity, enabling complex
form logic without extensive custom scripting.

### How Dependencies Work

In both fields and wrappers, you can define a `dependentOn` property. This property accepts an array of objects, each
specifying a dependency relationship between the current field/wrapper and another field/wrapper in the form. The
structure for these objects is defined as follows:

```typescript
export const form = {
	name: 'Dependencies testing',
	template: [[4, '1fr'], '1x8'],
	fields: [
		{
			name: 'numA',
			label: 'NumA: ',
			type: 'number',
		},
		{
			name: 'numADisplay',
			label: 'Num A Display: ',
			// Here, the dependentOn property is defined
			dependentOn: [
				{
					field: 'numA',
					callback: 'copyValue',
				},
			],
		},
	],
};
```

In this example, the field `numADisplay` depends on the field `numA`. When `numA` changes, the `copyValue` callback is
invoked, potentially altering the state or appearance of `numADisplay`.

### Understanding the `IDependency` Interface

Each item within the `dependentOn` array adheres to the following interface:

```typescript
interface IDependency {
	[key: string]: any;
	field: string;
	callback: string;
}
```

#### `field`

-   **Usage**: This property is used to specify the field or wrapper that the current item listens to. The identifiers
    for fields or wrappers correspond to their `name` properties.
-   **Purpose**: Establishes a link or dependency on another component within the form. This is crucial for creating
    reactive form elements that adjust based on the input or changes in other form elements.

#### `callback`

-   **Usage**: This property defines the callback function to be called when the specified field or wrapper changes.
-   **Purpose**: Allows the execution of predefined actions when a dependency condition is met. Callbacks can range from
    simple data copying to more complex logic that might involve validation, formatting, or even conditional rendering
    of form elements.

### Practical Example

In the provided example, the `numA` field acts as a source, and `numADisplay` is a dependent field. Whenever `numA`'s
value changes, the `copyValue` callback is triggered, effectively mirroring `numA`'s value in `numADisplay`. This setup
showcases a straightforward yet effective use case for dependencies, making forms more interactive and responsive to
user input.

### Conclusion

The dependencies feature in `wise-form` significantly simplifies the creation of dynamic and responsive forms. By
leveraging the `dependentOn` property, developers can easily establish relationships between different form components,
enriching the user experience without the need for extensive and complex code. This feature, combined with the robust
callbacks system, provides a powerful toolkit for designing interactive forms that can adapt to user inputs and
conditions dynamically.
