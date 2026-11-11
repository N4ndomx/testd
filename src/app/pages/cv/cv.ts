import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-cv',
  styleUrl: './cv.css',
  templateUrl: './cv.html',
})
export class Cv {
  protected nombre = 'Ana García';
  protected profesion = 'Desarrolladora Web';
  protected email = 'ana@correo.com';
  protected telefono = '555 123 456';
  protected disponible = true;

  protected habilidades = ['Angular', 'TypeScript', 'HTML', 'CSS'];

  protected experiencia = [
    { puesto: 'Desarrolladora Frontend', empresa: 'Tech S.A.', anios: '2022 - 2024' },
    { puesto: 'Practicante Web', empresa: 'Startup X', anios: '2021 - 2022' },
  ];

  protected educacion = [
    { titulo: 'Ing. en Sistemas', escuela: 'UTCV', anios: '2018 - 2022' },
  ];
}