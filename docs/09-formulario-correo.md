# 09 · Validaciones mínimas del formulario de contacto (+ envío real)

> Objetivo: que el formulario solo "deje pasar" datos mínimamente válidos y **realmente envíe el correo** (no solo un `console.log`). Aquí aprendes validadores personalizados, mensajes por error, y un servicio de correo con `fetch`.

## La verdad sobre "enviar el correo"

Esto es importante entenderlo **antes** de escribir código:

- **Las validaciones de Angular son del lado del cliente** (navegador). Nada detiene a alguien que abra DevTools y mande lo que quiera. Son para **mejorar la experiencia**: avisar al usuario y evitar envíos basura accidentales.
- **Un Angular SPA montado en el navegador NO puede mandar un correo SMTP por sí solo** (no tiene credenciales ni servidor; exponerlas sería inseguro). Siempre necesitas una de estas vías:

| Vía | Qué es | Cuándo usarla |
|---|---|---|
| Tu propio backend (API) | Endpoint tuyo (Node, PHP, Java…) que recibe el JSON y envía con Nodemailer/PHPMailer/JavaMail | Proyectos con backend propio |
| Formspree | Servicio gratuito: creas un *form* (te dan un `id`) y le haces `POST` con `fetch`; él te reenvía el correo | SPA estático sin backend (nuestro caso) |
| EmailJS | Ídem, con SDK propio de JS | Cuando no quieres `fetch` crudo |
| Resend / SendGrid / Amazon SES | APIs de correo transaccional | Producción |

En esta guía implementamos con **Formspree** (gratis, sin backend, un solo `fetch`). El endpoint queda como constante en un servicio, listo para reemplazar por tu API cuando exista.

## Qué son las "validaciones mínimas" y cuáles son

Conjunto de comprobaciones "de sentido común" que el formulario debe resolver **antes de disparar el envío**:

1. **Nombre**: obligatorio, entre 2 y 60 caracteres, y no solo espacios.
2. **Correo**: obligatorio, con formato válido (`email`), máx. 120 caracteres, y no solo espacios.
3. **Mensaje**: obligatorio, entre 10 y 500 caracteres, y no solo espacios.
4. **Limpieza**: al enviar se hace `trim()` (quitar espacios sobrantes de los extremos).
5. **Feedback**: el usuario ve el error **específico** de cada regla rota (`required`, `email`, `minlength`, …), no un mensaje genérico.
6. **Estado de envío**: botón deshabilitado mientras la petición viaja ("Enviando…") y alerta de éxito o error al terminar.

## Archivos

- **Nuevo:** `src/app/services/correo.service.ts` (el "cerebro" del envío).
- **Modificas:** `src/app/sections/contact/contact.ts` y `contact.html`.

---

## Código 1 — El servicio de correo

### `src/app/services/correo.service.ts`

```ts
import { Injectable } from '@angular/core';

export interface MensajeContacto {
  nombre: string;
  email: string;
  mensaje: string;
}

@Injectable({ providedIn: 'root' })
export class CorreoService {
  private readonly endpoint = 'https://formspree.io/f/TU_FORM_ID';

  async enviar(datos: MensajeContacto): Promise<void> {
    if (this.endpoint.includes('TU_FORM_ID')) {
      throw new Error(
        'El servicio de correo no está configurado: reemplaza TU_FORM_ID.'
      );
    }

    const respuesta = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(datos),
    });

    if (!respuesta.ok) {
      throw new Error(
        `El servidor respondió ${respuesta.status}. Inténtalo de nuevo.`
      );
    }
  }
}
```

### Explicación profunda

