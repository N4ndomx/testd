# 14 · Comentarios con modelo y servicio (carrusel en la home)

> Objetivo: enseñar **modelos**, **servicios** y **consumo de una API real** (`jsonplaceholder.typicode.com`) para pintar comentarios en un **carrusel de Bootstrap** dentro de la home.
>
> A diferencia del Demo/Pokédex (que llaman a `HttpClient` desde el componente), aquí separamos: **modelo** (la forma del dato), **servicio** (traer los datos) y **componente** (mostrarlos).

## La API

`https://jsonplaceholder.typicode.com/comments` devuelve un **arreglo** de objetos:

```json
[
  {
    "postId": 1,
    "id": 1,
    "name": "id labore exercitation et",
    "email": "eliseo@simon.net",
    "body": "et vel quod exercitation ut..."
  }
]
```

Solo usamos los primeros 8 (`.slice(0, 8)`) para que el carrusel no sea infinito.

## Archivos

- **Nuevo:** `src/app/models/comentario.model.ts`
- **Nuevo:** `src/app/services/comentario.service.ts`
- **Nuevo:** `src/app/sections/comentarios/` (`comentarios.ts`, `comentarios.html`, `comentarios.css`)
- **Modificas:** `src/app/pages/home/home.ts` y `home.html` (para insertar el carrusel).

---

## Código 1 — El modelo

### `src/app/models/comentario.model.ts`

```ts
export interface Comentario {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}
```

### Glosario profundo

| Concepto | Detalle |
|---|---|
| **Modelo** | Una `interface` que describe **cómo se ve** cada dato de la API. No genera código en tiempo de ejecución; sirve para tipar y autocompletar. |
| `interface` vs `class` | `interface` solo define la forma; `class` además puede tener métodos y estados. Para consumir una API, una `interface` basta. |
| Campos con el mismo nombre | Debemos usar **exactamente** los nombres que devuelve la API (`name`, `email`, `body`…). Si cambiamos el nombre, el valor llega `undefined`. |
| ¿Qué gano? | Si mañana la API cambia, el error de tipo aparece aquí, en un solo archivo, y no en medio del HTML. |

---

## Código 2 — El servicio

### `src/app/services/comentario.service.ts`

```ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comentario } from '../models/comentario.model';

@Injectable({ providedIn: 'root' })
export class ComentarioService {
  private readonly url = 'https://jsonplaceholder.typicode.com/comments';

  private readonly http = inject(HttpClient);

  obtenerComentarios(): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(this.url);
  }
}
```

### Glosario profundo

| Concepto | Detalle |
|---|---|
| `providedIn: 'root'` | El servicio está disponible en toda la app sin registrarlo en un módulo. |
| `HttpClient` | Cliente HTTP de Angular. Devuelve un **`Observable`** (un flujo de datos que llega en el futuro). |
| `Observable<Comentario[]>` | El tipo de retorno: "cuando los datos lleguen, serán un arreglo de `Comentario`". **No es** el arreglo en sí, aún no ha llegado. |
| `get<T>(url)` | La `<T>` tipa la respuesta: `this.http.get<Comentario[]>(url)` ⇒ `Observable<Comentario[]>`. |
| `obtenerComentarios()` | El componente **no conoce** la URL ni `HttpClient`; solo pide "los comentarios". Si un día cambia la fuente, tocas solo el servicio. |

> **¿Por qué un servicio y no llamar a `HttpClient` en el componente?** Es el principio de *responsabilidad única*: el componente **muestra**, el servicio **trae datos**. Además, varios componentes pueden reusar el mismo servicio.

---

## Código 3 — El componente (carrusel)

### `src/app/sections/comentarios/comentarios.ts`

```ts
import { Component, OnInit, inject } from '@angular/core';
import { Comentario } from '../../models/comentario.model';
import { ComentarioService } from '../../services/comentario.service';

@Component({
  imports: [],
  selector: 'app-comentarios',
  styleUrl: './comentarios.css',
  templateUrl: './comentarios.html',
})
export class Comentarios implements OnInit {
  protected comentarios: Comentario[] = [];
  protected cargando = true;
  protected error = false;

  private readonly servicio = inject(ComentarioService);

  ngOnInit(): void {
    this.servicio.obtenerComentarios().subscribe({
      next: (datos) => {
        this.comentarios = datos.slice(0, 8);
        this.cargando = false;
      },
      error: () => {
        this.error = true;
        this.cargando = false;
      },
    });
  }
}
```

### Glosario profundo

| Concepto | Detalle |
|---|---|
| `ngOnInit()` | Gancho del ciclo de vida que se ejecuta **una vez** cuando el componente nace: lugar ideal para pedir datos. |
| `.subscribe({ next, error })` | **Suscribirse** al `Observable` es lo que dispara la petición. `next` corre cuando llegan datos, `error` si falla. |
| `datos.slice(0, 8)` | Copia el arreglo con solo los primeros 8 elementos. |
| `cargando` / `error` | Estados para pintar "Cargando…", el error o el carrusel con `@if`. |

