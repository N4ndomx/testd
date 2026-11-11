import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Pokemon } from '../../models/pokemon.model';

@Component({
  imports: [FormsModule],
  selector: 'app-pokedex',
  styleUrl: './pokedex.css',
  templateUrl: './pokedex.html',
})
export class Pokedex implements OnInit {
  protected nombre = 'pikachu';
  protected pokemon: Pokemon | null = null;
  protected cargando = false;
  protected error = false;

  private readonly http = inject(HttpClient);

  ngOnInit(): void {
    this.buscar();
  }

  protected buscar(): void {
    this.cargando = true;
    this.error = false;
    this.pokemon = null;

    this.http
      .get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${this.nombre.toLowerCase()}`)
      .subscribe({
        next: (datos) => {
          this.pokemon = datos;
          this.cargando = false;
        },
        error: () => {
          this.error = true;
          this.cargando = false;
        },
      });
  }
}