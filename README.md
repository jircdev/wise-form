## Introduction

Welcome to `wise-form`, a React library designed for building and managing forms dynamically through JSON objects. This
library streamlines the process of form creation and edition, with features like customizable structure, field ordering,
and comprehensive validation handling.

## Installation

Install `wise-form` using npm to integrate it into your React project:

```bash
npm install wise-form
```

## Usage

### Basic Implementation

To use `wise-form`, start by defining a form structure as a JSON object. Here's an example:

```javascript
// Define your form structure
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
		// Add other fields as needed...
	],
};
```

### Rendering the Form

In your React component, import `ReactiveForm` from `wise-form` and use the defined form structure:

```jsx
import React from 'react';
import { ReactiveForm } from 'wise-form';

const MyComponent = () => {
	return <ReactiveForm settings={form} />;
};

export default MyComponent;
```

## Features

-   **Dynamic Form Creation**: Easily create forms based on JSON objects.
-   **State Management**: Handles creation and edition states seamlessly.
-   **Customizable Field Types**: Supports various field types including text, email, checkbox, and more.
-   **Validation Handling**: Incorporates validation logic and error handling.
-   **Order and Structure Flexibility**: Define the order and structure of fields as needed.

## Best Practices

-   **Modular Design**: Keep your form definitions modular for easier maintenance and reusability.
-   **Validation Logic**: Define validation logic clearly within your form structure for consistency.
-   **Error Handling**: Ensure proper error handling to improve user experience.

## Contributing

Contributions to `wise-form` are welcome. Please refer to our contribution guidelines for more information.

## License

`wise-form` is released under the MIT License. See the LICENSE file for more details.
