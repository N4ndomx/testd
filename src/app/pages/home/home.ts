import { Component } from '@angular/core';
import { Hero } from '../../sections/hero/hero';
import { Features } from '../../sections/features/features';
import { Comentarios } from '../../sections/comentarios/comentarios';
import { Pricing } from '../../sections/pricing/pricing';
import { Faq } from '../../sections/faq/faq';
import { Contact } from '../../sections/contact/contact';

@Component({
  imports: [Hero, Features, Comentarios, Pricing, Faq, Contact],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {}