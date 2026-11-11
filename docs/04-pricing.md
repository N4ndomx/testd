# 04 · Precios

> Objetivo: cards de planes con un plan destacado. Practica el **condicional** de Angular (`@if / @else`).

## Qué practicas

- El `@if ... @else` del nuevo control flow de Angular (ya no es `*ngIf`).
- Clases dinámicas con enlace de clase (`[class]`) o clase estática + `[class.x]`.
- Listas dentro de la card con `@for` + `track`.
- El utilitario `mt-auto` para alinear el botón al fondo de la card.

## Comando

```bash
ng generate component sections/pricing --skip-tests
```

## Código

### `src/app/sections/pricing/pricing.ts`

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-pricing',
  styleUrl: './pricing.css',
  templateUrl: './pricing.html',
})
export class Pricing {
  protected readonly planes = [
    {
      nombre: 'Básico',
      precio: '0',
      descripcion: 'Para empezar a explorar Producto X.',
      caracteristicas: ['1 proyecto', 'Almacenamiento de 1 GB', 'Soporte por correo'],
      destacado: false,
    },
    {
      nombre: 'Pro',
      precio: '12',
      descripcion: 'Para profesionales que necesitan más.',
      caracteristicas: ['Proyectos ilimitados', 'Almacenamiento de 100 GB', 'Soporte prioritario'],
      destacado: true,
    },
    {
      nombre: 'Empresa',
      precio: '29',
      descripcion: 'Para equipos y organizaciones.',
      caracteristicas: ['Todo lo de Pro', 'Almacenamiento ilimitado', 'Gerente de cuenta dedicado'],
      destacado: false,
    },
  ];
}
```

### `src/app/sections/pricing/pricing.html`

```html
<section id="pricing" class="bg-light py-5">
  <div class="container py-4">
    <div class="text-center mb-5">
      <h2 class="fw-bold">Precios</h2>
      <p class="text-muted mb-0">
        Planes simples y transparentes. Sin costos ocultos.
      </p>
    </div>
    <div class="row row-cols-1 row-cols-md-3 g-4 justify-content-center">
      @for (plan of planes; track plan.nombre) {
        <div class="col">
          <div class="card h-100 shadow-sm">
            @if (plan.destacado) {
              <div class="text-center mt-3">
                <span class="badge text-bg-primary rounded-pill">Más popular</span>
              </div>
            }
            <div class="card-body p-4 d-flex flex-column">
              <h5 class="card-title">{{ plan.nombre }}</h5>
              <p class="text-muted">{{ plan.descripcion }}</p>
              <p class="display-6 fw-bold">
                ${{ plan.precio }}
                <span class="fs-6 fw-normal text-muted">/mes</span>
              </p>
              <ul class="list-unstyled mb-4">
                @for (item of plan.caracteristicas; track item) {
                  <li class="mb-2">
                    <span class="me-2 text-primary">✓</span>{{ item }}
                  </li>
                }
              </ul>
              <a
                class="btn mt-auto"
                [class]="plan.destacado ? 'btn-primary' : 'btn-outline-primary'"
                href="#contact"
              >
                Elegir {{ plan.nombre }}
              </a>
            </div>
          </div>
        </div>
      }
    </div>
  </div>
</section>
```

## Glosario profundo

### A. Los elementos HTML

| Elemento | Qué es | Por qué lo usamos aquí |
|---|---|---|
| `<section id="pricing">` | Sección + ancla | Igual mecanismo que `#features`: el navbar la usa (`href="#pricing"`). |
| `<h2>` | Encabezado de sección | Segunda aparición de `<h2>` en la página (h1 solo en hero). |
| `<ul>` | Lista desordenada | Para las características de cada plan. La lista es el elemento correcto para ítems de un plan. |
| `<li>` | Ítem de la lista | Cada característica. `mb-2` los separa verticalmente. |
| `<span>` | Elemento en línea | Dos usos: el badge y la marca "✓" que precede cada característica. |
| `<a>` | Enlace | Botón "Elegir {plan}" → navega a la ancla `#contact`. |
| `<p class="display-6 fw-bold">` | Párrafo del precio | El precio "respira" dentro de un párrafo con estilo de display. |

### El checkout de clases secundarias

