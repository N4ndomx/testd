# 10 · Login básico con servicio y guard (Guard route)

> Objetivo: tener un **login sencillo** y un **panel admin protegido**. Al pulsar "Iniciar sesión" se **redirige a `/admin`**; si un usuario no autenticado intenta entrar a `/admin`, el **guard** lo manda de vuelta a `/login`. Así aprendes los tres pilares del login en Angular: **servicio** (estado + lógica), **guard** (protección de rutas) y **redirección con el Router**.

## Conceptos antes de código

| Concepto | Qué es | En nuestro proyecto |
|---|---|---|
| **Servicio** | Clase reutilizable e inyectable (`@Injectable`) que guarda lógica y estado | `AuthService` recuerda quién entró usando `localStorage` |
| **Guard** | Función que decide si una ruta se puede abrir o hay que redirigir | `authGuard` solo deja pasar a `/admin` si hay sesión |
| **Router** | Módulo que mueve al usuario entre pantallas | `router.navigate(['/admin'])` al entrar, y el guard redirige con `createUrlTree` |
| **localStorage** | Almacén del navegador que sobrevive al refrescar la página | Si recargas y sigues logueado, es por esto |

## Credenciales de prueba

> Usuario: **admin** · Contraseña: **1234**
> (Están hardcodeadas en el servicio para que sea didáctico; en producción van en un backend.)

## Archivos

- **Nuevos:**
  - `src/app/services/auth.service.ts` → el "cerebro" del login.
  - `src/app/guards/auth.guard.ts` → la "puerta" de entrada a `/admin`.
  - `src/app/pages/login/` → pantalla de login.
  - `src/app/pages/admin/` → panel protegido.
- **Modificas:** `src/app/app.routes.ts` (rutas + guard) y `src/app/sections/navbar/navbar.html` (botón "Iniciar sesión").

---

## Generarlos con Angular CLI

En lugar de escribir los archivos a mano, Angular CLI los crea con un comando. Ejecútalos desde la raíz del proyecto:

```sh
# Servicio
ng generate service services/auth

# Guard
ng generate guard guards/auth
```

### Glosario de los comandos

| Comando | Qué genera | Detalles |
|---|---|---|
| `ng generate service services/auth` | `src/app/services/auth.service.ts` (+ `auth.service.spec.ts`) | Ya viene con `@Injectable({ providedIn: 'root' })` y un método `constructor` vacío. No añade rutas: el servicio es solo una clase; nosotros ponemos los métodos (`iniciarSesion`, `estaAutenticado`, `cerrarSesion`). |
| `ng generate guard guards/auth` | `src/app/guards/auth.guard.ts` (+ `auth.guard.spec.ts`) | **Pregunta interactiva** "Which type of guard would you like to use?" → elige **`CanActivate`**. Otra opción es usar el flag `--functional` para que cree directamente una función `CanActivateFn`. |
| `--skip-tests` | No crea el archivo `.spec.ts` | Útil si no quieres el archivo de pruebas (o si escribes tú las pruebas aparte). |
| `--flat` | Evita crear carpeta nueva | `ng g service auth --flat` crearía `src/app/auth.service.ts`. Mejor mantener la estructura con carpetas `services/` y `guards/`. |

> El guard generado por CLI trae una plantilla tipo:
>
> ```ts
> import { CanActivateFn } from '@angular/router';
>
> export const authGuard: CanActivateFn = (route, state) => {
>   return true;
> };
> ```
>
> Ahí reemplazamos el cuerpo por nuestra lógica (inyectar `AuthService`, comprobar sesión y devolver `true` o `createUrlTree(['/login'])`). El `route` (la ruta a la que quería ir) y `state` (el estado del router) son los parámetros que recibe la función guard; en nuestro caso no los necesitamos, por eso el guard de la app los omite.

---

## Código 1 — El servicio de autenticación

### `src/app/services/auth.service.ts`

```ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly CLAVE = 'producto-x-usuario';

  estaAutenticado(): boolean {
    return localStorage.getItem(this.CLAVE) === 'admin';
  }

  iniciarSesion(usuario: string, contrasena: string): boolean {
    const valido = usuario === 'admin' && contrasena === '1234';
    if (valido) {
      localStorage.setItem(this.CLAVE, usuario);
    }
    return valido;
  }

  cerrarSesion(): void {
    localStorage.removeItem(this.CLAVE);
  }
}
```

### Glosario profundo

| Línea | Detalle |
|---|---|
| `@Injectable({ providedIn: 'root' })` | El servicio está disponible en toda la app **sin registrarlo en ningún módulo**: Angular crea una única instancia y la inyecta donde se pida. |
| `private readonly CLAVE` | Nombre con el que se guarda el dato en `localStorage`. `readonly` evita que cambien accidentalmente la clave. |
| `estaAutenticado()` | Devuelve `true` **solo sí** el `localStorage` contiene la cadena `'admin'`. Es la pregunta "¿hay sesión?" que hará el guard. |
| `iniciarSesion()` | Compara contra las credenciales fijas. Si son válidas, **guarda la sesión** y devuelve `true`. |
| `cerrarSesion()` | Borra la clave. Al hacerlo, `estaAutenticado()` pasará a `false` y el guard expulsará al usuario. |

> Nota para explicar: este servicio es la **única** fuente de verdad sobre la sesión. Tanto el login, como el guard como el botón "Cerrar sesión" hablan con él; ninguno toca `localStorage` directamente.

---

## Código 2 — El guard (la puerta)

### `src/app/guards/auth.guard.ts`

```ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  if (auth.estaAutenticado()) {
    return true;
  }
  return inject(Router).createUrlTree(['/login']);
};
```

### Glosario profundo

| Concepto | Detalle |
|---|---|
| `CanActivateFn` | Tipo de guard moderno: una **función** que decide si la ruta se puede "activar" (abrir). Devuelve `true` (deja pasar), `false` o un `UrlTree` (una ruta a donde redirigir). |
| `inject(AuthService)` | Obtiene el servicio sin escribirlo en el constructor (estilo moderno de Angular). Como `AuthService` es `providedIn: 'root'`, la función guard también puede usarlo. |
| `createUrlTree(['/login'])` | En lugar de `redirectTo` en el guard devolvemos un **árbol de URL** al navegador: "no estás logueado, vete a /login". El Router hará la navegación. |
| Dónde se aplica | No en el componente: se **declara en la ruta** con `canActivate: [authGuard]` (ver Código 5). |

---

## Código 3 — La página de login

### `src/app/pages/login/login.ts`

```ts
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  protected readonly formulario = new FormGroup({
    usuario: new FormControl('', [Validators.required, Validators.minLength(3)]),
    contrasena: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  protected error = false;

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected invalido(campo: string): boolean {
    const control = this.formulario.get(campo);
    return !!control && control.touched && control.invalid;
  }

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
}
```

### `src/app/pages/login/login.html`

```html
<section class="min-vh-100 d-flex align-items-center">
  <div class="card mx-auto" style="max-width: 400px">
    <div class="card-body p-4">
      <h2 class="fw-bold mb-1">Iniciar sesión</h2>
      <p class="text-muted mb-4">Usa admin / 1234 o user / 1234 para entrar.</p>

      @if (error) {
        <div class="alert alert-danger py-2">
          Usuario o contraseña incorrectos.
        </div>
      }

      <form [formGroup]="formulario" (ngSubmit)="iniciar()" novalidate>
        <div class="mb-3">
          <label class="form-label" for="usuario">Usuario</label>
          <input
            id="usuario"
            class="form-control"
            formControlName="usuario"
            autocomplete="username"
            [class.is-invalid]="invalido('usuario')"
          />
          @if (invalido('usuario')) {
            <div class="invalid-feedback">Mínimo 3 caracteres.</div>
          }
        </div>

        <div class="mb-3">
          <label class="form-label" for="contrasena">Contraseña</label>
          <input
            id="contrasena"
            type="password"
            class="form-control"
            formControlName="contrasena"
            autocomplete="current-password"
            [class.is-invalid]="invalido('contrasena')"
          />
          @if (invalido('contrasena')) {
            <div class="invalid-feedback">Mínimo 4 caracteres.</div>
          }
        </div>

        <button class="btn btn-primary w-100">Iniciar sesión</button>
      </form>
    </div>
  </div>
</section>
```

