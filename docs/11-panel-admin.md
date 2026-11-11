# 11 · Panel de administración con roles (admin / user)

> Objetivo: subir un nivel el panel admin para que se vea como un **panel clásico básico** (barra lateral + zona de contenido) y que **muestre lo que puede ver según el rol**: el `admin` ve **todas** las funcionalidades; el `user` ve una lista **reducida**. Así aprendes roles en un servicio, `@if` / `@for` con Angular y una alarma importante de seguridad.

## Conceptos antes de código

| Concepto | Qué es | En nuestro proyecto |
|---|---|---|
| **Roles** | Niveles de permiso que decide qué puede hacer cada usuario | Roles `admin` (todo) y `user` (reducido) |
| **`esAdmin()`** | El servicio pregunta el rol guardado y responde sí/no | El panel elige qué mostrar según esa respuesta |
| **`@if` / `@for`** | Control de flujo nuevo de Angular | `@if (esAdmin)` decide bloques; `@for` pinta los módulos en sidebar y cards |
| **Panel "clásico"** | Layout típico de administración | `aside` (menú lateral oscuro) + `main` (contenido) |

## Credenciales de prueba

> **admin** / `1234` → ve TODO (Usuarios, Pedidos, Productos, Configuración)
> **user** / `1234` → ve solo lo reducido (Mi cuenta, Mis pedidos)
> Ambas usan la misma contraseña a propósito, para que el diferenciador sea el **usuario/rol** y no la clave.

## Archivos

- **Modificas:**
  - `src/app/services/auth.service.ts` → agrega roles, `usuarioActual()`, `rolActual()`, `esAdmin()`.
  - `src/app/pages/login/login.ts` y `login.html` → texto con las dos credenciales y validación con `FormGroup` (usuario/contraseña con longitud mínima).
  - `src/app/pages/admin/admin.ts` y `admin.html` → panel clásico con roles.

---

## Código 1 — El servicio con roles

### `src/app/services/auth.service.ts`

```ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly CLAVE_USUARIO = 'producto-x-usuario';
  private readonly CLAVE_ROL = 'producto-x-rol';

  private readonly usuarios: Record<string, string> = {
    admin: '1234',
    user: '1234',
  };

  estaAutenticado(): boolean {
    return this.usuarioActual() !== null;
  }

  usuarioActual(): string | null {
    return localStorage.getItem(this.CLAVE_USUARIO);
  }

  rolActual(): string | null {
    return localStorage.getItem(this.CLAVE_ROL);
  }

  esAdmin(): boolean {
    return this.rolActual() === 'admin';
  }

  iniciarSesion(usuario: string, contrasena: string): boolean {
    if (this.usuarios[usuario] === contrasena) {
      localStorage.setItem(this.CLAVE_USUARIO, usuario);
      localStorage.setItem(this.CLAVE_ROL, usuario);
      return true;
    }
    return false;
  }

  cerrarSesion(): void {
    localStorage.removeItem(this.CLAVE_USUARIO);
    localStorage.removeItem(this.CLAVE_ROL);
  }
}
```

### Glosario profundo

| Línea | Detalle |
|---|---|
| `usuarios: Record<string, string>` | Un **mapa** de credenciales: "usuario → contraseña". `Record<clave, valor>` es la forma tipada de TS para un objeto con pares. Agregar un usuario es añadir una línea. |
| `this.usuarios[usuario] === contrasena` | Valida mirando el **mapa** (antes era un `&&` fijo). Así validamos los dos roles con la misma lógica. |
| `CLAVE_USUARIO` y `CLAVE_ROL` | Guardamos el nombre y el rol por separado en `localStorage`. El rol es la "placa" que decide permisos. |
| `usuarioActual()` | Devuelve el nombre o `null` si no hay sesión (útil para el "Bienvenido, X"). |
| `rolActual()` | Devuelve `'admin'`, `'user'` o `null`. |
| `esAdmin()` | `rolActual() === 'admin'`. Es la pregunta que hace toda la interfaz del panel. |
| `estaAutenticado()` | Ahora delegada en `usuarioActual()`: `!== null`. El guard sigue funcionando igual. |