| Pieza | Qué es y cómo funciona |
|---|---|
| `interface MensajeContacto` | El **contrato de datos** del envío: `{ nombre, email, mensaje }` todos string. TypeScript valida en compilación que no lo "enviemos a medias". |
| `@Injectable({ providedIn: 'root' })` | El servicio se puede **inyectar** en cualquier componente sin configurar providers. Angular crea **una única instancia** (singleton) y la comparte. |
| `private readonly endpoint` | La URL Formspree. `TU_FORM_ID` es un hueco a reemplazar. La guardia con `includes('TU_FORM_ID')` evita enviar contra una URL falsa en silencio. |
| `async enviar(...): Promise<void>` | Método **asíncrono**: devuelve una `Promise`. `await` "espera" la petición sin bloquear la UI. |
| `fetch(url, { method, headers, body })` | **API nativa del navegador** para HTTP. Alternativa sin dependencias a `HttpClient` de Angular. |
| `method: 'POST'` | Verbo HTTP que Formspree espera para crear el mensaje. |
| `headers` | `Content-Type: application/json` (porque `body` es JSON) y `Accept: application/json` (responde con JSON). |
| `JSON.stringify(datos)` | Convierte el objeto TS en el **string JSON** que viaja por la red. |
| `respuesta.ok` / `!respuesta.ok` | `ok` es `true` para 2xx. Si falló (4xx/5xx) lanzamos un `Error` con el código → el componente lo mostrará. |

### Cómo configurar tu Formspree (2 minutos)

1. Entra a formspree.io → crea cuenta gratis → "New Form".
2. Copia el `id` que te dan (algo como `mblvqnjz`) o el `email` de destino.
3. Pega la URL real en `endpoint`: `https://formspree.io/f/mblvqnjz`.
4. Formspree te envía un correo por cada envío con el JSON del formulario.

---

## Código 2 — El componente con validaciones

### `src/app/sections/contact/contact.ts`

```ts
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CorreoService, MensajeContacto } from '../../services/correo.service';

function sinSoloEspacios(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (typeof valor === 'string' && valor.trim().length === 0) {
    return { sinSoloEspacios: true };
  }
  return null;
}

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-contact',
  styleUrl: './contact.css',
  templateUrl: './contact.html',
})
export class Contact {
  protected readonly formulario = new FormGroup({
    nombre: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(60),
      sinSoloEspacios,
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.maxLength(120),
      sinSoloEspacios,
    ]),
    mensaje: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(500),
      sinSoloEspacios,
    ]),
  });

  protected enviado = false;
  protected enviando = false;
  protected errorEnvio = '';

  constructor(private readonly correo: CorreoService) {}

  protected campoInvalido(nombreCampo: string): boolean {
    const campo = this.formulario.get(nombreCampo);
    return !!campo && campo.touched && campo.invalid;
  }

  protected errorDe(nombreCampo: string): string {
    const campo = this.formulario.get(nombreCampo);
    if (!campo || !campo.touched || campo.valid) return '';
    if (campo.hasError('required')) return 'Este campo es obligatorio.';
    if (campo.hasError('sinSoloEspacios')) return 'No puede contener solo espacios.';
    if (campo.hasError('email')) return 'Escribe un correo electrónico válido.';
    if (campo.hasError('minlength')) {
      return `Mínimo ${campo.getError('minlength').requiredLength} caracteres.`;
    }
    if (campo.hasError('maxlength')) {
      return `Máximo ${campo.getError('maxlength').requiredLength} caracteres.`;
    }
    return 'Revisa este campo.';
  }

  protected async enviar(): Promise<void> {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valor = this.formulario.value;
    const mensaje: MensajeContacto = {
      nombre: valor.nombre?.trim() ?? '',
      email: valor.email?.trim() ?? '',
      mensaje: valor.mensaje?.trim() ?? '',
    };

    this.enviando = true;
    this.errorEnvio = '';
    try {
      await this.correo.enviar(mensaje);
      this.enviado = true;
      this.formulario.reset();
    } catch (error) {
      this.errorEnvio =
        error instanceof Error
          ? error.message
          : 'No se pudo enviar el mensaje. Inténtalo de nuevo.';
    } finally {
      this.enviando = false;
    }
  }
}
```

### Glosario profundo — las novedades

#### 1. El validador personalizado `sinSoloEspacios`