### `src/app/sections/comentarios/comentarios.html`

```html
<section class="container py-5">
  <h2 class="text-center mb-4">Lo que dicen nuestros usuarios</h2>

  @if (cargando) {
    <p class="text-center text-muted">Cargando comentarios…</p>
  } @else if (error) {
    <p class="text-center text-danger">No se pudieron cargar los comentarios.</p>
  } @else {
    <div id="carouselComentarios" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-indicators">
        @for (comentario of comentarios; track comentario.id; let i = $index) {
          <button
            type="button"
            data-bs-target="#carouselComentarios"
            [attr.data-bs-slide-to]="i"
            [class.active]="i === 0"
            [attr.aria-current]="i === 0 ? 'true' : null"
            [attr.aria-label]="'Comentario ' + (i + 1)"
          ></button>
        }
      </div>

      <div class="carousel-inner">
        @for (comentario of comentarios; track comentario.id; let i = $index) {
          <div class="carousel-item" [class.active]="i === 0">
            <div class="card mx-auto" style="max-width: 600px">
              <div class="card-body text-center">
                <p class="card-text">“{{ comentario.body }}”</p>
                <p class="mb-0"><strong>{{ comentario.name }}</strong></p>
                <small class="text-muted">{{ comentario.email }}</small>
              </div>
            </div>
          </div>
        }
      </div>

      <button class="carousel-control-prev" type="button" data-bs-target="#carouselComentarios" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselComentarios" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
      </button>
    </div>
  }
</section>
```

### Glosario profundo del carrusel

| Elemento | Detalle |
|---|---|
| `#carouselComentarios` + `data-bs-ride="carousel"` | El **id** es el "nombre" del carrusel; los botones apuntan a él. `data-bs-ride="carousel"` lo hace auto-avanzar (usa el JS de Bootstrap ya cargado en `index.html`). |
| `carousel-indicators` | Los puntitos de abajo. Cada botón usa `[attr.data-bs-slide-to]="i"` para ir a la diapositiva `i`. |
| `[class.active]="i === 0"` | Bootstrap marca con `.active` la diapositiva visible. La primera (índice 0) arranca activa. |
| `carousel-inner` + `carousel-item` | La pista y cada tarjeta. **Solo** la `.item.active` se ve. |
| `@for` con `let i = $index` | Genera una diapositiva y un indicador **por cada** comentario, y reutiliza `i` para saber cuál activar. |
| `track comentario.id` | Da a Angular una identidad estable por comentario (mejor rendimiento en listas). |
| `[attr.aria-label]` | Accesibilidad: le nombra el indicador al lector de pantalla. |
| `comentarios.css` | Solo `min-height` y centrado para que la tarjeta no salte al cambiar de slide. |

---

## Código 4 — Insertarlo en la home

### `src/app/pages/home/home.ts`

```ts
import { Component } from '@angular/core';
import { Hero } from '../../sections/hero/hero';
import { Features } from '../../sections/features/features';
import { Comentarios } from '../../sections/comentarios/comentarios';
import { Pricing } from '../../sections/pricing/pricing';
import { Faq } from '../../sections/faq/faq';
import { Contact } from '../../sections/contact/contact';

@Component({
  imports: [Hero, Features, Comentarios, Pricing, Faq, Contact],
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
<app-comentarios />
<app-pricing />
<app-faq />
<app-contact />
```

> El orden importa: el carrusel de testimonios queda entre "Características" y "Precios" (prueba moverlo si prefieres otro lugar).

---

## Validar en el navegador

1. `ng serve` → abre `http://localhost:4200/`.
2. Espera a que cargue (un instante) y verás el carrusel con comentarios.
3. Usa las flechas o los puntitos para cambiar de comentario; también avanza solo.
4. Abre F12 → *Network* y busca `comments` para ver la petición real a JSONPlaceholder.
5. Abre `comentarios.ts` y cambia `.slice(0, 8)` a `.slice(0, 3)` → verás solo 3 comentarios.

## Errores típicos (a buscar en clase)

| Error | Causa / solución |
|---|---|
| Se queda en "Cargando…" | No se hizo `.subscribe(...)` (el `Observable` no se ejecuta hasta suscribirse), o el id del carrusel no coincide. |
| `Property 'body' does not exist` | El campo no está en el **modelo** `comentario.model.ts`. |
| El carrusel no cambia / no hay flechas | Falta el bundle JS de Bootstrap en `index.html`, o `data-bs-target="#carouselComentarios"` no coincide con el `id`. |
| Aparece `undefined` en el nombre | El nombre de propiedad del modelo no coincide con el de la API. |

## Siguiente paso

- Revisar el Pokedex: ahora mismo llama a `HttpClient` **desde el componente**. Refactorízalo igual: `PokemonService` con `obtenerPokemon(nombre)` que devuelva `Observable<Pokemon>`.