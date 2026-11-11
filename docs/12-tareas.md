# 12 · Tareas: interpolación, `@if`, `@for` y consumo de una API con modelo

> Objetivo: que el alumno practique lo último aprendido sobre los componentes de ejemplo:
> - **Interpolación** (`{{ variable }}`) → `src/app/sections/demo/`
> - **`@if` / `@else` / `@else if`** → `demo` y `pokedex`
> - **`@for`** con `track` → `demo` y `pokedex`
> - **Consumir una API con `HttpClient`** y tipar la respuesta con un **modelo** → `src/app/models/pokemon.model.ts` + `src/app/sections/pokedex/`

Cada tarea dice **qué** hacer, **dónde** y **cómo se comprueba**. Todas se resuelven sin librerías extra.

---

## Tareas sobre el componente Demo (básico)

Archivos: `src/app/sections/demo/demo.ts` y `demo.html`.

### Tarea 1 — Mostrar más variables (interpolación)
1. Agrega a la clase dos variables: `ciudad = 'Córdoba'` y `hobby = 'programar'`.
2. Muéstralas en el HTML con interpolación, en una frase como: *"Vivo en Córdoba y me gusta programar."*
3. Agrega una variable booleana `mayorDeEdad` y muéstrala con un ternario: `{{ mayorDeEdad ? 'Sí' : 'No' }}`.

**Se comprueba:** al abrir `/demo`, la frase y el "Sí/No" aparecen en pantalla.

### Tarea 2 — Un `@if` con `@else`
1. Usa `@if (mayorDeEdad)` para mostrar *"Puedes votar."* y `@else` para *"Todavía no puedes votar."*
2. Cambia `mayorDeEdad` de `true` a `false` y comprueba que **cambia el texto**.

**Se comprueba:** alternando el valor de la variable, cambia el bloque mostrado.

### Tarea 3 — `@for` con índice
1. Agrega una lista `materias = ['Matemáticas', 'Programación', 'Bases de datos']`.
2. Recórrela con `@for` y muéstrala en una lista numerada usando el índice (`$index`): *"1. Matemáticas"*, *"2. Programación"*…

**Pista:** en Angular, dentro de `@for (materia of materias; track materia)` puedes usar las variables `$index`, `$first`, `$last`.
**Se comprueba:** se ven los 3 elementos con su número.

### Tarea 4 — `@for` sobre una lista vacía (opcional)
1. Con `@empty` dentro del `@for`, muestra *"No hay materias."* cuando el arreglo esté vacío.

**Se comprueba:** al dejar `materias = []`, aparece el mensaje de vacío.

---

## Tareas sobre el componente Pokédex (API + modelo)

Archivos: `src/app/sections/pokedex/pokedex.ts`, `pokedex.html` y `src/app/models/pokemon.model.ts`.

### Tarea 5 — Ampliar el modelo
1. En `pokemon.model.ts` agrega al modelo `Pokemon` los campos que devuelve la API: `base_experience: number` y `abilities: { ability: { name: string } }[]`.
2. Compruébalo añadiéndolos a la clase/HTML del componente sin que la compilación falle.

**Se comprueba:** `ng build` sin errores y los nuevos campos accesibles en el HTML.

### Tarea 6 — Mostrar los datos nuevos
1. Muestra `{{ pokemon.base_experience }}` con una etiqueta "Experiencia base:".
2. Muestra las habilidades con un `@for` sobre `pokemon.abilities` (usa `track habilidad.ability.name`).

**Se comprueba:** al buscar `charizard`, se ven sus habilidades en una lista.

### Tarea 7 — Mejorar los estados con `@if`
1. Añade una variable `encontrado = false`.
2. Antes de la búsqueda muestra con `@if` un mensaje *"Escribe un nombre y pulsa Buscar."*
3. Evita buscar con el campo vacío: si `nombre` está vacío, no llames a la API (deja el mensaje de la Tarea 7).

**Se comprueba:** antes de buscar no hay tarjeta; con el campo vacío no aparece error de red.

### Tarea 8 — Manejar el error 404
1. Si el Pokémon no existe (por ejemplo `abc123`), muestra *"Ese Pokémon no existe."* usando el bloque `error` que ya existe.
2. Comprueba que al escribir un nombre válido después de un error, el mensaje desaparece.

**Se comprueba:** con `abc123` no aparece la tarjeta; con `pikachu` sí.

### Tarea 9 — Lista de Pokémon (Reto)
1. Haz una petición a `https://pokeapi.co/api/v2/pokemon?limit=10` (devuelve `{ results: [{ name, url }] }`).
2. Crea un **modelo nuevo** `ListaPokemon` en `src/app/models/` para esa respuesta.
3. Muestra los 10 nombres con `@for` en una lista.
4. Al hacer clic en un nombre, llama a `buscar()` con ese nombre y muestra la tarjeta de detalle.

**Se comprueba:** se ve la lista y al pulsar un nombre se carga su detalle.

---

## Entrega y criterios de evaluación

| Criterio | Puntos |
|---|---|
| Compila sin errores (`ng build`) | 2 |
| Usa **interpolación** para mostrar valores | 2 |
| Usa `@if` / `@else if` / `@else` correctamente | 2 |
| Usa `@for` con `track` (y `$index`/`@empty` si aplica) | 2 |
| El modelo está en `src/app/models/` y se **importa** (no declarado dentro del componente) | 1 |
| Maneja estados de carga y error de la API | 1 |

**Entregable:** el proyecto con los cambios y una captura de `/demo` y `/pokedex` funcionando.

## Errores frecuentes (que revisará el profe)

| Error | Causa / solución |
|---|---|
| `NG5002: Incomplete block "if"` | Escribiste `@if` como **texto** en el HTML; usa `&#64;if` para mostrarlo literal. |
| El `@for` no pinta nada | `materias`/`pokemon.types` está vacío o mal escrito; revisa el nombre de la variable. |
| `Property 'x' does not exist on type 'Pokemon'` | Falta el campo en el **modelo** `pokemon.model.ts`. |
| La petición da error de CORS en otro API | La PokéAPI permite CORS; si usas otra API, revisa que lo permita. |
| El buscador no actualiza | Falta `[(ngModel)]` o `name` en el `<input>`, o no hay `(ngSubmit)` en el `<form>`. |

## Siguiente paso

- Llevar las tareas 5–9 a un **servicio** (`PokemonService`) en lugar de llamar a `HttpClient` desde el componente, y reutilizar el modelo. Deja el componente más limpio y enseña separación de responsabilidades.