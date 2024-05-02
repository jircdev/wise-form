### Documento: Implementación de Callbacks en WiseForm

#### Introducción

Los callbacks en WiseForm permiten una interacción avanzada dentro de los formularios dinámicos, facilitando la
ejecución de funciones específicas basadas en acciones o cambios en los datos del formulario. Este documento explica
cómo implementar y utilizar los callbacks dentro de WiseForm para mejorar la funcionalidad y la interactividad de los
formularios.

#### Definición y Uso de Callbacks

Los callbacks en WiseForm se definen como métodos que se registran al instanciar el `FormModel`. Estos métodos están
diseñados para manejar diversas situaciones durante el ciclo de vida de un formulario, como dependencias entre campos o
acciones específicas tras ciertos eventos.

##### **Interfaz de Parámetros de Callback**

Cada callback recibe un objeto de parámetros con la siguiente interfaz:

```typescript
interface CallbackParams {
	form: FormModel; // Instancia del modelo de formulario
	field: FieldOrAlias; // Campo o alias afectado
	[string: string]: any; // Propiedades adicionales dinámicas
	fields?: Record<string, any>; // Campos adicionales pasados al callback
	specs?: Record<string, any>; // Datos adicionales registrados en la configuración de WiseForm
}
```

##### **Registro de Callbacks**

Los callbacks se deben registrar en la instancia del formulario de la siguiente manera:

```typescript
const form = new FormModel({
	...form,
	callbacks: {
		copyValue: ActionManager.copyValue, // Definición del callback
	},
});
```

#### Ejemplo Práctico: Uso de Callbacks

Consideremos un formulario con campos dependientes que utilizan el callback `fetchData` para cargar datos dinámicamente
basados en la selección de un usuario:

```typescript
{
    name: 'state',
    type: 'select',
    label: 'Select State',
    options: [],
    dependentOn: [
        {
            field: 'country',
            callback: 'fetchData',
            url: '/states',
            fields: ['passport'],
        },
    ],
},
{
    name: 'city',
    type: 'select',
    label: 'Select City',
    options: [],
    dependentOn: [
        {
            field: 'state',
            callback: 'fetchData',
            url: '/cities',
            fields: ['passport'],
            params: ['token'], // Usando 'token' como un parámetro global
        },
    ],
}
```

En este ejemplo, el campo `state` depende del valor del campo `country` para cargar sus opciones a través del callback
`fetchData`. Similarmente, `city` depende de `state` para cargar sus propias opciones.

#### Beneficios de Usar Callbacks

1. **Flexibilidad**: Permite a los desarrolladores crear formularios que responden dinámicamente a la interacción del
   usuario.
2. **Reusabilidad**: Los callbacks se pueden reutilizar en diferentes partes del formulario o en formularios diferentes.
3. **Integración de Servicios Externos**: Facilita la integración con APIs externas para la carga de datos y otras
   funcionalidades.
