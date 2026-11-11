# 08 · Página "Nosotros" (con Angular Router)

> Objetivo: crear una página **separada** (no anclada en el index) a la que la app navega por **ruta**: `/` → landing completa, `/nosotros` → página Nosotros. Aquí aprendes el **Angular Router**.

## Qué es "una página aparte" en Angular

Hasta la guía 07 todo vive en una sola vista: el `App` pintaba todos los componente juntos. Ahora convertimos la landing en un "layout" con dos páginas:

| Ruta | Página | Qué muestra |
|---|---|---|
| `/` | `Home` | Hero + Características + Precios + FAQ + Contacto |
| `/nosotros` | `Nosotros` | La nueva página "Sobre nosotros" |

El **router** decide qué componente se dibuja dentro de `<router-outlet>` según la URL. Ventajas: URL real por página (`/nosotros`), botones "atrás/adelante" del navegador funcionando, y la **navbar y el footer se comparten** en ambas páginas (viven en `App`, que es el layout).

## Archivos que creas / modificas

- **Nuevo:** `src/app/pages/nosotros/nosotros.{ts,html,css}` (la página).
- **Nuevo:** `src/app/pages/home/home.{ts,html,css}` (mueve las secciones del index a esta "página").
- **Modificas:** `src/app/app.routes.ts` (el mapa de rutas), `src/app/app.ts` + `app.html` (ahora solo layout), `sections/navbar/*` y `sections/footer/*` (enlaces con `routerLink`).

## Comandos

```bash
ng generate component pages/home --skip-tests
ng generate component pages/nosotros --skip-tests
```

> Carpeta `pages/`: agrupamos ahí las "páginas" (vistas a las que se navega), y dejamos `sections/` para piezas reutilizables. Es una decisión de estructura, no técnica.

## Qué practicas (Angular Router)

- Configuración de rutas: `Routes`, `{ path, component }`, `pathMatch`.
- Directivas: `RouterOutlet` (dónde se pinta la página), `RouterLink` (enlaces SPA), `RouterLinkActive` (resaltar enlace activo).
- `fragment` para "anclar" tras navegar.
- Layout compartido: navbar/footer fuera del router-outlet → aparecen en ambas páginas.

---

## Paso 1: el mapa de rutas — `src/app/app.routes.ts`

```ts
import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Nosotros } from './pages/nosotros/nosotros';

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' },
  { path: 'nosotros', component: Nosotros },
];
```

### Glosario profundo

| Pieza | Qué es y qué hace |
|---|---|
| `Routes` (tipo) | Es solo un *tipo* de TypeScript: un arreglo de objetos que describe "qué URL muestra qué componente". |
| `{ path: '', component: Home }` | Una **ruta**: cuando la URL es vacía (`/`), se pinta `Home`. |
| `pathMatch: 'full'` | **Exigencia de que la URL coincida COMPLETA.** Sin esto, `path: ''` con el default (`prefix`) intentaría "igualar" URLs que también empiezan vacías… y puede robarse rutas. Para rutas vacías/redirect siempre usa `pathMatch: 'full'`. |
| `{ path: 'nosotros', component: Nosotros }` | Segunda ruta: la URL `/nosotros` pinta la página `Nosotros`. Sin `pathMatch` porque al ser una sola palabra no hay ambigüedad. |
| Orden del arreglo | Se evalúa de arriba a abajo; la primera que "empata" gana. Por eso las rutas más específicas suelen ir primero. |

## Paso 2: el layout — `App` queda como cascarón

### `src/app/app.ts`

```ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './sections/navbar/navbar';
import { Footer } from './sections/footer/footer';

@Component({
  imports: [RouterOutlet, Navbar, Footer],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
```

### `src/app/app.html`

```html
<app-navbar />

<main class="routed-content">
  <router-outlet />
</main>

<app-footer />
```

### Explicación (el layout compartido)

