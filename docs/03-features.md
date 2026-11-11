# 03 · Características

> Objetivo: grilla de cards que presentan los beneficios del Producto X. Primer componente con **lógica de Angular** (`@for`).

## Qué practicas

- Grid responsivo puro con clases: `row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4`.
- Componente `card` de Bootstrap con `shadow-sm`.
- **Control flow moderno de Angular**: el bloque `@for ... track` para repetir elementos desde un arreglo.

## Comando

```bash
ng generate component sections/features --skip-tests
```

## Código

### `src/app/sections/features/features.ts`

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-features',
  styleUrl: './features.css',
  templateUrl: './features.html',
})
export class Features {
  protected readonly features = [
    {
      numero: '01',
      titulo: 'Rápido',
      descripcion:
        'Configura tu espacio de trabajo en minutos, sin curvas de aprendizaje.',
    },
    {
      numero: '02',
      titulo: 'Seguro',
      descripcion:
        'Tus datos cifrados y respaldados, con el control total sobre el acceso.',
    },
    {
      numero: '03',
      titulo: 'Integrable',
      descripcion:
        'Se conecta con las herramientas que ya usas todos los días.',
    },
    {
      numero: '04',
      titulo: 'Colaborativo',
      descripcion:
        'Trabaja con tu equipo en tiempo real, desde cualquier dispositivo.',
    },
    {
      numero: '05',
      titulo: 'Escalable',
      descripcion:
        'Crece contigo: de un proyecto pequeño a toda una organización.',
    },
    {
      numero: '06',
      titulo: 'Soportado',
      descripcion:
        'Atención cercana y documentación completa cuando la necesitas.',
    },
  ];
}
```

### `src/app/sections/features/features.html`

```html
<section id="features" class="py-5">
  <div class="container py-4">
    <div class="text-center mb-5">
      <h2 class="fw-bold">Características</h2>
      <p class="text-muted mb-0">
        Todo lo que necesitas para hacer tu trabajo más simple.
      </p>
    </div>
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      @for (item of features; track item.titulo) {
        <div class="col">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <span class="feature-number">{{ item.numero }}</span>
              <h5 class="card-title">{{ item.titulo }}</h5>
              <p class="card-text text-muted mb-0">{{ item.descripcion }}</p>
            </div>
          </div>
        </div>
      }
    </div>
  </div>