> **Alarma de seguridad importante:** aquí el **rol lo elige el usuario al loguear** (el propio dato `user`/`admin` viene de `localStorage`, que un alumno puede editar en DevTools → *Application → Local Storage*). En un proyecto real, **el rol lo asigna el backend** al verificar credenciales contra una base de datos y se recibe en un token firmado. El panel solo *pinta* distinto; la verdadera seguridad vive en el servidor. Para clase está perfecto porque así puedes **demostrar** el riesgo.

---

## Código 2 — El login con las dos credenciales y validación

En la guía 10 el login ya validaba con `FormGroup` (usuario + mínimo 3, contraseña + mínimo 4) usando `invalido()`. Para el panel con roles solo cambia el **texto de pista** y que `iniciarSesion()` ahora resuelve ambos usuarios porque lee el **mapa** del servicio. La estructura reactiva no cambia.

### `src/app/pages/login/login.html` (texto de pista)

```html
<p class="text-muted mb-4">Usa admin / 1234 o user / 1234 para entrar.</p>
```

### `src/app/pages/login/login.ts` (solo el envío ya resuelve ambos)

```ts
protected iniciar(): void {
  if (this.formulario.invalid) {
    this.formulario.markAllAsTouched();
    return;
  }
  const { usuario, contrasena } = this.formulario.value;
  if (this.auth.iniciarSesion(usuario ?? '', contrasena ?? '')) {
    this.router.navigate(['/admin']);
  } else {
    this.error = true;
  }
}
```

> No hay que tocar `login.ts` para que funcione con los dos roles: `iniciarSesion()` ya hace la validación de credenciales contra el **mapa** del servicio. El fragmento de arriba solo recuerda que el envío sigue *después* del `FormGroup` (dos capas: teclado → servicio).

---

## Código 3 — El panel clásico con roles

### `src/app/pages/admin/admin.ts`

```ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [],
  selector: 'app-admin',
  styleUrl: './admin.css',
  templateUrl: './admin.html',
})
export class Admin {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly usuario = this.auth.usuarioActual();
  protected readonly esAdmin = this.auth.esAdmin();
  protected readonly modulos = this.auth.esAdmin()
    ? ['Usuarios', 'Pedidos', 'Productos', 'Configuración']
    : ['Mi cuenta', 'Mis pedidos'];

  protected salir(): void {
    this.auth.cerrarSesion();
    this.router.navigate(['/']);
  }
}
```

### `src/app/pages/admin/admin.html`

```html
<div class="admin-panel d-flex min-vh-100">
  <aside class="bg-dark text-white p-4" style="width: 240px">
    <h4 class="fw-bold mb-4">Panel</h4>

    <ul class="list-unstyled">
      @for (modulo of modulos; track modulo) {
        <li class="mb-2">{{ modulo }}</li>
      }
    </ul>

    <button class="btn btn-outline-light w-100 mt-4" (click)="salir()">
      Cerrar sesión
    </button>
  </aside>

  <main class="flex-grow-1 p-4 bg-light">
    <h1 class="fw-bold">Bienvenido, {{ usuario }}</h1>
    <p class="text-muted mb-4">
      @if (esAdmin) {
        Tienes acceso a todos los módulos.
      } @else {
        Tu rol tiene un acceso reducido.
      }
    </p>

    <div class="row g-3">
      @for (modulo of modulos; track modulo) {
        <div class="col-md-6 col-lg-3">
          <div class="card shadow-sm h-100">
            <div class="card-body text-center">
              <h5 class="fw-bold mb-0">{{ modulo }}</h5>
            </div>
          </div>
        </div>
      }
    </div>
  </main>
</div>
```

### Glosario profundo

