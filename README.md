## README for `wise-form` Library

## Introduction

`wise-form` is a React library designed to simplify the creation and management of forms in React applications. By
utilizing JSON objects for form configuration, it offers a dynamic approach to form generation, including customizable
structures, field ordering, and comprehensive validation mechanisms. The library now includes the `WrappedForm`
component, enabling developers to organize form content within a `WiseForm` without using the traditional `<form>` tag,
providing greater flexibility in form design and integration.

## Installation

To add `wise-form` to your project, install it via npm:

```bash
npm install wise-form
```

## Usage

### Basic Implementation

Define a JSON object for your form's configuration. Below is an example structure for a contact form:

```javascript
// Form structure example
export const form = {
	name: 'Contact',
	fields: [
		{
			name: 'email',
			type: 'email',
			required: true,
			label: 'Email',
			variant: 'floating',
		},
		// Add more fields as required
	],
};
```

### Rendering the Form

To render a form, import either `WiseForm` or `WrappedForm` from `wise-form` and pass your form configuration to it:

```jsx
import React from 'react';
import { WiseForm, WrappedForm } from 'wise-form';

const MyComponent = () => {
	return <WiseForm settings={form} />;
	// Or use WrappedForm for a form without the <form> tag
	// return <WrappedForm settings={form} />;
};

export default MyComponent;
```

## New Components

### `WrappedForm`

`WrappedForm` allows you to structure your form content within a `WiseForm` but without wrapping it inside a `<form>`
element. This is particularly useful for integrating with other form management libraries or when the form tag is not
desired.

## Template Logic

Both `WiseForm` and `WrappedForm` support a template logic to define the layout and grouping of form fields. This logic
uses a template setting to determine how fields are distributed and displayed. The template configuration can include
specific sizes, patterns, or distributions that are interpreted to organize the form fields into a coherent structure,
enhancing the form's usability and visual appeal.

### Understanding the `template` System in `wise-form`

The `template` property in `wise-form` offers a flexible way to define the layout of your form. It controls how form
fields are grouped and arranged into rows, providing a straightforward method to customize your form's structure to fit
your UI requirements. This property can accept various configurations, including numbers, strings, and arrays, each
dictating the layout differently. Here's how each variation works:

1. **Number**: When the value is a simple number, it represents the number of fields or columns in that row. For
   example, a value of `3` means the row will contain three fields.

2. **String**: A string value is used to represent a repeated row structure. The format follows the pattern
   `number x number`, where the first number specifies how many times the row structure will be repeated, and the second
   number indicates the number of fields or columns in each of those rows. This allows for the easy repetition of
   certain row structures across the form.

3. **Array**: An array value provides the most customization, where the first element can be either a number or a string
   (following the aforementioned logic), and the second element must be a string representing the CSS grid template for
   each column within that row. This allows for precise control over the layout of each row, including the ability to
   specify the size and distribution of fields or columns according to CSS grid conventions.

#### Example Usage

Let's look at a practical example to understand how these variations can be applied:

```javascript
const formTemplate = [
	2, // First row with 2 fields
	'2x3', // Two rows, each with 3 fields
	[3, '1fr 2fr 1fr'], // A single row with 3 fields, custom grid layout
	['2x2', '1fr 1fr'], // Two rows, each with 2 fields, uniform grid layout
];
```

-   The first element `2` indicates a single row with two fields.
-   The second element `"2x3"` specifies that there will be two rows, each containing three fields.
-   The third element `[3, "1fr 2fr 1fr"]` defines a single row with three fields, where the grid layout for each column
    is specified as `1fr 2fr 1fr`, indicating the relative width of each field.
-   The fourth element `["2x2", "1fr 1fr"]` represents two rows, each with two fields, both applying a grid layout of
    `1fr 1fr`, ensuring each field in the row takes up an equal amount of space.

This `template` system enables developers to craft forms that are not only functional but also visually aligned with the
application's design, ensuring a seamless user experience. By leveraging numbers, strings, and arrays, the `template`
property provides the flexibility needed to create diverse and dynamic form layouts.

## Features

-   **Dynamic Form Creation**: Create forms dynamically using JSON configuration.
-   **State Management**: Manage form states efficiently, including creation and editing phases.
-   **Variety of Field Types**: Support for various field types like text, email, checkbox, etc.
-   **Validation Handling**: Includes built-in validation logic and error management.
-   **Flexible Structure**: Offers flexibility in customizing the order and layout of form fields.
-   **Template Logic**: Utilize template settings for advanced field layout and grouping.

## Best Practices

-   **Modularity**: Keep form definitions modular for easier updates and reuse.
-   **Validation Clarity**: Define clear validation rules within your form configurations for better user feedback.
-   **Robust Error Handling**: Implement detailed error handling to improve user interactions and form reliability.

## Implementation Guide

### Configuring Your Form

Here is an example configuration for a login form:

```javascript
export const loginForm = {
	name: 'login',
	fields: [
		{
			name: 'username',
			type: 'text',
			placeholder: 'Username',
			required: true,
			label: 'Username',
			variant: 'floating',
		},
		{
			name: 'password',
			type: 'password',
			placeholder: 'Enter your password',
			required: true,
			label: 'Password',
			variant: 'floating',
		},
	],
};
```

### Implementing `WiseForm` or `WrappedForm`

Choose either `WiseForm` or `WrappedForm` for implementation, depending on your needs. Here's how to implement
`WiseForm`:

```jsx
import { WiseForm } from 'wise-form';

<WiseForm
	types={{
		select: ReactSelect,
		// other custom field types
	}}
	settings={loginForm}
/>;
```

For `WrappedForm`, the implementation is similar but without the `<form>` tag encapsulation.

## Contributing

Contributions to `wise-form` are highly appreciated. Please refer to our contribution guidelines for more information.

## License

`wise-form` is licensed under the MIT License. For more details, see the LICENSE file.
