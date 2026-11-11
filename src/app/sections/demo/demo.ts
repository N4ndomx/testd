import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-demo',
  styleUrl: './demo.css',
  templateUrl: './demo.html',
})
export class Demo {
  protected nombre = 'Ana';
  protected edad = 20;
  protected esEstudiante = true;
  protected frutas = ['Manzana', 'Plátano', 'Naranja'];
}