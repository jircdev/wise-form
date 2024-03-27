# `wise-form` Library

## Introduction

`wise-form` is a comprehensive React library aimed at streamlining the process of form creation and management in React
applications. It leverages JSON for form configuration, supporting dynamic form generation with customizable layouts,
field ordering, and in-depth validation mechanisms. The library introduces a structured approach with three core models:
`FieldModel`, `WrapperModel`, and `FormModel`, alongside the `WiseForm` component for rendering. This architecture not
only simplifies form development but also enhances flexibility by integrating with various UI libraries/frameworks
beyond React, such as Preact, Vue, and Svelte.

## Core Models

-   **FieldModel**: Represents individual form fields, encapsulating details like type, validation, and appearance.
-   **WrapperModel**: Acts as a container for grouping fields, capable of holding both `FieldModel` instances and other
    `WrapperModel` containers, facilitating complex form structures.
-   **FormModel**: A reactive model managing the entire form's state, observing changes across its elements for dynamic
    interaction handling. Its `fields` property can include both `FieldModel` and `WrapperModel` items, offering a
    versatile way to construct forms.

These models observe all changes within the form, allowing developers to handle any event seamlessly.

## Installation

```bash
npm install wise-form
```

## Usage

`wise-form` offers two primary methods for creating and managing forms:

### Direct Configuration with `WiseForm`

Define your form configuration as a JSON object and pass it directly to the `WiseForm` component using the `settings`
prop:

```javascript
import { WiseForm } from 'wise-form';

export const formSettings = {
	name: 'Contact',
	fields: [
		{
			name: 'email',
			type: 'email',
			required: true,
			label: 'Email',
			variant: 'floating',
		},
		// Additional fields...
	],
};

// Usage in a React component
return <WiseForm settings={formSettings} />;
```

### Advanced Implementation with `FormModel`

For more control and flexibility, instantiate a `FormModel` and pass it to `WiseForm`. This approach is ideal for
utilizing `wise-form` with other UI frameworks or for developers seeking detailed management of form behaviors:

```javascript
import { WiseForm, FormModel } from 'wise-form';

export const formDefinition = {
	name: 'Contact',
	fields: [
		{
			name: 'email',
			type: 'email',
			required: true,
			label: 'Email',
			variant: 'floating',
		},
		// Additional fields...
	],
};

const formModel = await FormModel.create(formDefinition);

// Usage in a React component
return <WiseForm formModel={formModel} />;
```

## Features

-   **Dynamic Form Creation**: Easily create forms with a JSON configuration.
-   **Reactive Models**: Utilize `FieldModel`, `WrapperModel`, and `FormModel` for comprehensive state management and
    event handling.
-   **Compatibility**: Implement `wise-form` across multiple UI libraries/frameworks for maximum flexibility.
-   **Customizable Layouts**: Use template logic for advanced field layout and grouping within your forms.

## Best Practices

-   **Modularity**: Keep your form definitions modular for easier updates and maintenance.
-   **Clear Validation Rules**: Define explicit validation rules within your form configurations for better user
    feedback.
-   **Detailed Error Handling**: Implement comprehensive error handling mechanisms to enhance form reliability and user
    experience.

## Contributing

We welcome contributions to the `wise-form` project. Please refer to our contribution guidelines for detailed
information on how to participate.

## License

`wise-form` is licensed under the MIT License. See the LICENSE file for more details.

---
