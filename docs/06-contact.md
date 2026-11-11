# 06 · Formulario de contacto

> Objetivo: formulario con Reactive Forms y validación visual de Bootstrap. Es el componente con **más lógica Angular** de toda la landing.

## Qué practicas

- **Reactive Forms**: `FormGroup`, `FormControl`, `Validators`, `ReactiveFormsModule`.
- Vínculo del formulario al DOM: `[formGroup]` y `formControlName`.
- Envío con `(ngSubmit)`.
- Validación visual Bootstrap: `[class.is-invalid]` + `.invalid-feedback`.
- Estado del formulario con `invalid`, `touched`.
- PowerPoint Moment: un `@if (enviado)` que muestra una alerta de éxito.

## Comando

```bash
ng generate component sections/contact --skip-tests
```

## Código

### `src/app/sections/contact/contact.ts`

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-contact',
  styleUrl: './contact.css',
  templateUrl: './contact.html',
})
export class Contact {
  protected readonly formulario = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    mensaje: new FormControl('', [Validators.required, Validators.minLength(10)]),
  });

  protected enviado = false;

  protected envio(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    console.log('Mensaje enviado:', this.formulario.value);
    this.enviado = true;
    this.formulario.reset();
  }
}
```

### `src/app/sections/contact/contact.html`

```html
<section id="contact" class="bg-light py-5">
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-lg-7">
        <div class="text-center mb-4">
          <h2 class="fw-bold">¿Hablamos?</h2>
          <p class="text-muted mb-0">
            Cuéntanos qué necesitas y te responderemos en menos de 24 horas.
          </p>
        </div>

        @if (enviado) {
          <div class="alert alert-success" role="alert">
            ¡Gracias! Tu mensaje fue enviado correctamente.
          </div>
        }

        <div class="card shadow-sm">
          <div class="card-body p-4 p-md-5">
            <form [formGroup]="formulario" (ngSubmit)="envio()" novalidate>
              <div class="mb-3">
                <label class="form-label" for="nombre">Nombre</label>
                <input
                  id="nombre"
                  type="text"
                  class="form-control"
                  formControlName="nombre"
                  placeholder="Tu nombre"
                  [class.is-invalid]="formulario.controls.nombre.invalid && formulario.controls.nombre.touched"
                />
                @if (formulario.controls.nombre.invalid && formulario.controls.nombre.touched) {
                  <div class="invalid-feedback">Escribe tu nombre.</div>
                }
              </div>

              <div class="mb-3">
                <label class="form-label" for="email">Correo electrónico</label>
                <input
                  id="email"
                  type="email"
                  class="form-control"
                  formControlName="email"
                  placeholder="tu@correo.com"
                  [class.is-invalid]="formulario.controls.email.invalid && formulario.controls.email.touched"
                />
                @if (formulario.controls.email.invalid && formulario.controls.email.touched) {
                  <div class="invalid-feedback">
                    Escribe un correo válido.
                  </div>
                }
              </div>

              <div class="mb-4">
                <label class="form-label" for="mensaje">Mensaje</label>
                <textarea
                  id="mensaje"
                  class="form-control"
                  rows="4"
                  formControlName="mensaje"
                  placeholder="Cuéntanos en qué podemos ayudarte"
                  [class.is-invalid]="formulario.controls.mensaje.invalid && formulario.controls.mensaje.touched"
                ></textarea>
                @if (formulario.controls.mensaje.invalid && formulario.controls.mensaje.touched) {
                  <div class="invalid-feedback">Escribe al menos 10 caracteres.</div>
                }
              </div>

              <button type="submit" class="btn btn-primary w-100 py-2">
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

## Glosario profundo

### A. Los elementos HTML de formulario

| Elemento | Qué es | Detalle |
|---|---|---|
| `<form>` | El contenedor del formulario | Atributos clave: `[formGroup]`, `(ngSubmit)`, `novalidate` (abajo). Sin `action`/`method`: el envío lo gestiona Angular, no el navegador (SPA). |
| `<label>` | Etiqueta del campo | El atributo `for="nombre"` la enlaza con el `id="nombre"` del input: hacer clic en la etiqueta enfoca el campo. Fundamental para accesibilidad. La clase Bootstrap `form-label`. |
| `<input>` | Campo de entrada de una línea | `type="text"` / `type="email"`. Atributos: `id` (para el label), `class="form-control"`, `formControlName` (Angular), `placeholder` (texto de ejemplo dentro del campo). |
| `<textarea>` | Campo de varias líneas | Para el mensaje. `rows="4"` indica la altura inicial (4 líneas). Mismo patrón de clases que el input. |
| `<button type="submit">` | Botón de envío | Por su `type="submit"`, dispara el evento `ngSubmit` del form. Si dejaras `type` sin valor, el default es `submit`, pero conviene ser explícito. |
| `<div class="invalid-feedback">` | Mensaje de error de Bootstrap | Aparece debajo del campo cuando el input con `.is-invalid` está dentro de un elemento con posición relativa. Bootstrap lo muestra con CSS (`display: block` cuando el padre/input es inválido). |
| `<div class="alert alert-success">` | Alerta verde de éxito | Se renderiza solo cuando `enviado` es `true`. `role="alert"` la anuncia como contenido importante. |

