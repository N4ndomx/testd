import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Nosotros } from './pages/nosotros/nosotros';
import { Login } from './pages/login/login';
import { Admin } from './pages/admin/admin';
import { Cv } from './pages/cv/cv';
import { Demo } from './sections/demo/demo';
import { Pokedex } from './sections/pokedex/pokedex';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' },
  { path: 'nosotros', component: Nosotros },
  { path: 'cv', component: Cv },
  { path: 'demo', component: Demo },
  { path: 'pokedex', component: Pokedex },
  { path: 'login', component: Login },
  { path: 'admin', component: Admin, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];