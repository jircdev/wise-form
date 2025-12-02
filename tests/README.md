# Wise Form Tests

Este paquete contiene tests simples para validar el funcionamiento del paquete `@bgroup/wise-form` antes de publicarlo.

## Estructura

- `src/App.tsx` - Componente principal con dos formularios
- `src/forms/` - Definiciones de formularios de prueba
  - `user-registration.ts` - Formulario de registro de usuario
  - `feedback.ts` - Formulario de feedback

## Instalación

1. Primero, asegúrate de que el paquete `@bgroup/wise-form` esté construido:
```bash
cd package
npm run build
```

2. Luego, instala las dependencias del paquete de tests:
```bash
cd tests
npm install
```

## Uso

Para ejecutar el servidor de desarrollo:

```bash
npm run dev
```

El servidor se iniciará en el puerto 3000 (configurado en `vite.config.ts`).

## Formularios de Prueba

### User Registration Form
Un formulario de registro con campos de información personal:
- First Name (text, required)
- Last Name (text, required)
- Email (email, required)
- Phone (tel)
- Country (select, required)
- Newsletter (checkbox)

### Feedback Form
Un formulario de feedback con categorización:
- Subject (text, required)
- Category (select, required)
- Priority (select, required)
- Message (textarea, required)
- Rating (radio, required)

Ambos formularios incluyen callbacks de `onSubmit` que muestran los valores del formulario cuando se envían.