### Glosario profundo

| Elemento | Detalle |
|---|---|
| `ReactiveFormsModule` + `FormGroup` + `FormControl` | **Formulario reactivo**: el estado y las reglas viven en la clase (TS) y el HTML solo las *dibuja*. Igual que en el formulario de contacto (guía 09). |
| `Validators.required` | El campo no puede estar vacío (ni con solo espacios). |
| `Validators.minLength(3)` / `minLength(4)` | Longitud mínima: `admin` y `user` (4) y `1234` (4) las cumplen; un "ab" o "12" no pasan. |
| `formControlName="usuario"` | Conecta el `<input>` con el control del mismo nombre en el `FormGroup`. |
| `[formGroup]="formulario"` | Ata el formulario HTML con el objeto de controles de la clase. |
| `invalido('usuario')` | Devuelve `true` solo si el control fue tocado (`touched`) y rompe una regla (`invalid`): **el mismo método que el contacto**, reutilizable campo a campo. |
| `@if (invalido('usuario'))` con `invalid-feedback` | Pinta el mensaje rojo *solo* cuando el campo está mal y se tocó. |
| `(ngSubmit)="iniciar()"` | Se dispara al pulsar Enter o el botón de tipo submit. No va `click` en el botón. |
| `formulario.invalid` + `markAllAsTouched()` | Si hay algún campo roto, **no llamamos al servicio**: marcamos todos como tocados para que se vean los rojos y volvemos. |
| `const { usuario, contrasena } = this.formulario.value` | Desestructuración: extrae los dos valores del `FormGroup`. El `?? ''` protege el tipo (evita `null`). |
| `inject(AuthService)` / `inject(Router)` | Inyección de dependencias estilo función. `Router` permite programar la navegación. |
| `router.navigate(['/admin'])` | **La redirección clave**: al entrar bien, movemos al panel. |
| `error = false` + `@if (error)` | Si las credenciales fallan, se muestra el mensaje; con `@if` el aviso nace y muere según el estado. |
| Clases Bootstrap | `card` + `mx-auto` centran la tarjeta; `min-vh-100` + `d-flex align-items-center` la centran verticalmente; `is-invalid` + `invalid-feedback` son el rojo y el mensaje. |

> **Diferencia con el contacto (guía 09):** el contacto valida *solo en el cliente* y luego hace `fetch`. Aquí la validación tiene **dos capas**: primero el `FormGroup` (teclado → no deja campos muy cortos), y después el servicio **comprueba de verdad** si `usuario`/`contrasena` existen. Por eso un texto con más de 3 caracteres pero incorrecto pasa el `FormGroup` y falla en el servicio (mensaje de alerta).

---

## Código 4 — El panel admin (protegido)

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

  protected salir(): void {
    this.auth.cerrarSesion();
    this.router.navigate(['/']);
  }
}
```

### `src/app/pages/admin/admin.html`

```html
<section class="min-vh-100 d-flex align-items-center">
  <div class="card mx-auto" style="max-width: 480px">
    <div class="card-body p-4">
      <h1 class="fw-bold mb-1">Panel de administración</h1>
      <p class="text-muted mb-4">Bienvenido, admin.</p>
      <button class="btn btn-outline-danger w-100" (click)="salir()">
        Cerrar sesión
      </button>
    </div>
  </div>