### B. Reactivos de Angular (cómo funciona realmente)

#### Los tres estados de un `FormControl`

Cada campo es un objeto con estado continuo. Así se "leen":

| Propiedad | Qué significa | Tipo |
|---|---|---|
| `.invalid` | ¿Falló algún validador? | `true` si inválido |
| `.touched` | ¿El usuario YA ENTRÓ (foco) y SALIÓ del campo? | `true` cuando lo abandona |
| `.untouched` | Lo contrario de touched | — |
| `.dirty` / `.pristine` | ¿El usuario modificó el valor? | — |
| `.value` | El valor actual | string |

> La combinación `invalid && touched` es la estándar: **no marques error un campo vacío por defecto** (el usuario no lo ha tocado); solo avísale cuando «lo tocó y quedó mal» o «lo dejó vacío».

#### Los validadores

| Validador | Regla que aplica |
|---|---|
| `Validators.required` | El valor no puede estar vacío. |
| `Validators.email` | Debe coincidir con el formato de un correo (regex predefinido). |
| `Validators.minLength(10)` | Longitud mínima de 10 caracteres (para el mensaje). |

Se escriben como arreglo: `[Validators.required, Validators.email]`. Cada uno agrega un *error* con su nombre al control (`{required: true}`, `{email: true}`…), que es lo que lee `.invalid`.

#### Las directivas del `ReactiveFormsModule`

Sin `ReactiveFormsModule` en `imports`, las directivas `formGroup` / `formControlName` **no existen** y la plantilla falla. Ese import es la llave que enciende todo el sistema reactivo de formularios en el componente.

### C. Los enlaces del template

```
<form [formGroup]="formulario" (ngSubmit)="envio()" novalidate>
```

| Sintaxis | Qué hace |
|---|---|
| `[formGroup]="formulario"` | Propiedad vinculada: enlaza el `FormGroup` del `.ts` con este `<form>`. |
| `(ngSubmit)="envio()"` | **Evento** (los paréntesis = evento): cuando el formulario se envía (clic en submit o Enter en un campo), ejecuta `envio()`. |
| `novalidate` | Desactiva la validación nativa del navegador (globos rojos/amarillos default). Queremos que valide Angular con nuestra UI. |
| `formControlName="nombre"` | Conecta el input con el `FormControl` **por nombre** (la clave del objeto en `formulario`). Sin esto, el input no "participa" del formulario. |
| `[class.is-invalid]="formulario.controls.nombre.invalid && formulario.controls.nombre.touched"` | Clase condicional (vista en guía 05). `formulario.controls.nombre` = el FormControl de ese campo. |

#### El método `envio()`

```
if (this.formulario.invalid) {
  this.formulario.markAllAsTouched();
  return;
}
```

- Si hay errores: `markAllAsTouched()` marca TODOS los campos como `touched` → now las clases `.is-invalid` y los mensajes aparecen a la vez en todos los campos inválidos (porque el usuario "intentó enviar").
- Si es válido: `console.log`, `enviado = true` (dispara la alerta) y `reset()` limpia.

### D. Clases de Bootstrap nuevas en esta guía

| Clase | Efecto | Detalle |
|---|---|---|
| `form-label` | Estilo de etiqueta de formulario | Con `margin-bottom` correcto. |
| `form-control` | El campo: ancho completo, borde, focus azul, `border-radius` | Aplicable igual a `<input>` y `<textarea>`. |
| `is-invalid` | Pone borde y sombra **rojos** al campo + hace visible su `.invalid-feedback` | Bootstrap solo la aplica si la AHORA está; nuestra clase dinámica hace exactamente eso. |
| `invalid-feedback` | Mensaje de error oculto que se muestra con color rojo junto al campo `.is-invalid` | Hermano del `valid-feedback`. |
| `alert` + `alert-success` | Caja de aviso (verde) | Variantes: `alert-info`, `alert-warning`, `alert-danger`, `alert-secondary`, etc. |
| `w-100` | `width: 100%` | Botón a lo ancho del form. |
| `py-2` | `padding-top/bottom: 0.5rem` | Botón más alto y "clicable". |
| `col-lg-7`, `justify-content-center`, `p-md-5` | Grid y espaciado ya vistos | `p-md-5` = padding 3rem solo desde `md`. |

### Los `placeholder`

Los `placeholder="Tu nombre"` etc. son textos que **desaparecen al escribir**. Nunca sustituyen al `<label>` (el placeholder no cumple con accesibilidad al llenarse).

## Conectar el componente

- En `app.ts`: importar `Contact` y agregarlo a `imports`.
- En `app.html`: `<app-contact />` después de `<app-faq />`.

## Validar

- [ ] Se ven los 3 campos con sus etiquetas y placeholders.
- [ ] Enviar el formulario **vacío**: los campos se marcan en rojo con sus mensajes.
- [ ] Escribir un correo inválido: el campo email muestra "Escribe un correo válido".
- [ ] Escribir menos de 10 caracteres en el mensaje: muestra su error.
- [ ] Llenar todo válido y enviar: aparece la alerta verde "¡Gracias!" y el formulario se limpia.
- [ ] Revisa la consola del navegador (F12): se imprime el objeto con los datos enviados.

## Siguiente paso

Guía 07 — Footer: `docs/07-footer.md`