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