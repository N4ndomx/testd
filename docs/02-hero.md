# 02 · Hero

> Objetivo: la primera sección visible bajo el navbar: título grande, subtítulo y botones de acción (CTA).

## Qué practicas

- El **grid** de Bootstrap en su forma más común: `container` → `row` → `col-lg-6`.
- Utilidades de tipografía: `display-4`, `fw-bold`, `lead`, `text-muted`.
- Botones de distinta jerarquía: `btn-primary` (destacado) y `btn-outline-secondary` (secundario).
- Tipografía responsiva con `d-flex flex-column flex-sm-row` para los botones.

## Comando

```bash
ng generate component sections/hero --skip-tests
```

## Código

### `src/app/sections/hero/hero.html`

```html
<section class="bg-light">
  <div class="container py-5">
    <div class="row align-items-center g-5 py-5">
      <div class="col-lg-6">
        <span class="badge text-bg-primary rounded-pill mb-3">Nuevo · Producto X</span>
        <h1 class="display-4 fw-bold mb-3">
          La herramienta que simplifica tu trabajo diario
        </h1>
        <p class="lead text-muted mb-4">
          Producto X reúne, organiza y conecta todo lo que necesitas para
          trabajar mejor: menos esfuerzo, más resultados.
        </p>
        <div class="d-flex flex-column flex-sm-row gap-2">
          <a class="btn btn-primary btn-lg" href="#contact">Solicita una demo</a>
          <a class="btn btn-outline-secondary btn-lg" href="#features">Conocer más</a>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="hero-placeholder">
          <p class="display-6 fw-bold mb-2">Producto X</p>
          <p class="mb-0">Coloca aquí una captura de pantalla o ilustración del producto.</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

### `src/app/sections/hero/hero.css`

```css
.hero-placeholder {
  aspect-ratio: 4 / 3;
  border: 2px dashed var(--bs-secondary-border-subtle);
  border-radius: var(--bs-border-radius-lg);
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  color: var(--bs-secondary);
}
```

## Glosario profundo

### A. Los elementos HTML

| Elemento | Qué es | Por qué lo usamos aquí |
|---|---|---|
| `<section>` | Sección semántica de la página | Agrupa contenido que forma una unidad con su propio encabezado (aquí, la "portada"). Las demás guías usarán `<section>` con `id` para poder "anclararlas". |
| `<div>` | Contenedor genérico de bloque | Es el "ladrillo" sobre el que Bootstrap arma el grid: `container` → `row` → `col-*`. |
| `<span>` | Elemento en línea | El *badge* "Nuevo · Producto X" es un texto corto alineado en línea con el resto; por eso es `<span>` y no `<div>`. |
| `<h1>` | Encabezado de nivel 1 (el más importante) | Debe existir **uno y solo uno por página**: es la jerarquía que usan los buscadores y los lectores de pantalla. Aquí es el mensaje principal de la landing. |
| `<p>` | Párrafo | Texto de bloque con margen propio. Dos usos: el *lead* (subtítulo) en la columna izquierda, y los textos del placeholder. |
| `<a>` | Enlace | Lo usamos como **botón CTA**: un enlace que navega a un ancla (`#contact`, `#features`). Podría ser `<button>`, pero un *enlace* es correcto semánticamente cuando "te lleva a un lugar". |
| `<div class="hero-placeholder">` | Cajón con clase propia | Es el espacio reservado para la futura captura de pantalla del producto. Se estiliza con tu CSS (`.hero-placeholder`, abajo). |

### B. Las clases de Bootstrap

#### Fondo y espaciado de la sección

| Clase | Efecto | Detalle |
|---|---|---|
| `bg-light` | Fondo gris muy claro | Contrasta con el fondo blanco del resto de secciones (alternancia visual). Es una *utility* de fondo. |
| `py-5` / `py-4` | `padding-top` + `padding-bottom` | Escala `py-*`: 1=0.25rem, 2=0.5, 3=1, 4=1.5, 5=3. `py-5` da aire; `py-4` separación intermedia. Las siglas: `p`=padding, `x`=horizontal, `y`=vertical, `t`/`b`/`s`/`e`=top/bottom/start/end. |
| `mb-3`, `mb-4`, `mb-2`, `mb-0` | `margin-bottom` | Mismo sistema de escala. `mb-0` elimina el margen (útil para los últimos textos de cada bloque). |

#### El grid (la base de todo layout Bootstrap)

| Clase | Efecto |
|---|---|
| `row` | Fila del grid. Flexbox con 12 columnas internas y *gutters* (espacios entre columnas). |
| `align-items-center` | Centra verticalmente las columnas de esta fila (es `align-items: center` de flexbox). Así el texto y el placeholder quedan a la misma altura aunque tengan tamaños distintos. |
| `g-5` | Gutter (espacio entre columnas) más generoso. `g-*` controla el espacio de las 12 columnas. |
| `col-lg-6` | **"Columna de 6/12" desde `lg`.** En pantallas ≥992px ocupa la mitad del ancho; **por debajo de `lg`, la columna pierde el ancho fijo y se apila al 100%** (el texto queda encima del placeholder). No hay columna móvil porque en móvil queremos que ocupen todo el ancho. |

> **Resumen del grid**: `row` + hijos `col-*`. El número (1 a 12) indica cuántas de las 12 columnas ocupa. Variantes: `col-6`, `col-md-6`, `col-lg-6`, `col-xxl-6` → cada una aplica desde su breakpoint.

#### Tipografía

| Clase | Efecto | Detalle |
|---|---|---|
| `display-4` | Título "de expositor": tamaño gigante | `display-1` (más grande) hasta `display-6`. Calculados con la unidad `rem` para vida en cascada con el resto del texto. |
| `fw-bold` | `font-weight: 700` | Negrita. El título principal con `display-4` + `fw-bold` es el estilo clásico de hero. |
| `lead` | Párrafo grande de introducción | Aumenta tamaño, peso y `line-height` del párrafo. La clase estándar para el subtítulo de un hero. |
| `text-muted` | Texto gris secundario | Baja la importancia visual sin quitarlo. |
| `display-6 fw-bold mb-2` (placeholder) | Título interno del placeholder | Mismo mecanismo, uno o dos pasos más pequeño que el título principal. |

#### Badge (la etiqueta "Nuevo")

| Clase | Efecto | Detalle |
|---|---|---|
| `badge` | Etiquetita con fondo | Base del componente, con padding y `border-radius`. |
| `text-bg-primary` | Combina color de texto + fondo (azul) | En BS5 se usa `text-bg-*` para legibilidad correcta sobre el fondo: existe `text-bg-primary`, `-success`, `-danger`, etc. |
| `rounded-pill` | Radio máximo → cápsula (bordes 100% redondeados) | Le da el look de "píldora" al badge. |

#### Botones

| Clase | Efecto |
|---|---|
| `btn` | Base de los botones Bootstrap (display, padding, hover, foco). Aplicable a `<a>`, `<button>` o `<input>`. |
| `btn-primary` | Fondo azul sólido (la acción principal). |
| `btn-outline-secondary` | Sin fondo: borde gris + texto gris. Al hacer hover se rellena. Es la acción *secundaria*: aquí "Conocer más" no debe robar protagonismo al CTA. |
| `btn-lg` | Botón de tamaño grande (más padding y fuente). Para "captar el ojo" en el hero. |

#### Tipografía responsiva con flexbox (`d-flex...`)

| Clase | Efecto |
|---|---|
| `d-flex` | `display: flex` → los hijos se colocan en fila. |
| `flex-column` | Cambia el eje a vertical (apilados). |
| `flex-sm-row` | A partir de `sm` (≥576px) vuelven a fila. |
| `gap-2` | Separación uniforme entre los botones (`gap: 0.5rem`). |

> El conjunto `d-flex flex-column flex-sm-row gap-2` dice: *"en móvil apílalos uno sobre otro; en pantallas pequeñas+ alíneame los dos en una fila con 0.5rem de separación"*. Ese patrón `{d-flex} + {columna/fila con breakpoint}` es la utilidad de flexbox responsivo más usada en Bootstrap.

### C. Tu CSS propio (`hero.css`)

- `aspect-ratio: 4 / 3` → el cajón mantiene siempre proporción ancho:alto (4:3), sin importar el ancho de la pantalla. Importante para que el espacio del futuro screenshot nunca se "aplaste".
- `border: 2px dashed var(--bs-secondary-border-subtle)` → borde punteado. El color viene de una **variable CSS de Bootstrap** (`var(--bs-secondary-border-subtle)`, en este caso un gris apagado): así no inventas colores, reutilizas la paleta del tema.
- `background: white` → distingue el área del fondo gris.
- `display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center` → centra el contenido del placeholder horizontal y verticalmente (flexbox).
- `padding: 2rem; color: var(--bs-secondary)` → aire interno y texto gris (otro token de Bootstrap).
- `border-radius: var(--bs-border-radius-lg)` → esquinas redondeadas con el radio estándar que usa Bootstrap.

### `hero.ts` (queda como lo genera el CLI)

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  styleUrl: './hero.css',
  templateUrl: './hero.html',
})
export class Hero {}
```

## Conectar el componente

- En `app.ts`: importar `Hero` y agregarlo a `imports`.
- En `app.html`: `<app-hero />` justo después de `<app-navbar />`.

## Validar

- [ ] El hero ocupa el ancho claro (`bg-light`) bajo el navbar.
- [ ] Título grande, badge azul, subtítulo gris y dos botones.
- [ ] En pantalla < 992px el texto y el placeholder quedan apilados verticalmente.
- [ ] En móvil los botones se apilan; en desktop quedan lado a lado.

## Siguiente paso

Guía 03 — Características: `docs/03-features.md`