</section>
```

### `src/app/sections/features/features.css`

```css
.feature-number {
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--bs-primary);
  background: var(--bs-primary-bg-subtle);
  border-radius: var(--bs-border-radius);
  padding: 0.25rem 0.6rem;
  margin-bottom: 1rem;
}
```

## Glosario profundo

### A. Los elementos HTML

| Elemento | Qué es | Por qué lo usamos aquí |
|---|---|---|
| `<section id="features">` | Sección semántica + **ancla** | El `id` hace dos cosas: permite el salto desde el navbar (`href="#features"`) y da contexto semántico. Los `id` deben ser únicos en toda la página. |
| `<h2>` | Encabezado nivel 2 | Jerarquía: `<h1>` (una sola vez, en el hero) → `<h2>` para títulos de sección → `<h5>` como títulos de card. Esta jerarquía es lo que entienden buscadores y lectores de pantalla. |
| `<div class="col">` | Columna del grid | Es el hijo directo de `row`. **No usa número** (`col` a secas): en un `row-cols-*`, cada `.col` ocupa automáticamente un número de columnas según la clase de la fila. |
| `<div class="card">` | Contenedor de una "tarjeta" | El componente card: cajón con borde, esquinas redondeadas y fondo blanco. |
| `<div class="card-body">` | Cuerpo de la card | Contiene el contenido y aplica el padding estándar de card. |
| `<span class="feature-number">` | Etiqueta en línea con número | El "01"–"06": un número decorativo estilizado con tu CSS (`.feature-number`). |
| `<h5 class="card-title">` | Título del contenido | `card-title` estiliza el encabezado dentro de la card. `h5` le da tamaño mediano (nivel 5). |
| `<p class="card-text">` | Texto de la card | `card-text` ajusta tipografía y margen al contexto de card. |

### B. Las clases de Bootstrap

#### La grilla `row-cols-*` (clave de esta guía)

| Clase | Qué significa | Efecto |
|---|---|---|
| `row` | Fila del grid de 12 columnas | Contenedor flexbox con gutters. |
| `row-cols-1` | La ROJA de la fila se divide en **1 columna** | Cada `.col` hijo recibe `width: 100%` → 1 card por fila. |
| `row-cols-md-2` | Desde `md` (≥768px), cada fila tiene **2 columnas** | Mismo número de columnas para todos los `.col` de esa fila (no hay que poner `col-md-6` a cada uno). |
| `row-cols-lg-3` | Desde `lg` (≥992px), **3 columnas** | 6 cards → 2 filas de 3 en desktop. |
| `g-4` | Gutter (espacio) entre cards: 1.5rem | Escala `g-*`: 1=0.25, 2=0.5, 3=1, 4=1.5, 5=3 (rem). |

> **La magia**: nunca escribes `col-md-*` por card; con `row-cols-*` describes cuántas columnas por fila y Bootstrap reparte el ancho entre todas. Además las clases son **sumativas**: `row-cols-1` (móvil) + `row-cols-md-2` (tablet) + `row-cols-lg-3` (desktop) = responsive en tres saltos, sin una sola media query en tu CSS.

#### El componente card

| Clase | Efecto |
|---|---|
| `card` | Base: `border`, `border-radius`, `background` blanco, `display:flex; flex-direction:column`. |
| `card-body` | Relleno con `padding` estándar (1rem). |
| `card-title` | Título con `font-size` y `font-weight` de título dentro de la card. |
| `card-text` | Texto con estilo de lectura de card (`margin-bottom` y `line-height` ajustados). |
| `h-100` | `height: 100%` | Iguala la altura de todas las cards para que, en una misma fila, midan lo mismo aunque su texto difiera. |
| `shadow-sm` | Sombra sutil de elevación. |

#### Utilidades de "centrado/título" del encabezado

| Clase | Efecto |
|---|---|
| `text-center` | `text-align: center`. Centra el bloque del título. |
| `fw-bold` | Negrita (`font-weight: 700`). |
| `text-muted` | Gris (texto secundario). |
| `mb-5` / `mb-0` | Margen inferior grande / nulo. `mb-5` separa el encabezado del grid; `mb-0` evita margen al final de bloques. |
| `p-4` | `padding` interno de 1.5rem en el `card-body` (un poco más aireado que el default). |

### C. Angular en este componente

#### La propiedad en `.ts`

```ts
protected readonly features = [ ... 6 objetos ... ];
```

- `protected` → la plantilla del componente puede acceder, pero no está expuesta fuera (encapsulamiento). `readonly` → no se reasigna (buena práctica para datos estáticos).
- Cada objeto es un "registro" con 3 campos: `numero`, `titulo`, `descripcion`. A esto se le llama **shape** (forma) de dato; Angular no exige interfaces aquí, pero para producción podrías crear `interface`.

#### El `@for` (control flow nuevo de Angular)

```
@for (item of features; track item.titulo) { ... }
```

- Reemplaza al viejo `*ngFor`. Recorre `features` y **repite el bloque interior** por cada elemento, exponiendo el elemento en la variable `item`.
- `track item.titulo` → Angular etiqueta cada card con una "llave" única. Si algún día el arreglo cambia, Angular solo re-renderiza lo que cambió (no toda la grilla). **Siempre debes usar `track`.**
- Dentro del bloque, los `{{ ... }}` son **interpolaciones**: van de TS → HTML (one-way binding). `{{ item.titulo }}` inserta el valor del campo en ese punto del texto.

#### ¿Por qué repetir con Angular y no copiando HTML a mano?

Aunque ahora son 6 cards idénticas, los datos viven **en un solo lugar** (el `.ts`). Cambiar un título = 1 línea; agregar una card = 1 objeto. "Manosear" el HTML no.

### D. Tu CSS propio (`features.css`)

- `display: inline-block` → el `<span>` respeta `margin-bottom` (los elementos en línea puros lo ignoran) y convive con el texto siguiente.
- `font-size: 0.85rem; font-weight: 700; letter-spacing: 0.05em` → número pequeño, negrita, con ligera separación entre letras (estilo "label").
- `color: var(--bs-primary)` → azul de Bootstrap (var del tema).
- `background: var(--bs-primary-bg-subtle)` → fondo azul suave (existe la variable `--bs-primary-bg-subtle` para fondos tenues).
- `border-radius: var(--bs-border-radius)` → esquinas redondeadas de Bootstrap.
- `padding: 0.25rem 0.6rem; margin-bottom: 1rem` → "medallita" de texto y separación del título.

## Conectar el componente

- En `app.ts`: importar `Features` y agregarlo a `imports`.
- En `app.html`: `<app-features />` después de `<app-hero />`.

## Validar

- [ ] 6 cards en una grilla de 3 columnas en desktop.
- [ ] 2 por fila en tablet, 1 en móvil.
- [ ] Todas las cards tienen la misma altura.
- [ ] El clic en "Características" del navbar hace scroll hasta esta sección (ancla `#features`).

## Siguiente paso

Guía 04 — Precios: `docs/04-pricing.md`