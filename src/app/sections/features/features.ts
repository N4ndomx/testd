import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-features',
  styleUrl: './features.css',
  templateUrl: './features.html',
})
export class Features {
  protected readonly features = [
    {
      numero: '01',
      titulo: 'Rápido',
      descripcion:
        'Configura tu espacio de trabajo en minutos, sin curvas de aprendizaje.',
    },
    {
      numero: '02',
      titulo: 'Seguro',
      descripcion:
        'Tus datos cifrados y respaldados, con el control total sobre el acceso.',
    },
    {
      numero: '03',
      titulo: 'Integrable',
      descripcion:
        'Se conecta con las herramientas que ya usas todos los días.',
    },
    {
      numero: '04',
      titulo: 'Colaborativo',
      descripcion:
        'Trabaja con tu equipo en tiempo real, desde cualquier dispositivo.',
    },
    {
      numero: '05',
      titulo: 'Escalable',
      descripcion:
        'Crece contigo: de un proyecto pequeño a toda una organización.',
    },
    {
      numero: '06',
      titulo: 'Soportado',
      descripcion:
        'Atención cercana y documentación completa cuando la necesitas.',
    },
  ];
}