# 00 · Preparación del proyecto

> Componente base obligatorio. Haz esto una sola vez antes de empezar las demás guías.

## Objetivo

Dejar el proyecto listo para construir la landing: limpiar el "welcome page" de Angular y conectar Bootstrap por CDN.

## Archivos que vas a tocar

- `src/index.html` → enlazar CSS y JS de Bootstrap.
- `src/app/app.html` → borrar el contenido de ejemplo.
- `src/app/app.css` → dejar vacío.

## Paso 1: Enlazar Bootstrap en `src/index.html`

Abre `src/index.html`. Agrega la línea del CSS dentro del `<head>`, antes de cerrarlo:

```html
<head>
  <meta charset="utf-8">
  <title>Producto X</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <!-- CSS de Bootstrap -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
</head>
```

Luego, justo antes de cerrar `</body>`, el **JavaScript** de Bootstrap (el bundle trae los componentes interactivos: menú desplegable, acordeón, etc.):

```html
<body>
  <app-root></app-root>
  <!-- JS de Bootstrap (componentes interactivos) -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
</body>
```

### ¿Por qué los dos?

- El **CSS** pinta todo: grilla, botones, cards, formularios.
- El **JS** hace funcionar lo que abre/cierra y se anima (navbar colapsable, acordeón). Sin él, los paneles y el menú móvil no responden.

## Glosario profundo

### Los elementos HTML de este archivo

| Elemento | Qué es y qué hace | Detalle |
|---|---|---|
| `<!doctype html>` | Declaración de tipo de documento | Le dice al navegador que use el estándar HTML5 (modo *standards*, no "quirks mode"). Debe ser SIEMPRE la primera línea. |
| `<html lang="en">` | Elemento raíz de todo el documento | Contiene toda la página. `lang` indica el idioma: úsalo para accesibilidad y SEO. Lo ideal sería `lang="es"`; el valor `en` viene por default de Angular. |
| `<head>` | Cabecera del documento | No se ve en pantalla; solo metadata, enlaces a estilos y scripts. |
| `<meta charset="utf-8">` | Codificación de caracteres | Permite que se muestren bien tildes, ñ, emojis y caracteres especiales. Sin esto el texto se vería corrupto. |
| `<title>` | Título de la pestaña | Es lo que aparece en la pestaña del navegador y en resultados de búsqueda. Lo cambiamos a "Producto X". |
| `<base href="/">` | URL base relativa | Le dice al navegador que las rutas relativas parten de la raíz del servidor. **Necesario para que el router de Angular funcione**; no lo borres. |
| `<meta name="viewport" ...>` | Config. de la ventana en móvil | `width=device-width` → el ancho de pantalla = ancho del dispositivo (sin zoom raro); `initial-scale=1` → sin zoom inicial. **Imprescindible para el responsive de Bootstrap.** |
| `<link rel="icon" ...>` | Favicon | Ícono de la pestaña. `rel` = relación del archivo con el documento; `type="image/x-icon"` = formato; `href` = ruta del archivo. |
| `<link rel="stylesheet" href="...bootstrap.min.css">` | **Enlaza una hoja de estilos** | El navegador *descarga* el archivo CSS de la URL indicada y aplica sus estilos al documento. `rel="stylesheet"` es obligatorio en este contexto; `href` es la ubicación del archivo. |
| `<body>` | Cuerpo visible | Todo lo que se muestra al usuario va aquí (o dentro de componentes que Angular inyecta aquí). |
| `<app-root></app-root>` | Selector de componente Angular | Es la "caja" donde Angular monta la app completa. Al compilar, Angular reemplaza esto con el contenido del componente `App`. El guion en `app-root` es obligatorio para selectores de componentes. |
| `<script src="...bootstrap.bundle.min.js">` | Incluye un archivo JavaScript | El navegador ejecuta este JS al cargar. Bootstrap "escanea" el DOM y les da vida a los componentes marcados con `data-bs-*`. Se coloca al final del `<body>` para no bloquear el render inicial. |

### Las etiquetas que NO se ven pero importan

- Los `<!-- comentarios -->` no se renderizan; solo documentan tu HTML. Úsalos para explicar secciones.
- El `<head>` y el `<title>` los envía el navegador como parte del *documento*, aunque no los veas pintados.

### ¿Por qué el CDN (enlace externo) y no un archivo local?

El enlace apunta a `cdn.jsdelivr.net`, una red de distribución que sirve Bootstrap en todo el mundo:
- No instalas nada en el proyecto (`node_modules` no se ensucia).
- El navegador carga el CSS y el JS directamente de la CDN.
- Contras: la página depende de tener internet, y no funciona en offline.

> Existe una alternativa no-CDN: instalar con `npm i bootstrap` y declarar el CSS en `angular.json` (bloque `styles`). Preferimos el CDN porque es lo que elegiste y porque mantiene `angular.json` intacto.

## Paso 2: Limpiar el placeholder

`src/app/app.html` viene lleno de la página de bienvenida de Angular (SVG, estilos, texto "Hello"). Bórralo todo y deja únicamente:

```html
<router-outlet />
```

### ¿Qué es `<router-outlet />`?

- Es una **directiva componente de Angular** que funciona como "punto de montaje" del router.
- En lugar de ser un elemento real del HTML, Angular lo *reemplaza* por la vista de la ruta activa.
- Lo dejamos por si luego agregas más rutas (`/`, `/login`, etc.). Mientras no haya rutas definidas, no renderiza nada visible.

## Paso 3: Validar

```bash
ng serve
```

Abre `http://localhost:4200`. Debe verse una **página en blanco** (la plantilla de ejemplo ya no aparece).

- [ ] La página se ve en blanco.
- [ ] `ng serve` no muestra errores.

## Siguiente paso

Pasa a la Guía 01 — Navbar: `docs/01-navbar.md`