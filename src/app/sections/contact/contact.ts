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

  protected invalido(campo: string): boolean {
    const control = this.formulario.get(campo);
    return !!control && control.touched && control.invalid;
  }

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