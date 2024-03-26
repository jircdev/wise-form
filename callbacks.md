# Callbacks

Callbacks are a set of methods that are "registered" in `wise-form` at the time of instantiating the `FormModel`.
They're intended to be used in the flow of forms to handle different scenarios efficiently.

The purpose of these callbacks is to offer common functionalities that can be utilized to manage various situations
throughout a form's lifecycle. These callbacks are typically employed when implementing dependencies between
fields/wrappers.

Let's explore how to integrate a callback into a form in a typical case:

### Integrating a Callback into a Form

#### action-manager.ts

```typescript
export class ActionManager {
	/**
	 * Copies the value from one field to another upon change.
	 *
	 * @param {Object} params - The parameters passed to the callback function.
	 * @param {FormField} params.dependency - The instance of the field that triggers the callback.
	 * @param {Object} params.settings - An object encapsulating any additional properties specified in the `dependentOn`.
	 * @param {FormField} params.field - The instance of the field that listens to the dependency and acts upon it.
	 * @param {FormModel} params.form - Represents the instance of `FormModel`, the general form instance.
	 */
	static copyValue = ({ dependency, settings, field, form }) => {
		dependency.on('change', () => field.set({ value: dependency.value }));
	};
}
```

In the example above, we define the `copyValue` callback within an object called `ActionManager`. This approach helps in
organizing all our callback functions cleanly, although regular functions can also be used if preferred.

#### Registering the Callback

Now, let's register our callback:

#### store.ts

```typescript
import { form } from './form';
import { FormModel } from 'wise-form/form';
import { ActionManager } from './action-manager';

export class Store {
	#formInstance: FormModel;

	constructor() {
		this.#formInstance = new FormModel({
			...form,
			callbacks: {
				copyValue: ActionManager.copyValue, // Here, we define our callbacks. The key specified acts as the `identifier`, which means we will refer to it by this name.
			},
		});
	}
}
```

That's how we register our callbacks. Now, let's put it to use:

We'll have a select field, and when we change the selected value, we'll copy that value and set it in a different input
called `selectedCountry`. Simple and effective.

#### form.ts

```typescript
export const form = {
	name: 'Callbacks testing',
	template: [[4, '1fr'], '1x8'],
	fields: [
		{
			name: 'country',
			type: 'select',
			label: 'Country: ',
			options: [
				{ value: 'Colombia', label: 'Colombia' },
				{ value: 'Ecuador', label: 'Ecuador' },
				{ value: 'Peru', label: 'Peru' },
				{ value: 'Venezuela', label: 'Venezuela' },
			],
		},
		{
			name: 'selectedCountry',
			label: 'Country Copy',
			disabled: true,
			dependentOn: [
				{
					field: 'country',
					callback: 'copyValue',
				},
			],
		},
	],
};
```

In this setup, whenever the `country` field changes, the `selectedCountry` field will automatically update to reflect
the new value. This demonstrates a straightforward yet powerful way to leverage callbacks within your form logic,
enhancing dynamic interactivity and data flow between fields.
