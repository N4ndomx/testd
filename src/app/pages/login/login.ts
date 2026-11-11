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