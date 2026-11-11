import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-faq',
  styleUrl: './faq.css',
  templateUrl: './faq.html',
})
export class Faq {
  protected readonly preguntas = [
    {
      pregunta: '¿Cómo empiezo a usar Producto X?',
      respuesta:
        'Crea tu cuenta gratis y sigue el asistente de configuración: en menos de cinco minutos tendrás tu espacio listo.',
    },
    {
      pregunta: '¿Puedo cancelar cuando quiera?',
      respuesta:
        'Sí. No hay permanencia: cambia de plan o cancela en cualquier momento desde tu panel de configuración.',
    },
    {
      pregunta: '¿Mis datos están seguros?',
      respuesta:
        'Sí. La información se cifra en tránsito y en reposo, con respaldos automáticos y accesos auditables.',
    },
    {
      pregunta: '¿Funciona en mi dispositivo?',
      respuesta:
        'Producto X funciona desde cualquier navegador moderno, en computadora, tableta o teléfono.',
    },
  ];
}