- `App` ya **no importa las secciones** (hero, features, …): solo `Navbar`, `Footer` y `RouterOutlet`.
- `<router-outlet />` es el "agujero mágico": Angular **reemplaza ese elemento por el componente de la ruta activa** (`Home` o `Nosotros`).
- Como navbar y footer están **fuera** del router-outlet, se renderizan **siempre**, sin importar la ruta. Eso es "un layout": una cáscara común y un contenido variable.
- El `<main class="routed-content">` envuelve al router-outlet solo para darle un contenedor semántico donde pintar las páginas.

## Paso 3: la página `Home` — junta las secciones

### `src/app/pages/home/home.ts`

```ts
import { Component } from '@angular/core';
import { Hero } from '../../sections/hero/hero';
import { Features } from '../../sections/features/features';
import { Pricing } from '../../sections/pricing/pricing';
import { Faq } from '../../sections/faq/faq';
import { Contact } from '../../sections/contact/contact';

@Component({
  imports: [Hero, Features, Pricing, Faq, Contact],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {}
```

### `src/app/pages/home/home.html`

```html
<app-hero />
<app-features />
<app-pricing />
<app-faq />
<app-contact />
```

### Explicación

- `Home` **es la landing completa**: un simple "sandwich" de las secciones ya construidas. No tiene `hero` propio: usa los componentes.
- Cambiamos el contenido del viejo `App` aquí. Todo el HTML que estaba en `app.html` (las secciones) se movió a `home.html`.
- Ruta relativa de imports: desde `src/app/pages/home/`, para llegar a `src/app/sections/` hay que salir DOS carpetas: `../../sections/…` (Error típico: usar `../sections`, que apunta a `src/app/pages/sections` y rompe el build — ver abajo "errores típicos").

## Paso 4: la página `Nosotros`

### `src/app/pages/nosotros/nosotros.ts`

```ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-nosotros',
  styleUrl: './nosotros.css',
  templateUrl: './nosotros.html',
})
export class Nosotros {
  protected readonly valores = [
    {
      titulo: 'Simplicidad',
      descripcion:
        'Eliminamos lo innecesario para que lo importante brille por sí solo.',
    },
    {
      titulo: 'Confianza',
      descripcion:
        'Cuidamos tus datos y tus procesos como si fueran los nuestros.',
    },
    {
      titulo: 'Colaboración',
      descripcion:
        'Escuchamos a quienes usan el producto y aprendemos de ellos.',
    },
    {
      titulo: 'Mejora continua',
      descripcion:
        'Evolucionamos cada semana, no cada año: pequeños avances constantes.',
    },
  ];
}
```

### `src/app/pages/nosotros/nosotros.html`

```html
<section class="bg-light">
  <div class="container py-5">
    <div class="row justify-content-center text-center py-5">
      <div class="col-lg-8">
        <span class="badge text-bg-primary rounded-pill mb-3">Conócenos</span>
        <h1 class="display-4 fw-bold mb-3">Sobre Producto X</h1>
        <p class="lead text-muted mb-0">
          Un equipo pequeño con una misión grande: hacer que tu día a día
          sea más simple, rápido y transparente.
        </p>
      </div>
    </div>
  </div>
</section>

<section id="nosotros" class="py-5">
  <div class="container py-4">
    <div class="row g-4">
      <div class="col-md-6">
        <div class="card h-100 shadow-sm border-0">
          <div class="card-body p-4">
            <h2 class="h5 card-title">Nuestra misión</h2>
            <p class="card-text text-muted mb-0">…</p>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card h-100 shadow-sm border-0">
          <div class="card-body p-4">
            <h2 class="h5 card-title">Nuestra visión</h2>
            <p class="card-text text-muted mb-0">…</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="bg-light py-5">
  <div class="container py-4">
    <div class="text-center mb-5">
      <h2 class="fw-bold">Nuestros valores</h2>
      <p class="text-muted mb-0">Los principios que guían cada decisión.</p>
    </div>
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
      @for (valor of valores; track valor.titulo) {
        <div class="col">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h3 class="h6 card-title">{{ valor.titulo }}</h3>
              <p class="card-text text-muted mb-0">{{ valor.descripcion }}</p>
            </div>
          </div>
        </div>
      }
    </div>
  </div>
</section>

<section class="py-5">
  <div class="container py-4 text-center">
    <h2 class="fw-bold mb-3">¿Hablamos?</h2>
    <p class="text-muted mb-4">
      Conoce el producto de primera mano o escríbenos por el formulario de
      contacto.
    </p>
    <div class="d-flex flex-column flex-sm-row justify-content-center gap-2">
      <a
        class="btn btn-primary btn-lg"
        [routerLink]="['/']"
        fragment="contact"
      >
        Ver precios y escribirnos
      </a>
      <a
        class="btn btn-outline-secondary btn-lg"
        [routerLink]="['/']"
      >
        Volver al inicio
      </a>
    </div>
  </div>
</section>
```

