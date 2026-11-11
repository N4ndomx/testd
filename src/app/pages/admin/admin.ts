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