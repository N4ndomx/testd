import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-pricing',
  styleUrl: './pricing.css',
  templateUrl: './pricing.html',
})
export class Pricing {
  protected readonly planes = [
    {
      nombre: 'Básico',
      precio: '0',
      descripcion: 'Para empezar a explorar Producto X.',
      caracteristicas: ['1 proyecto', 'Almacenamiento de 1 GB', 'Soporte por correo'],
      destacado: false,
    },
    {
      nombre: 'Pro',
      precio: '12',
      descripcion: 'Para profesionales que necesitan más.',
      caracteristicas: ['Proyectos ilimitados', 'Almacenamiento de 100 GB', 'Soporte prioritario'],
      destacado: true,
    },
    {
      nombre: 'Empresa',
      precio: '29',
      descripcion: 'Para equipos y organizaciones.',
      caracteristicas: ['Todo lo de Pro', 'Almacenamiento ilimitado', 'Gerente de cuenta dedicado'],
      destacado: false,
    },
  ];
}