### Glosario profundo — elementos HTML de esta página

| Elemento | Detalle |
|---|---|
| `<section class="bg-light">` (1ª) | Mini "hero" de la página: `row justify-content-center text-center` + `col-lg-8` lo centra y le limita el ancho legible. |
| `<h1 class="display-4 fw-bold">` | **El `<h1>` de ESTA página.** Cada página que sea una vista independiente lleva su `<h1>` (uno por página). |
| `<h2 class="h5 card-title">` | Título de card "fingiendo" tamaño `h5` (ya lo mencionamos en la guía 07): así no inflamos la jerarquía real de encabezados. |
| `<h3 class="h6 card-title">` | Ídem, un nivel más abajo, para los títulos de los valores. |
| `border-0` (card) | Quita el borde de las cards → se ve más "limpio" el bloque misión/visión. |
| Último `<section>` CTA | Cierra la página invitando a volver a la landing (enlaces con `routerLink`, abajo). |

### Clases Bootstrap vistas aquí (repaso rápido)

`bg-light`, `py-5`, `pb-4`, `container`, `row`, `col-lg-8`, `col-md-6`, `col-lg-4`, `g-4`, `justify-content-center`, `text-center`, `badge text-bg-primary rounded-pill`, `display-4`, `fw-bold`, `lead`, `text-muted`, `card`, `h-100`, `shadow-sm`, `card-body`, `card-title`, `card-text`, `row-cols-1 row-cols-md-2 row-cols-lg-4`, `d-flex flex-column flex-sm-row justify-content-center gap-2`, `btn btn-primary/btn-outline-secondary btn-lg`, `mb-3/4/5`, `p-4`, `h5/h6` → **todas ya explicadas en guías 00–07**.

Nuevo detalle: `row-cols-lg-4` → 4 valores en una fila en desktop (grid de 4 columnas).

## Paso 5: la navegación — `routerLink` y `routerLinkActive`

### ¿Por qué `routerLink` y no `href`?

Un `<a href="/nosotros">` **recarga toda la página** (petición HTTP, desaparece el estado de la app). `routerLink` intercepta el clic, **navega en memoria** dentro de Angular y **solo re-pinta el router-outlet**: sin recarga, luego con SPA. El HTML sigue siendo un `<a>` normal (clicable, con Ctrl+clic, etc.).

| Sintaxis | Qué hace |
|---|---|
| `routerLink="/"` | Navega a la ruta raíz (Home). |
| `[routerLink]="['/']" fragment="contact"` | Navega a Home **y** hace scroll hasta el elemento `id="contact"` (el formulario). El `fragment` es la parte `#` de la URL. Funciona porque habilitamos los anclajes en el router (ver abajo). |
| `routerLinkActive="active"` | Añade la clase `active` al enlace SOLO cuando su ruta coincide con la URL actual (resaltado azul del navbar). |
| `[routerLinkActiveOptions]="{ exact: true }"` | Con `exact`, "Inicio" (`/`) solo se marca activo cuando la URL es justo `/`, no en `/nosotros`. |

### Ojo: el scroll de los `fragment` hay que habilitarlo