```ts
function sinSoloEspacios(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (typeof valor === 'string' && valor.trim().length === 0) {
    return { sinSoloEspacios: true };
  }
  return null;
}
```

- **Firma obligatoria de un validador**: recibe el `AbstractControl` y devuelve `ValidationErrors | null` (un objeto de error, o `null` si "todo bien").
- ¿Por qué existe? `Validators.required` **no falla con `"   "`** (espacios): para el solo revisa si es `''`/`null`/`undefined`. Este validador atrapa eso: si tras `trim()` no queda nada → error.
- El objeto `{ sinSoloEspacios: true }` es el "nombre del error"; se consulta luego con `hasError('sinSoloEspacios')`. Puedes guardar más datos en él (ej. `{ fecha: ... }`).

#### 2. `hasError` / `getError`

| Método | Qué hace | Para qué sirve |
|---|---|---|
| `campo.hasError('minlength')` | ¿Tiene ese error clave? | Saber cuál regla se rompió (`required`, `email`, `minlength`…) |
| `campo.getError('minlength')` | Devuelve el **objeto** de ese error | Sus campos: `requiredLength` (la longitud exigida) y `actualLength`. Usamos `requiredLength` para decir "Mínimo X caracteres". |

Con esto `errorDe()` devuelve un mensaje **específico** por regla en vez de uno genérico.

#### 3. Métodos que ayudan a la plantilla

- `campoInvalido(nombre)` → `touched && invalid` (igual que la expresión de la guía 06, pero centralizada). Limpia la plantilla y evita repetir `formulario.controls.nombre.touched && ...invalid`.
- `errorDe(nombre)` → mensaje según la regla fallida. Vacío si el campo está sano.

> Detalle: `campoInvalido` y `errorDe` reciben el **nombre del campo** y lo buscan con `this.formulario.get(nombre)`. Si usas TypeScript estricto, `get()` devuelve `AbstractControl | null`; por eso `!!campo &&`.

#### 4. El envío con async/await + try/catch/finally

```
try { await correo.enviar(...); ... }
catch (error) { this.errorEnvio = ...; }
finally { this.enviando = false; }
```

- `await` espera a que el `fetch` termine; mientras tanto `enviando = true` mantiene el botón deshabilitado y el texto "Enviando…".
- Si `enviar()` lanza excepción → `catch` guarda el mensaje en `errorEnvio` (que pintamos en un `alert-danger`).
- `finally` corre **siempre** → apaga `enviando` pase lo que pase.
- `error instanceof Error` : TypeScript pide acotar el tipo del error antes de usar `.message`.
- `valor.nombre?.trim() ?? ''` : `?` = "solo si no es null", `?? ''` = "si fue null, usa string vacío". Los valores de un FormGroup no tipeado como nulos, pero a nivel runtime un control vacío puede venir `null`.

### `src/app/sections/contact/contact.html` — los campos

Un campo típico queda así (patrón repetido 3 veces):

```html
<div class="mb-3">
  <label class="form-label" for="email">Correo electrónico</label>
  <input
    id="email"
    type="email"
    class="form-control"
    formControlName="email"
    placeholder="tu@correo.com"
    required
    [class.is-invalid]="campoInvalido('email')"
  />
  @if (campoInvalido('email')) {
    <div class="invalid-feedback">{{ errorDe('email') }}</div>
  }
</div>
```

Y el botón:

```html
<button type="submit" class="btn btn-primary w-100 py-2" [disabled]="enviando">
  @if (enviando) {
    Enviando…
  } @else {
    Enviar mensaje
  }
</button>
```

Además, dos alertas nuevas sobre el form:

```html
@if (enviado) {
  <div class="alert alert-success" role="alert">¡Gracias! Tu mensaje fue enviado correctamente.</div>
}
@if (errorEnvio) {
  <div class="alert alert-danger" role="alert">{{ errorEnvio }}</div>
}
```

### Glosario profundo — novedades de la plantilla

