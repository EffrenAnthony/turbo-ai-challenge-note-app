Analiza los archivos del proyecto (o el archivo en el que estoy trabajando) y aplica las siguientes mejores prácticas de React. Identifica violaciones, sugiere mejoras y refactoriza el código donde sea necesario.

---

## Estructura de componentes

- Un componente por archivo. El nombre del archivo debe coincidir con el nombre del componente en PascalCase.
- Usa functional components exclusivamente. No uses class components.
- Mantén los componentes pequenos y con una sola responsabilidad. Si un componente supera ~150 lineas, evalua si se puede dividir.
- Ordena el contenido del componente asi:
  1. Types/interfaces (si son locales al componente)
  2. Hooks (useState, useEffect, custom hooks, etc.)
  3. Variables derivadas y handlers
  4. Early returns (loading, error, empty states)
  5. Return del JSX

## Tipado con TypeScript

- Define las props con `interface` (no `type`) cuando sean objetos. Nombra como `ComponentNameProps`.
- No uses `React.FC`. Declara el componente como funcion normal con props tipadas:
  ```tsx
  function MyComponent({ title }: MyComponentProps) { ... }
  ```
- Exporta el componente como `export default` solo en pages de Next.js. En el resto, usa named exports.
- No uses `any`. Si no conoces el tipo, usa `unknown` y aplica narrowing.

## Hooks

- Respeta las reglas de hooks: solo llamalos en el top level, nunca dentro de condicionales o loops.
- Usa `useMemo` y `useCallback` solo cuando haya un problema real de rendimiento, no por defecto.
- Extrae logica reutilizable a custom hooks en `/lib/hooks/`. Nombra como `useNombreDescriptivo`.
- En `useEffect`:
  - Siempre define el array de dependencias.
  - No dejes dependencias faltantes ni agregues dependencias innecesarias.
  - Limpia side effects con la funcion de cleanup cuando sea necesario (event listeners, timers, subscriptions).

## Estado

- Mantén el estado lo mas cerca posible de donde se usa (colocation).
- No dupliques estado que se puede derivar de otro estado o de props.
- Usa un solo `useState` por valor logico. No agrupes valores no relacionados en un solo objeto de estado.
- Para estado complejo con multiples sub-valores relacionados, considera `useReducer`.
- Estado global solo para datos que realmente necesitan ser compartidos (auth, theme). Usa React Context para esto.

## Props

- Desestructura las props en los parametros de la funcion.
- No pases mas de 5-6 props a un componente. Si necesitas mas, agrupa en objetos o reconsidera la composicion.
- Usa children para composicion en lugar de render props cuando sea posible.
- Valores por defecto directamente en la desestructuracion:
  ```tsx
  function Button({ variant = 'primary' }: ButtonProps) { ... }
  ```

## Renderizado condicional

- Usa early returns para estados de carga, error y vacio antes del return principal.
- Para condicionales simples en JSX, usa `&&` o ternarios. Evita ternarios anidados.
- Cuidado con `{count && <Component />}` cuando count puede ser `0`. Usa `{count > 0 && <Component />}`.

## Listas y keys

- Siempre usa una key unica y estable (id de la entidad). Nunca uses el indice del array como key a menos que la lista sea estatica y nunca cambie de orden.
- Extrae el item de la lista a su propio componente si tiene logica o es complejo.

## Event handlers

- Nombra handlers como `handleAction` (ej: `handleSubmit`, `handleDelete`).
- Props de callback se nombran como `onAction` (ej: `onSubmit`, `onDelete`).
- No definas funciones anonimas inline en el JSX si tienen mas de una linea. Extraelas a una variable.

## Estilos

- Usa Tailwind CSS como sistema de estilos principal.
- Agrupa clases de Tailwind de forma logica: layout, spacing, typography, colors, states.
- Para clases condicionales, usa template literals o la utilidad `cn()` si existe en el proyecto.
- No mezcles sistemas de estilos (no inline styles + Tailwind en el mismo componente).

## Formularios

- Usa React Hook Form para formularios que requieran validacion.
- Valida con Zod definiendo schemas reutilizables.
- Muestra errores de validacion inline debajo de cada campo.
- Deshabilita el boton de submit mientras el formulario esta enviandose.

## Manejo de errores

- Usa Error Boundaries para atrapar errores de renderizado.
- Muestra estados de error amigables al usuario, no mensajes tecnicos.
- En llamadas async, maneja siempre el caso de error con try/catch o el estado de error del hook correspondiente.

## Performance

- Usa lazy loading (`React.lazy` + `Suspense`) para componentes pesados o rutas.
- Optimiza imagenes con el componente `Image` de Next.js.
- No hagas fetching de datos en el cliente si puedes hacerlo en el servidor (Server Components de Next.js).
- Evita re-renders innecesarios: no crees objetos o arrays nuevos en cada render como props.

## Patrones de Next.js App Router

- Usa Server Components por defecto. Solo agrega `'use client'` cuando el componente necesite interactividad (hooks, event handlers, browser APIs).
- Coloca `'use client'` lo mas abajo posible en el arbol de componentes.
- Usa el sistema de layouts de Next.js para UI compartida.
- Para data fetching, prefiere Server Components con async/await sobre useEffect en el cliente.

## Estructura de archivos del proyecto

```
src/
  app/              → Pages y layouts (App Router)
  components/
    ui/             → Componentes reutilizables de UI (Button, Input, Modal)
    forms/          → Componentes de formularios
    providers/      → Context providers
  lib/
    api/            → Funciones de llamadas a API
    hooks/          → Custom hooks
    utils/          → Funciones utilitarias
    auth/           → Logica de autenticacion
  types/            → TypeScript interfaces y types
```

---

Revisa los archivos indicados o el archivo actual aplicando estas practicas. Para cada hallazgo:
1. Indica la linea o seccion con el problema.
2. Explica brevemente por que viola la practica.
3. Aplica el fix directamente en el codigo.