Por defecto Angular **no hace scroll** al "fragmento" al navegar. Lo activamos en `src/app/app.config.ts`:

```ts
provideRouter(
  routes,
  withInMemoryScrolling({
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
  })
)
```

- `anchorScrolling: 'enabled'` → al navegar con `fragment="contact"`, busca el `id="contact"` y hace scroll.
- `scrollPositionRestoration: 'enabled'` → al cambiar de página, el scroll se restaura arriba (si giras de Home abajo a Nosotros, no llegas a mitad de página).

### `src/app/sections/navbar/navbar.ts` (cambios)

```ts
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive],
  ...
})
export class Navbar {}
```

### `src/app/sections/navbar/navbar.html` (enlaces)

```html
<a class="navbar-brand fw-bold" routerLink="/">Producto X</a>
...
<a class="nav-link" routerLink="/" routerLinkActive="active"
   [routerLinkActiveOptions]="{ exact: true }">Inicio</a>
<a class="nav-link" routerLink="/nosotros" routerLinkActive="active">Nosotros</a>
```

Los enlaces `#features`, `#pricing`, `#faq`, `#contact` siguen siendo **anclas normales**: apuntan a secciones que existen solo en la página `Home`. Funcionan cuando estás en Home; en `Nosotros` no "saltan" (no hay esas ids). (Mejora opcional: convertirlos a `[routerLink]="['/']" fragment="features"` para que funcionen desde cualquier página.)

Lo mismo en el footer: se agregó `<li>…<a routerLink="/nosotros">Nosotros</a></li>` y `footer.ts` importó `RouterLink`.

## En el navegador y en DevTools

- Escribe `http://localhost:4200/nosotros` directamente → Angular resuelve la ruta (no 404).
- El botón "atrás" del navegador regresa a Home. El "adelante" vuelve a Nosotros.
- Inspecciona el `<main>`: verás que el contenido cambia de `app-home` a `app-nosotros` dentro del mismo router-outlet.
- `RouterLinkActive` alterna la clase `active` entre "Inicio" y "Nosotros" según la URL.

## Conectar (resumen de lo que cambió)

- `app.routes.ts` → 2 rutas (`''` y `'nosotros'`).
- `app.ts`/`app.html` → layout: navbar + `router-outlet` + footer.
- `pages/home/*` → la landing de las guías 01–06.
- `pages/nosotros/*` → la nueva página.
- `navbar`/`footer` → `routerLink` + `RouterLink`/`RouterLinkActive` importados.

## Validar

- [ ] `ng serve` → en `/` ves la landing completa con navbar y footer.
- [ ] /nosotros muestra "Sobre Producto X", misión/visión, los 4 valores y el bloque CTA.
- [ ] El clic en "Nosotros" del navbar cambia a la página **sin recargar**.
- [ ] El enlace "Inicio" se resalta solo en `/`; "Nosotros" solo en `/nosotros`.
- [ ] El CTA con `fragment="contact"` navega a `/` y hace scroll hasta el formulario.
- [ ] El footer tiene el enlace "Nosotros" navegable.

## Errores típicos

1. **Ruta relativa mal**: desde `pages/home/`, los imports de secciones son `../../sections/...` (no `../sections/...`). Angular falla con `Unknown reference` / `NG1010`.
2. **`pathMatch` olvidado en `''`**: puede "robarte" otras rutas. Usa `pathMatch: 'full'`.
3. **Olvidar importar `RouterLink`** en el `.ts`: el template con `routerLink` no se compila ("No known property").
4. **`app.spec.ts`**: al sacar el `h1` de `App` (ahora está en Home), el test que buscaba el texto del hero falla → reescríbelo (revisa el spec actual) y provee `provideRouter([])` porque App usa `RouterOutlet`.

## Siguiente paso

Si quieres profundizar en rutas: `redirectTo`, rutas con parámetros (`:id`), `**` para 404, o lazy loading (`loadComponent`). Ahora tu app es de **múltiples páginas** con un layout compartido.