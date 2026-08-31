import { Routes } from '@angular/router';
import { adminGuard } from './admin.route.guard';

export const routes: Routes = [
  { path: 'info', loadComponent: () => import('./info-page.component').then((module) => module.InfoPageComponent) },
  { path: 'servizi', loadComponent: () => import('./legal-page.component').then((module) => module.LegalPageComponent) },
  { path: 'termini', loadComponent: () => import('./legal-page.component').then((module) => module.LegalPageComponent) },
  { path: 'privacy', loadComponent: () => import('./legal-page.component').then((module) => module.LegalPageComponent) },
  { path: 'admin/login', loadComponent: () => import('./admin-login.component').then((module) => module.AdminLoginComponent) },
  {
    path: 'admin',
    loadComponent: () => import('./admin-shell.component').then((module) => module.AdminShellComponent),
    canActivate: [adminGuard],
    children: [
      { path: '', loadComponent: () => import('./admin-place-list.component').then((module) => module.AdminPlaceListComponent) },
      { path: 'sedi', loadComponent: () => import('./admin-sedi.component').then((module) => module.AdminSediComponent) },
      { path: 'places/new', loadComponent: () => import('./admin-place-editor.component').then((module) => module.AdminPlaceEditorComponent) },
      { path: 'places/:id', loadComponent: () => import('./admin-place-editor.component').then((module) => module.AdminPlaceEditorComponent) }
    ]
  }
];
