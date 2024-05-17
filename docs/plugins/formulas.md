# Plugin de Fórmulas para WiseForm

## Configuración de Observers

La implementación de fórmulas dinámicas es una característica central del Plugin de Fórmulas para WiseForm, ofreciendo a
los desarrolladores la capacidad de realizar cálculos automáticos y validaciones que responden en tiempo real a las
interacciones de los usuarios con el formulario. Los observers juegan un papel crucial en este proceso, monitoreando
cambios en los campos del formulario y aplicando lógicas de cálculo y validación específicas según sea necesario.

### Utilidad para Fórmulas

Mediante el uso de observers, este plugin permite:

-   Realizar cálculos automáticos basados en la entrada del usuario.
-   Aplicar validaciones dinámicas según el contexto del formulario.
-   Mejorar la experiencia del usuario con retroalimentación instantánea.

### Configuración de Observers

Los observers admiten diversas configuraciones, permitiendo una amplia gama de aplicaciones:

#### Fórmulas Simples

Para cálculos directos sin condiciones:

```json
{
    "formula": "totalGraphic * netGraphic + 1",
    "name": "formula1",
    "type": "basic"
}
```

#### Fórmulas con Condiciones en Múltiples Campos

Para aplicar fórmulas específicas bajo ciertas condiciones:

```json
{
    "formula": "discountPercentGraphic * discountAuthorGraphic",
    "name": "formula2",
    "type": "base-conditional",
    "conditions": [
        {
            "fields": [
                "totalGraphic",
                "netGraphic",
                "discountPercentGraphic",
                "discountAuthorGraphic"
            ],
            "conditions": [
                {
                    "condition": "hasValue",
                    "formula": "totalGraphic * discountAuthorGraphic"
                },
                {
                    "upper": 5,
                    "formula": "totalGraphic * discountAuthorGraphic + 10"
                }
            ]
        }
    ]
}
```

#### Fórmulas Condicionales Basadas en el Valor de un Campo

Para lógicas que requieren evaluación condicional:

```json
{
    "name": "formula3",
    "type": "value-conditions",
    "formula": {
        "field": "country",
        "conditions": [
            { "equal": "0", "formula": "discountPercentGraphic + netGraphic" },
            { "equal": "1", "formula": "totalGraphic * discountAuthorGraphic" },
            { "equal": "2", "formula": "totalDigital * netDigital" }
        ]
    }
}
```

Para logicas que requieren comparacion

```json
	{
				"fields": ["formulaInA", "inversionAnticipoDa"],
				"name": "formulaA",
				"type": "comparison",
				"formula": {
					"condition": "upper",
					"conditions": {
						"formulaInA": "formulaInA",
						"inversionAnticipoDa": "inversionAnticipoDa",
					},
				},
			},
```

### Soporte para Tipos de Condiciones

El plugin soporta una amplia variedad de condiciones, incluyendo:

-   `equal`: Evalúa igualdad con el valor dado.
-   `lower`: Comprueba si es menor que el valor proporcionado.
-   `upper`: Determina si es mayor que el valor especificado.
-   `between`: Verifica si está dentro de un rango de valores.
-   `different`: Evalúa si es diferente al valor dado.
-   `hasValue`: Comprueba si tiene algún valor.
-   `lessOrEqual`: Evalúa si es menor o igual que el valor dado.
-   `greaterOrEqual`: Determina si es mayor o igual que el valor especificado.

## Cómo Funciona

El Plugin de Fórmulas ejecuta cálculos observando eventos en los campos del formulario. Cuando un campo implicado en una
fórmula cambia, ésta se recalcula automáticamente.

### Tipos de Fórmulas

1. **bacic**: Opera directamente sobre los campos.
2. **base-conditional**: Aplica una nueva fórmula bajo ciertas condiciones.
3. **value-conditions**: Implementa una fórmula según el valor de un campo.
4. **comparison**: Implementa una formula de acuerdo a la comparacion de campos

Cada estructura proporcionada permite a los desarrolladores crear formularios interactivos que no solo capturan
información sino que también la procesan inteligentemente, mejorando así la experiencia del usuario.
