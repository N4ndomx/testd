import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './sections/navbar/navbar';
import { Footer } from './sections/footer/footer';

@Component({
  imports: [RouterOutlet, Navbar, Footer],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}