| Pieza | Detalle |
|---|---|
| `required` atributo (HTML) | Semántica + accesibilidad y "pista nativa". Con `novalidate` en el `<form>`, el navegador NO muestre su globo: valida Angular. Pero el atributo queda informando lectores de pantalla. |
| `maxlength="500"` en el `<textarea>` | Corta la escritura en 500 caracteres físicamente (además del `maxLength` de Angular). El de .ts es la "ley", el del HTML es la comodidad. |
| `[disabled]="enviando"` | Deshabilita el botón durante la petición para evitar dobles envíos. Bootstrap lo pinta gris por defecto. |
| `@if (enviando) { Enviando… } @else { Enviar mensaje }` | El texto del botón cambia con el estado (otro uso de `@if/@else`). |
| `alert-success` / `alert-danger` | Éxito (verde) y error (rojo). `errorEnvio` viene del servicio (`throw new Error`). |

### ¿Qué pasó con los imports/servicio?

- Nada que "conectar": `CorreoService` se inyecta solo por ser `providedIn: 'root'` → el constructor `constructor(private readonly correo: CorreoService){}` lo trae. No tocamos `app.config.ts`.
- La función `sinSoloEspacios` vive fuera de la clase (módulo): no necesita acceso a `this`.

---

## Resumen del flujo completo

1. Usuario escribe → Angular valida campos (aún sin tocar → sin errores rojos).
2. Clic en "Enviar mensaje" → si algo falla: `markAllAsTouched()` → se pintan rojos + mensajes específicos.
3. Si todo es válido: se formatea (`trim()`) → `enviando = true` → `fetch` a Formspree.
4. Éxito → alerta verde + reset. Fallo → alerta roja con el motivo. Botón siempre vuelve a activarse.

## Validar

- [ ] Nombre con 1 letra → "Mínimo 2 caracteres".
- [ ] Nombre "   " (espacios) → "No puede contener solo espacios".
- [ ] Correo `hola@` → "Escribe un correo electrónico válido".
- [ ] Mensaje de 3 caracteres → "Mínimo 10 caracteres".
- [ ] Formulario vacío + enviar → los 3 campos en rojo con sus mensajes.
- [ ] Todo válido + enviar (con `TU_FORM_ID` configurado) → botón "Enviando…" deshabilitado y al terminar la alerta verde.
- [ ] Con `TU_FORM_ID` sin configurar → alerta roja "no está configurado" (el servicio protege).
- [ ] Recarga que recibes: Formspree te manda el correo con el JSON.

## Extensiones (si quieres ir más allá)

1. **Deshabilitar hasta que sea válido**: `[disabled]="enviando || formulario.invalid"` → el botón se "enciende" solo cuando todo cumple (mira el trade-off UX con `updateOn` por defecto).
2. **`updateOn: 'blur'`**: validar solo al salir del campo (menos ruido mientras escribes).
3. **Validación del lado servidor**: tu backend debe repetir TODAS estas reglas (nunca confíes solo en el cliente).
4. **AsyncValidator** para "¿ese correo ya está registrado?" (consulta al servidor antes de aceptar).
5. **ReCAPTCHA / honeypot**: contra bots. Un campo oculto que los bots llenan por error (honeypot) es gratis y muy efectivo.
6. **`HttpClient`** en vez de `fetch`: agrega `provideHttpClient()` al config y usa `this.http.post(...)` con observables/tipado.

## Errores típicos

1. Olvidar `novalidate` → el navegador muestra SUS globos encima de los nuestros.
2. Solo `Validators.required` → los "   " pasan (por eso el validador personalizado).
3. No hacer `trim()` → llegaría `"hola "` o `" "` al servidor.
4. `catch` sin `finally` → el botón quedaría en "Enviando…" para siempre si falla.
5. No acotar el error: `error instanceof Error` para leer `.message` (TS estricto).
6. Configurar el endpoint mal (falta `/f/`) → Formspree devuelve 4xx → alerta roja con el status (el servicio lo reporta).