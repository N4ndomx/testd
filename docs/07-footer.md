# 07 · Footer

> Objetivo: pie de página oscuro con columnas de links y copyright. Cierre de la landing.

## Qué practicas

- Tema oscuro con `bg-dark` + `text-white` sobre la grilla de Bootstrap.
- Variantes de texto: `text-white-50`, `link-light`, `text-decoration-none`.
- Separador horizontal con clases del tema (`border-secondary`).

## Comando

```bash
ng generate component sections/footer --skip-tests
```

## Código

### `src/app/sections/footer/footer.html`

```html
<footer class="bg-dark text-white py-5">
  <div class="container py-4">
    <div class="row row-cols-1 row-cols-md-3 g-4">
      <div class="col">
        <p class="h5 fw-bold mb-2">Producto X</p>
        <p class="text-white-50 mb-0">
          La herramienta que simplifica tu trabajo diario.
        </p>
      </div>
      <div class="col">
        <p class="h6 fw-bold mb-3">Producto</p>
        <ul class="list-unstyled mb-0">
          <li class="mb-2"><a class="link-light text-decoration-none" href="#features">Características</a></li>
          <li class="mb-2"><a class="link-light text-decoration-none" href="#pricing">Precios</a></li>
          <li class="mb-2"><a class="link-light text-decoration-none" href="#faq">Preguntas frecuentes</a></li>
        </ul>
      </div>
      <div class="col">
        <p class="h6 fw-bold mb-3">Contacto</p>
        <ul class="list-unstyled mb-0">
          <li class="mb-2"><a class="link-light text-decoration-none" href="mailto:hola@productox.app">hola@productox.app</a></li>
          <li class="mb-2"><a class="link-light text-decoration-none" href="#contact">Formulario de contacto</a></li>
        </ul>
      </div>
    </div>
    <hr class="border-secondary my-4" />
    <p class="text-white-50 small mb-0">
      © 2026 Producto X. Todos los derechos reservados.
    </p>
  </div>
</footer>
```

## Glosario profundo

### A. Los elementos HTML

| Elemento | Qué es | Por qué lo usamos aquí |
|---|---|---|
| `<footer>` | Pie de página semántica | Contiene información de contacto, enlaces y copyright del sitio. Un `<footer>` por página (o sección) es lo esperado. |
| `<div>` | Contenedor del grid | Mismo rol que en todas las guías: `container` → `row` → `col`. |
| `<p>` | Párrafo | Aquí con dos usos: títulos de columna (con clases `h5`/`h6` para "fingir" encabezado sin usar un `<h3>` que rompería la jerarquía) y textos normales (eslogan, copyright). |
| `<ul>` + `<li>` | Lista de enlaces | Cada columna de links es una lista (`list-unstyled` para quitar viñetas). Semánticamente más correcto que una serie de `<p>` con enlaces. |
| `<a href="...">` | Enlace | Dos tipos: **anclas internas** (`#features`, `#pricing`, `#faq`, `#contact`) y **correo** (`mailto:`). |
| `<hr>` | Regla horizontal (*horizontal rule*) | Divide la sección de links del copyright. Es un elemento "vacío" (no tiene etiqueta de cierre). Bootstrap le da estilos propios con la clase `border-secondary`. |

### Los dos tipos de `href` que ves aquí

| Valor | Qué hace el navegador |
|---|---|
| `#features` | Hace scroll a la sección con `id="features"` (mismo mecanismo del navbar). |
| `mailto:hola@productox.app` | Abre el cliente de correo del usuario con la dirección prefijada. Puedes agregar `?subject=...&body=...` para precargar asunto y cuerpo. |

### B. Las clases de Bootstrap

#### Tema oscuro

| Clase | Efecto | Detalle |
|---|---|---|
| `bg-dark` | Fondo negro/azulado (#212529) | Una de las paletas de color de Bootstrap. Alternativas: `bg-primary`, `bg-body`, `bg-black`, etc. |
| `text-white` | Texto blanco puro | Contraste tuve sobre `bg-dark`. |
| `text-white-50` | Texto blanco al **50% de opacidad** | Para el eslogan y el copyright: texto presente pero "sin tanto peso" visual. |

#### Encabezados "fingidos" (utility-headings)

| Clase | Efecto | Detalle |
|---|---|---|
| `h5` / `h6` como clase | Aplica el tamaño/estilo de un `<h5>`/`<h6>` a CUALQUIER elemento | Por eso los titulamos sobre `<p>`: no queremos sumar elementos `<h1>`–`<h6>` reales a la jerarquía de la página (que ya está completa con las secciones). "Display headings classes" es el nombre técnico de esto en Bootstrap. |
| `fw-bold` | Negrita | Refuerza el título de cada columna. |

#### Enlaces en fondo oscuro

| Clase | Efecto | Detalle |
|---|---|---|
| `link-light` | Color de enlace claro (compatible con fondo oscuro) | El enlace default de Bootstrap es azul oscuro: sobre `bg-dark` se perdería. `link-light` lo aclara; al hacer hover se oscurece ligeramente. |
| `text-decoration-none` | Elimina el subrayado del enlace | Bootstrap subraya los links por defecto; para un menú de footer el look es "sin subrayado". |

#### Lista y separador

| Clase | Efecto |
|---|---|
| `list-unstyled` | Quita las viñetas de la lista (vista en guía 04). |
| `mb-2` / `mb-0` / `mb-3` | Márgenes inferiores (vistas). `mb-2` separa cada link; `mb-0` limpia el final. |
| `border-secondary` en `<hr>` | Pinta la línea con el color secundario de la paleta | El `<hr>` default de Bootstrap es gris; aquí lo hacemos gris más visible/acorde al tema. `border-*` = color de borde (aquí, todo el borde es la "línea" del hr). |
| `my-4` | `margin-top/bottom: 1.5rem` | Aire arriba y abajo del separador (la `y` = vertical). |
| `small` | Reduce el tamaño de fuente al 87.5% | Clásico para el copyright. Puedes cambiar `small` por `small { font-size: 0.875em }` (equivalente). |

### C. Los "sin clase": datos ceros en el footer

El footer es **100% estático**: sin datos de Angular, sin bindings, sin control flow. Es HTML + clases de Bootstrap. Es importante distinguir cuándo un componente necesita lógica (características, precios, faq, contacto) y cuándo basta con markup (navbar, hero, footer). `footer.ts` queda exactamente como lo crea el CLI.

## Conectar el componente

- En `app.ts`: importar `Footer` y agregarlo a `imports`.
- En `app.html`: `<app-footer />` al final, fuera de `<main>`.

## Validar

- [ ] El footer es oscuro y ocupa el ancho completo.
- [ ] 3 columnas: marca, links de producto y contacto.
- [ ] En móvil las columnas se apilan.
- [ ] Los links internos (`#features`, `#pricing`, `#faq`, `#contact`) funcionan como anclas.
- [ ] El correo `mailto:` abre el cliente de correo.
- [ ] El copyright `© 2026 Producto X` está al fondo, separado por una línea.

## ¡Landing terminada!

Regresa al inicio y repasa el checklist general de `docs/00-inicio.md`. Si quieres empezar de nuevo desde cero para practicar, borra `src/app/sections/`, vacía `app.html`/`app.css`, revierte `app.ts` e `index.html`, y sigue las guías una a una.