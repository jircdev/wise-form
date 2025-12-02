# @bgroup/wise-form

A reactive form library for React applications.

## Installation

```bash
npm install @bgroup/wise-form react @beyond-js/reactive
```

## Usage

```tsx
import { WiseForm, FormModel } from '@bgroup/wise-form';

// Use with settings
<WiseForm settings={formSettings} />

// Or with a model instance
const model = FormModel.create(settings);
<WiseForm model={model} />
```

## Modules

- `@bgroup/wise-form/form` - Form components and hooks
- `@bgroup/wise-form/formulas` - Formula management
- `@bgroup/wise-form/models` - Form models and fields
- `@bgroup/wise-form/settings` - Form settings

## License

ISC

