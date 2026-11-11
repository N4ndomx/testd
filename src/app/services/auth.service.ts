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