# 01 · Navbar

> Objetivo: barra de navegación fija arriba, con menú que se colapsa en móvil.

## Qué practicas

- Clases de Bootstrap: `navbar`, `navbar-expand-lg`, `navbar-light`, `bg-white`, `sticky-top`, `shadow-sm`.
- El patrón de **colapso** con `data-bs-toggle="collapse"` y `data-bs-target`.
- El **grid** (`container`) y la utilidad `ms-auto` para empujar los enlaces a la derecha.

## Comando

```bash
ng generate component sections/navbar --skip-tests
```

Genera `src/app/sections/navbar/navbar.{ts,html,css}`.

## Código

### `src/app/sections/navbar/navbar.html`

```html
<nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
  <div class="container">
    <a class="navbar-brand fw-bold" href="#">Producto X</a>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Abrir menú"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
        <li class="nav-item">
          <a class="nav-link active" href="#" aria-current="page">Inicio</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#features">Características</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#pricing">Precios</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#faq">FAQ</a>
        </li>
        <li class="nav-item">
          <a class="btn btn-primary px-4" href="#contact">Empezar</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
```

## Glosario profundo

### A. Los elementos HTML

| Elemento | Qué es | Por qué lo usamos aquí |
|---|---|---|
| `<nav>` | Navegación semántica | Marca el bloque de *navegación principal*. Beneficia SEO y accesibilidad (lectores de pantalla lo identifican como menú). Para una landing, la navegación principal va en `<nav>`. |
| `<div>` | Contenedor genérico (bloque) | No aporta significado; es el "cajón" universal. Lo usamos para agrupar y para que Bootstrap aplique su layout sobre él. |
| `<a href="#">` | Enlace (*anchor*) | `href` indica a dónde lleva. Aquí con doble función: **marca/logo** (en el navbar) y **enlaces de menú**. `href="#"` es un enlace de relleno para "Inicio". |
| `<button type="button">` | Botón interactivo | El botón hamburguesa. **Nunca olvides `type="button"`**: dentro de un `<form>` el tipo por defecto de un botón es `submit`, lo que recargaría la página. Aquí no hay form, pero es buena costumbre. |
| `<span>` | Contenedor en línea (*inline*) | A diferencia del `<div>` (bloque), el `<span>` no "rompe la línea". Sirve para meter contenido pequeño dentro de otro elemento, como el ícono del hamburguesa. |
| `<ul>` + `<li>` | Lista desordenada + ítems | `<ul>` es "unordered list" y `<li>` cada elemento. Semánticamente un menú de navegación debe ser una lista: los lectores de pantalla anuncian "lista de 5 elementos". |
| `<span class="navbar-toggler-icon"></span>` | Span vacío de ícono | No tiene texto: Bootstrap lo dibuja (las 3 rayitas) con CSS. Si lo inspeccionas, verás que se pinta una imagen de fondo. |

### Atributos clave del `<button>` hamburguesa

| Atributo | Qué hace | Por qué aquí |
|---|---|---|
| `data-bs-toggle="collapse"` | Activa el plugin *collapse* de Bootstrap | Sin esto, nadie escucha el clic. Bootstrap JS detecta este atributo al cargar. |
| `data-bs-target="#navbarNav"` | Indica *qué* abrir/cerrar | Apunta al `id` del elemento a colapsar (el `div` `id="navbarNav"`). Nota: `data-bs-*` son *data attributes*: atributos HTML inventados por el desarrollador para guardar datos (aquí, config de Bootstrap). |
| `aria-controls="navbarNav"` | Relación para accesibilidad | Dice "este botón controla el elemento con ese id". Lo usa la tecnología de asistencia, no Bootstrap. |
| `aria-expanded="false"` | Estado del menú | "false" = cerrado. Bootstrap lo actualiza a `true`/`false` mientras interactúas. |
| `aria-label="Abrir menú"` | Nombre alternativo | Como el botón solo tiene el ícono (sin texto), los lectores de pantalla necesitan saber *qué es*. `aria-label` describe el botón. |

### B. Las clases de Bootstrap (y cómo se leen)

> Regla general de Bootstrap: **una clase = un propósito**. Las clases se combinan. Cada una es un *selector CSS* que ya existe en `bootstrap.min.css`.

#### Sobre el `<nav>` (clases de la navbar)

| Clase | Efecto CSS | Valor/breakpoint |
|---|---|---|
| `navbar` | Base de la barra: `display:flex`, `flex-wrap`, alineación, `padding` | — |
| `navbar-expand-lg` | **El punto de quiebre**: ≥992px (`lg`) el menú se muestra en una fila; por debajo, se "colapsa" y aparece el hamburguesa. | Las opciones son `sm`, `md`, `lg`, `xl`, `xxl` (576/768/992/1200/1400px). Cambiar `lg` aquí cambia el comportamiento del menú móvil. |
| `navbar-light` | Asume un fondo *claro*: pinta los textos de la marca y enlaces en colores oscuros (contraste correcto). | Alternativa: `navbar-dark` para fondos oscuros (texto claro). |
| `bg-white` | Fondo blanco (utilidad del color) | Se puede reemplazar por `bg-light`, `bg-dark`, etc. |
| `shadow-sm` | Sombra pequeña para "despegar" la barra del contenido | Variantes: `shadow`, `shadow-sm`, `shadow-lg` (ninguna → sin sombra). |
| `sticky-top` | La barra "se pega" arriba al hacer scroll (`position: sticky; top: 0`) | Comportamiento distinto a `fixed-top` (que es `position: fixed` y *flota* cubriendo contenido): con `sticky-top` la barra ocupa su lugar real y el contenido fluye debajo. |