</section>
```

### Glosario profundo

| Elemento | Detalle |
|---|---|
| `salir()` | Ejemplo de **cómo cerrar sesión**: borra el estado en el servicio y redirige a `/`. Inmediatamente el guard volverá a bloquear `/admin`. |
| `(click)="salir()"` | Este sí es un `click` normal porque no es un envío de formulario. |

---

## Código 5 — Rutas y punto de entrada

### `src/app/app.routes.ts`

```ts
import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Nosotros } from './pages/nosotros/nosotros';
import { Login } from './pages/login/login';
import { Admin } from './pages/admin/admin';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' },
  { path: 'nosotros', component: Nosotros },
  { path: 'login', component: Login },
  { path: 'admin', component: Admin, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
```

### `src/app/sections/navbar/navbar.html` (botón añadido)

```html
<li class="nav-item">
  <a class="btn btn-outline-primary px-4" routerLink="/login">Iniciar sesión</a>
</li>
```

### Glosario profundo

| Elemento | Detalle |
|---|---|
| `{ path: 'admin', component: Admin, canActivate: [authGuard] }` | Aquí vive la protección. `canActivate` recibe **un array de funciones guard**; si alguna devuelve false/UrlTree, la ruta no se abre. |
| `{ path: 'login', component: Login }` | El login **no tiene guard** a propósito: cualquiera debe poder abrirlo. |
| `{ path: '**', redirectTo: '' }` | Comodín: cualquier ruta que no exista cae a la home. Bueno para explicar el orden (siempre al final). |
| `routerLink="/login"` | Navegación declarativa (como `<a href>` pero sin recargar la página). |

---

## Conectar (orden de creación explicado)

1. **Servicio primero** — nada funciona sin `AuthService` (el guard y el login lo inyectan).
2. **Guard** — ya puede preguntar `estaAutenticado()`.
3. **Páginas** — `Login` y `Admin` usan el servicio y el `Router`.
4. **Rutas** — se registran `login`, `admin` (con guard y comodín).
5. **Navbar** — el botón que abre el login.

## Validar en el navegador

1. `ng serve` y visita `http://localhost:4200/admin` → te **rebota a `/login`** (el guard funciona).
2. Prueba con usuario `x` / `x` → mensaje "Usuario o contraseña incorrectos".
3. Entra con `admin` / `1234` → **redirige a `/admin`**.
4. Recarga la página en `/admin` → **sigues dentro** (el `localStorage` sobrevive al refresco).
5. Pulsa "Cerrar sesión" → vuelves a `/`; si intentas `/admin` otra vez, el guard te expulsa al login.
6. En Consola (F12) de DevTools, en *Application → Local Storage* puedes ver la clave `producto-x-usuario` mientras estés logueado.

## Cómo explicarlo en clase (secuencia sugerida)

1. **El problema**: "¿cómo protejo una pantalla a la que solo entra quien tiene permiso y cómo recuerdo quién soy entre páginas?".
2. **Tres actores**: servicio (recuerda), guard (protege), router (mueve).
3. **Guard primero**: `canActivate:[authGuard]` es como un portero en la puerta de `/admin`.
4. **Service**: `localStorage` es la "cartera con el pase" que el portero revisa.
5. **Login**: `navigate(['/admin'])` es el botón de "adelante".
6. **Recarga**: explicar por qué sigue logueado → `localStorage`.

## Errores típicos (a buscar en clase)

| Error | Causa y solución |
|---|---|
| Al pulsar iniciar no pasa nada | El botón no está dentro del `<form>` con `(ngSubmit)`, o falta `formControlName` / el `formGroup` no está atado en el `<form>`. |
| Sigo entrando a `/admin` después de salir | No se borró el `localStorage` (revisa `cerrarSesion`) o el guard no está en la ruta. |
| `CanActivateFn` no encontrado | Importa de `@angular/router` (es una **función**, no una clase). |
| Guard redirige a login y se queda en loop | Si el login también tiene `canActivate` o la ruta de redirección está protegida. El login va **sin guard**. |
| Se pierde la sesión al refrescar | Es lo contrario a un error: es `localStorage` funcionando; `sessionStorage` la perdería al cerrar la pestaña. |

## Siguiente paso

- **Hecho aquí:** el login ya valida con `FormGroup` antes de llamar al servicio (usuario obligatorio + mínimo 3; contraseña obligatoria + mínimo 4) y reutiliza el método `invalido()` de la guía 09.
- **Extensión sugerida:** crear un segundo rol (`user`) y comparar en el servicio si el rol puede entrar a `/admin`, y que el panel muestre contenido distinto según el rol → **guía 11**.