- `bg-light py-5`, `container`, `text-center mb-5`, `fw-bold`, `text-muted`, `row row-cols-*` `g-4`, `card`, `h-100`, `shadow-sm`, `card-body`, `badge text-bg-primary rounded-pill`, `p-4`, `card-title`, `display-6`, `btn`, `btn-primary` → ya explicadas en guías 02 y 03. El resto se detalla abajo.

### B. Las clases nuevas de Bootstrap

| Clase | Efecto | Detalle |
|---|---|---|
| `justify-content-center` | Centra la fila en el espacio horizontal sobrante | Solo notarás su efecto si las cards "no llenan" el ancho total; con `row-cols-md-3` son 3 perfectas y ocupan todo, pero en móvil (1 por fila) también queda centrada. |
| `mt-3` | `margin-top: 1rem` | Separa el badge del borde superior de la card. |
| `list-unstyled` | Quita los bullets (viñetas) de la `<ul>` | Bootstrap aún respeta el `padding` izquierdo, así que nada queda "descolgado". |
| `d-flex flex-column` | La card se convierte en columna flexible | La card `h-100` ahora distribuye su altura verticalmente entre sus hijos. **Esto habilita `mt-auto`.** |
| `mt-auto` | `margin-top: auto` dentro de un flex-columna | Empuja el botón al FONDO de la card: el espacio sobrante se inyecta como márgen encima del botón. Resultado: los botones de las 3 cards se alinean en una misma línea horizontal, aunque el texto arriba mida distinto. |
| `fs-6 fw-normal` | Tamaño de fuente estándar + peso normal | Hace el "/mes" pequeño (fs-6) y sin negrita, para que no compita con el precio `display-6` en negritas. |
| `me-2` | `margin-end` (derecha) de 0.5rem | Separa el "✓" del texto de la característica. |
| `txt-primary` ≠ `text-primary` | — | Atención: la clase correcta es `text-primary` (azul). Usamos `text-primary` para la "✓". |

### C. Angular en este componente

#### El booleano `destacado`

Cada plan tiene `destacado: true | false`. Es un dato que inclina la UI: "este plan debería resaltarse". La lógica de presentación queda así *en los datos*, no duplicada en el HTML.

#### `@if / @else` (control flow)

```
@if (plan.destacado) {
  <div class="text-center mt-3">... badge "Más popular" ...</div>
}
```

- Si `plan.destacado` es `true`, el bloque se renderiza; si es `false`, **no se crea ni una sola etiqueta** en el DOM (nada de elementos escondidos). Esto reemplaza a `*ngIf`.
- Angular también soporta `@else if` y `@else` (los verás en la guía 05).

#### Enlace de clase dinámica `[class]`

```
[class]="plan.destacado ? 'btn-primary' : 'btn-outline-primary'"
```

- El atributo `[class]` (con corchetes) hace que **Angular evalúe la expresión** y ponga el resultado como clase del elemento.
- Como el `<a>` ya tiene `class="btn mt-auto"`, Angular **mezcla** las estáticas (`btn`, `mt-auto`) con la dinámica (`btn-primary` u `btn-outline-primary`). Detalle: si usa `[class]` (todo el atributo), la estática se conserva; si usas `[class]` y luego `[class.xxx]`, cuidado con conflictos (mira la guía 05, donde usamos `[class.show]`).

#### Interpolación combinada con texto fijo

`${{ plan.precio }}` y `Elegir {{ plan.nombre }}`: el texto literal (`$`, `Elegir`) está a un lado y la interpolación `{{ }}` dentro del mismo elemento. Perfectamente válido y muy usado.

#### El `✓`

Es un carácter Unicode (una marca de verificación) pegada como texto, **no un ícono de Bootstrap** (los íconos de Bootstrap requieren otra librería: Bootstrap Icons). Ventaja: cero dependencias; es solo texto.

## Conectar el componente

- En `app.ts`: importar `Pricing` y agregarlo a `imports`.
- En `app.html`: `<app-pricing />` después de `<app-features />`.

## Validar

- [ ] 3 cards de precio centradas en su fila.
- [ ] Solo el plan Pro muestra el badge "Más popular" y el botón azul sólido.
- [ ] Los otros dos planes tienen botón `outline`.
- [ ] Los botones de las tres cards quedan alineados al fondo en desktop.
- [ ] El clic en "Precios" del navbar salta a esta sección.

## Siguiente paso

Guía 05 — FAQ: `docs/05-faq.md`