#### El grid: `container`

| Clase | Efecto | Detalle |
|---|---|---|
| `container` | Centra el contenido con `margin: auto` y le da un ancho máximo que crece por breakpoints | En Bootstrap 5: <576px ocupa todo; ≥576px 540px; ≥768px 720px; ≥992px 960px; ≥1200px 1140px; ≥1400px 1320px. Variante `container-fluid` = 100% ancho siempre. |

> Todo bloque "centrado y con respiración" en Bootstrap vive dentro de un `container`. Es el cajón estándar.

#### Sobre el logo (`<a class="navbar-brand">`)

| Clase | Efecto |
|---|---|
| `navbar-brand` | Solo para marca/logos dentro de la navbar. Le da tamaño de fuente y `padding` correctos. |
| `fw-bold` | `font-weight: 700` (negrita). Es una utilidad de texto. |

#### El sistema de colapso (clases del botón y del menú)

| Clase | Efecto |
|---|---|
| `navbar-toggler` | Estiliza el botón hamburguesa (borde redondeado, hover). |
| `navbar-toggler-icon` | Dibuja las 3 rayitas dentro del botón. |
| `collapse` | Oculta el contenido: `display: none`. Al recibir `show` → `display: block`. Bootstrap lo alterna con un deslizamiento animado. |
| `navbar-collapse` | Versión "inteligente" de collapse: en **lg+ se muestra siempre** (ignora el estado colapsado) y en móvil responde al botón. Combinado con `navbar-expand-lg`, *esto* es lo que hace el menú responsivo. |
| `navbar-nav ms-auto` | El `ul`. `navbar-nav` limpiar los estilos de la lista (quita viñetas y margen). |

#### Utilidades de alineación y de "gutter"

| Clase | Efecto | Sistema |
|---|---|---|
| `ms-auto` | `margin-left: auto` → empuja el menú al extremo derecho | `ms` = *margin-start* (respeto el idioma del documento: `left`/`right` vs `start`/`end`). Es una utilidad de margen. |
| `align-items-lg-center` | Alineación vertical de los ítems, solo desde `lg` en adelante | `align-items` = flexbox; el sufijo `-lg` = solo ≥992px. |
| `gap-lg-2` | Separación entre los ítems de la lista, solo desde `lg` (evita pegarlas en modo horizontal) | `gap-*` = propiedad `gap` de flex/grid; tamaño 2 ≈ `0.5rem` (la escala rem: 1=0.25, 2=0.5, 3=1, 4=1.5, 5=3). |

#### Ítems y enlaces del menú

| Clase | Efecto |
|---|---|
| `nav-item` | Contenedor de cada link del navbar. |
| `nav-link` | Estiliza el enlace (padding, color por estado hover/active). |
| `active` + `aria-current="page"` | `active` pinta el link resaltado (azul). `aria-current="page"` refuerza en accesibilidad que "este es el ítem actual". |
| `btn btn-primary px-4` | Convierte el `<a>` en un **botón de Bootstrap**: `btn` = base de botón, `btn-primary` = fondo azul, `px-4` = padding horizontal. Así el CTA "Empezar" se distingue de los enlaces normales. |

### Los enlaces ancla (`href="#...`)

`href="#features"` no abre otra página: el `#` es un **ancla**, y el navegador hace scroll hasta el elemento cuyo `id="features"`. Para que funcionen, **debes crear secciones con esos ids** (en las guías 02–06). Es el mecanismo con el que "navegas" dentro de la landing.

## Conectar el componente

En `src/app/app.ts` (el componente raíz `App`):

```ts
import { Navbar } from './sections/navbar/navbar';
```

Y agrégalo al array `imports: [...]` del decorador `@Component`. Luego, en `src/app/app.html`:

```html
<app-navbar />
```

> Los componentes `section` se generan **standalone**: se declaran simplemente importándolos en `imports`. No hay módulos.

## Validar

```bash
ng serve
```

- [ ] Aparece la barra blanca con "Producto X" y los enlaces a la derecha.
- [ ] Bajando el ancho de la ventana (o en DevTools → modo móvil) aparece el botón hamburguesa.
- [ ] Clic en la hamburguesa despliega los enlaces, y otro clic los oculta.
- [ ] Al hacer scroll, la barra queda fija arriba.
- [ ] Clic en "Características" salta a la sección (aparecerá cuando exista; por ahora no pasa nada si no está).

## Siguiente paso

Guía 02 — Hero: `docs/02-hero.md`