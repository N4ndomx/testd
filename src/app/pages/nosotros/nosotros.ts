import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-nosotros',
  styleUrl: './nosotros.css',
  templateUrl: './nosotros.html',
})
export class Nosotros {
  protected readonly valores = [
    {
      titulo: 'Simplicidad',
      descripcion:
        'Eliminamos lo innecesario para que lo importante brille por sí solo.',
    },
    {
      titulo: 'Confianza',
      descripcion:
        'Cuidamos tus datos y tus procesos como si fueran los nuestros.',
    },
    {
      titulo: 'Colaboración',
      descripcion:
        'Escuchamos a quienes usan el producto y aprendemos de ellos.',
    },
    {
      titulo: 'Mejora continua',
      descripcion:
        'Evolucionamos cada semana, no cada año: pequeños avances constantes.',
    },
  ];
}