| Elemento | Detalle |
|---|---|
| `modulos` calculado una sola vez | La **misma** propiedad alimenta sidebar y cards. Si el rol es `admin` trae 4 módulos; si no, 2. Un solo lugar para decidir = más fácil de explicar y mantener. |
| `@if (esAdmin)` en el `<p>` | Enseña el **bloque condicional**: solo se renderiza una de las dos frases. |
| `@for (modulo of modulos; track modulo)` | Pinta una lista/una card **por cada elemento** sin repetir HTML a mano. `track` le da a Angular una identidad estable para cada item. |
| `aside` + `main` con `d-flex` | La barra lateral (240px, oscura) y el contenido (que se estira con `flex-grow-1`). Ese es el esqueleto de todo panel clásico. |
| `col-md-6 col-lg-3` | Responsive de Bootstrap: en pantallas medianas 2 por fila, en grandes 4. Con 2 módulos del `user`, quedan 2 por fila. |
| `bienvenido, {{ usuario }}` | Interpolación (vínculo) para mostrar el valor de la propiedad en el HTML. |

---

## Conectar (orden de los cambios)

1. **Servicio** — primero los roles (`usuarios`, `rolActual`, `esAdmin`); nada más depende de él al revés.
2. **Login** — solo actualiza el texto; la lógica ya resuelve ambos usuarios.
3. **Admin** — reescribe el componente con `esAdmin` + `modulos` y la plantilla con el layout clásico.

## Validar en el navegador

1. `ng serve` → entra por el navbar a "Iniciar sesión".
2. Entra con **`admin` / `1234`** → el panel muestra: sidebar y cards con **Usuarios, Pedidos, Productos, Configuración** y el mensaje "Tienes acceso a todos los módulos".
3. "Cerrar sesión", vuelve a entrar con **`user` / `1234`** → aparecen **solo** "Mi cuenta" y "Mis pedidos" con "Tu rol tiene un acceso reducido".
4. **Bonus didáctico:** en DevTools → *Application → Local Storage* cambia a mano `producto-x-rol` de `user` a `admin` y recarga → verás el panel completo sin volver a loguear. ¡Exacto! Esa es la **falla de seguridad** que en producción resuelve el backend.

## Cómo explicarlo en clase (secuencia sugerida)

1. **"¿Cómo sabe la app qué mostrarle a cada quien?"** → por el **rol**.
2. **Servicio:** ahora guarda usuario y rol; `esAdmin()` es la pregunta central.
3. **Definir una sola vez** dónde cambia el contenido: `modulos` según rol (en vez de esparcir `@if` por todo el HTML).
4. **Mostrar el riesgo:** editar el rol en Local Storage y recargar → "¿por qué pudo hacer eso un alumno con DevTools?" → el backend debe decidir, no el navegador.

## Errores típicos (a buscar en clase)

| Error | Causa y solución |
|---|---|
| Ambos roles ven lo mismo | El `@if (esAdmin)` no separa los bloques, o `rolActual()` siempre devuelve `admin` (revisa qué se guardó al loguear). |
| Cerré sesión y `/admin` sigue abriendo | El guard está bien, pero `cerrarSesion()` no borró **las dos** claves (usuario y rol) de `localStorage`. |
| Se ve el "Bienvenido, null" | `usuarioActual()` devuelve `null` sin sesión; el panel solo es alcanzable logueado gracias al guard, así que no debería ocurrir — buena señal para testear el guard. |
| El panel no se hace responsive | Faltan las columnas de Bootstrap (`col-md-6 col-lg-3`) o el `row g-3` que las agrupa. |
| Olvidé qué rol tengo al refrescar | De nuevo es `localStorage`; la sesión (y el rol) sobreviven al refresco por diseño. |

## Siguiente paso

- **Extensión sugerida:** dar de alta usuarios y roles en el **backend** y recibir el rol en un token (JWT). El navegador solo *muestra* según el token; no puede editarlo.
- **Para clase:** intentar que el "Cerrar sesión" aparezca también en el navbar solo cuando hay sesión (usando `estaAutenticado()` en el navbar).