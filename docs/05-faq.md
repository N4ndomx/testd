# 05 · FAQ (acordeón)

> Objetivo: acordeón de preguntas frecuentes. Combina el control flow de Angular con el plugin *collapse* de Bootstrap, por lo que además practicas **IDs dinámicos** (`[attr.data-bs-target]`).

## Qué practicas

- El componente `accordion` de Bootstrap.
- Índice de un `@for`: `let i = $index` (para generar IDs únicos).
- Enlaces de atributo dinámicos: `[id]`, `[attr.data-bs-target]`, `[attr.data-bs-parent]`, `[class.show]`.
- La primera pregunta abierta por defecto (`collapse show`).

> ⚠️ **Aclaración importante:** el abrir/cerrar del acordeón lo maneja el JavaScript de Bootstrap (el bundle que enlazaste en `00-inicio.md`). Angular solo "maqueta" los datos estáticos. No pongas dentro de los paneles datos que cambien de estado por Angular: el DOM que manipula Bootstrap puede quedar desincronizado.

## Comando

```bash
ng generate component sections/faq --skip-tests
```

## Código

### `src/app/sections/faq/faq.ts`

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  styleUrl: './faq.css',
  templateUrl: './faq.html',
})
export class Faq {
  protected readonly preguntas = [
    {
      pregunta: '¿Cómo empiezo a usar Producto X?',
      respuesta:
        'Crea tu cuenta gratis y sigue el asistente de configuración: en menos de cinco minutos tendrás tu espacio listo.',
    },
    {
      pregunta: '¿Puedo cancelar cuando quiera?',
      respuesta:
        'Sí. No hay permanencia: cambia de plan o cancela en cualquier momento desde tu panel de configuración.',
    },
    {
      pregunta: '¿Mis datos están seguros?',
      respuesta:
        'Sí. La información se cifra en tránsito y en reposo, con respaldos automáticos y accesos auditables.',
    },
    {
      pregunta: '¿Funciona en mi dispositivo?',
      respuesta:
        'Producto X funciona desde cualquier navegador moderno, en computadora, tableta o teléfono.',
    },
  ];
}
```

### `src/app/sections/faq/faq.html`

```html
<section id="faq" class="py-5">
  <div class="container py-4">
    <div class="text-center mb-5">
      <h2 class="fw-bold">Preguntas frecuentes</h2>
      <p class="text-muted mb-0">Las dudas más comunes sobre Producto X.</p>
    </div>
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="accordion" id="faqAccordion">
          @for (item of preguntas; track item.pregunta; let i = $index) {
            <div class="accordion-item">
              <h2 class="accordion-header">
                @if (i === 0) {
                  <button
                    class="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    [attr.data-bs-target]="'#collapse-' + i"
                    [attr.aria-controls]="'collapse-' + i"
                    aria-expanded="true"
                  >
                    {{ item.pregunta }}
                  </button>
                } @else {
                  <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    [attr.data-bs-target]="'#collapse-' + i"
                    [attr.aria-controls]="'collapse-' + i"
                    aria-expanded="false"
                  >
                    {{ item.pregunta }}
                  </button>
                }
              </h2>
              <div
                [id]="'collapse-' + i"
                class="accordion-collapse collapse"
                [class.show]="i === 0"
                [attr.data-bs-parent]="'#faqAccordion'"
              >
                <div class="accordion-body text-muted">{{ item.respuesta }}</div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  </div>
</section>
```

## Glosario profundo

### A. Los elementos HTML

| Elemento | Qué es | Por qué lo usamos aquí |
|---|---|---|
| `<div class="accordion">` | Contenedor raíz del acordeón | Bootstrap lo identifica por su clase; aquí le damos además `id="faqAccordion"` para que los paneles "administren" sus preguntas (ver `data-bs-parent`). |
| `<div class="accordion-item">` | Cada pregunta es un bloque independiente | Borde, dividido del siguiente por una línea. Un `item` = 1 pregunta. |
| `<h2 class="accordion-header">` | El encabezado de la pregunta | **Sí, otro `<h2>`**: Bootstrap elige `h2` por que las preguntas son "encabezados de subsección". Semánticamente correcto. |
| `<button>` | El que dispara el colapso | El texto visible con el que el usuario hace clic. Dentro de un accorden el `<button>` es el estándar de Bootstrap. |
| `<div class="accordion-body">` | Contenido que se despliega | El texto de la respuesta, con su padding característico. |
| `<h2>`, `<p>`, `<section>`, `<div>`, `<span>` | Jerarquía de encabezados y caja | Ya explicados en guías 00–04: aquí `h2` para el título de la sección y `h2` para cada pregunta; `p` para la respuesta dentro del body. |

### B. Las clases de Bootstrap

#### El acordeón

| Clase | Efecto | Detalle |
|---|---|---|
| `accordion` | Contenedor raíz: junta los items con borde redondeado | — |
| `accordion-item` | Cada panel: borde, fondo y separador entre items | — |
| `accordion-header` | Header con `margin-bottom: 0` (para que el button llene el espacio) | — |
| `accordion-button` | El botón de la pregunta: expande el clicárea, pone el fondo y **dibuja el ícono &#9660;/&#9650;** al final (una *chevron*) | Con `:not(.collapsed)` cambia de estado. |
| `accordion-button collapsed` | Lo mismo pero **cerrado** | Con esta clase extra el chevron apunta hacia abajo y el fondo queda claro. |
| `accordion-collapse collapse` | El panel: los dos juntos lo hacen colapsable y oculto por defecto | `collapse` = `display: none` hasta recibir `show`. |
| `collapse show` | El estado *abierto* | `show` fuerza `display: block`. Bootstrap usa este par (`collapse`/`show`) para saber el estado y animar entre ellos. |
| `accordion-body` | Relleno del panel | Padding extra y, con `text-muted`, texto gris. |

#### "¿Cómo sabe Bootstrap qué abrir?"

Los tres atributos `data-bs-*`/`aria-*` del `<button>` son el contrato:

| Atributo | Efecto | Detalle |
|---|---|---|
| `data-bs-toggle="collapse"` | Activa el plugin collapse **en este botón** | Bootstrap JS escucha clics en cualquier `[data-bs-toggle="collapse"]`. |
| `[attr.data-bs-target]="'#collapse-' + i"` | Indica qué panel abrir/cerrar | El valor es un selector CSS (el `id` del panel). Aquí es **dinámico** porque Angular lo calcula con el índice (`'#collapse-' + i` → `#collapse-0`, `#collapse-1`, …). |
| `[attr.aria-controls]="'collapse-' + i"` | Accesibilidad: "este botón controla ese id" | No afecta el comportamiento; mejora la experiencia con lectores de pantalla. |
| `aria-expanded="true"/"false"` | Estado anunciado a los lectores de pantalla | Bootstrap lo actualiza solo. |
| `[attr.data-bs-parent]="'#faqAccordion'"` | "Ciérrame si otro panel de este padre se abre" | Pone el comportamiento *acordeón* (solo uno abierto a la vez). Sin este atributo, cada pregunta se abriría y cerraría de forma independiente. |

> **Por qué `[attr.data-...]` con corchetes y `data-bs-toggle` sin ellos:** los atributos normales (`data-bs-toggle`) son **gloriedades estáticas**: Bootstrap los lee tal cual. Los que dependen del dato (`data-bs-target`) los computa Angular, y para que Angular **pinte atributos no-estándar** (`data-*`, `aria-*`) se usa la sintaxis `[attr.nombre]`. Los `aria-*` (que SÍ son estándar) también sirven con `[attr.aria-*]` porque queremos el valor variable.

### C. Angular en este componente

#### `let i = $index`

```
@for (item of preguntas; track item.pregunta; let i = $index) {
```

- El bloque `@for` ofrece por defecto `$index` (posición 0,1,2…). Con `let i = $index` lo guardamos en una variable más legible.
- Es el INDICE lo que hace únicos los `id`, y los `id` duplicados romperían el collapse ("¿a cuál abro?"). Por eso este componente es el primero que necesita generar `id`/atajos dinámicos.

#### `[id]` vs `id` (enlace de propiedad vs atributo estático)

```
<div [id]="'collapse-' + i" ...>
```

- `[id]` = Angular **asigna** la propiedad `id` del elemento al resultado de la expresión. Como el valor es variable, usamos `[id]` en vez de `id="..."`.
- Nota a la izquierda: no usamos `[attr.id]`; `id` es un atributo **estándar**, así que Angular puede vincularlo como propiedad directa con `[id]`. Solo los no-estándar (como `data-*`) exigen `[attr.…]`.

#### `[class.show]` (clase condicional por bandera)

```
[class.show]="i === 0"
```

- `[class.x]="condición"` agrega la clase `x` a un elemento SOLO cuando la condición es `true`, y la quita si es `false`.
- Aquí: la primera pregunta (`i === 0`) recibe `show` → panel abierto. Las demás NO lo tienen → cerradas.
- Junto con `class="accordion-collapse collapse"` (estáticas), Angular combina: siempre `accordion-collapse collapse`, y `show` solo para la primera.

#### `@if (i === 0) { …. } @else { …. }`

Ambos `<button>` son casi iguales, pero el primero lleva `class="accordion-button"` con `aria-expanded="true"`, y el `@else` usa `accordion-button collapsed` con `aria-expanded="false"`. El `@else` ejecuta lo que sobra cuando el `@if` es `false`. Para evitar duplicar HTML, podrías usar enlaces dinámicos de clase (por ejemplo `[class.collapsed]="i !== 0"`); se dejó el `@if/@else` para practicar la sintaxis.

## Conectar el componente

- En `app.ts`: importar `Faq` y agregarlo a `imports`.
- En `app.html`: `<app-faq />` después de `<app-pricing />`.

## Validar

- [ ] 4 preguntas listadas bajo el título "Preguntas frecuentes".
- [ ] La primera pregunta aparece **abierta** al cargar.
- [ ] Clic en otra pregunta: se abre y la anterior se cierra.
- [ ] El clic en "FAQ" del navbar salta a esta sección.
- [ ] Los IDs generados en el HTML se ven como `collapse-0`, `collapse-1`, etc. (inspección del navegador).

## Siguiente paso

Guía 06 — Formulario de contacto: `docs/06-contact.md`