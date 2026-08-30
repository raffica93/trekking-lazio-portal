import { Routes } from '@angular/router';
import { adminGuard } from './admin.route.guard';
import { AdminLoginComponent } from './admin-login.component';
import { AdminPlaceEditorComponent } from './admin-place-editor.component';
import { AdminPlaceListComponent } from './admin-place-list.component';
import { AdminSediComponent } from './admin-sedi.component';
import { AdminShellComponent } from './admin-shell.component';
import { InfoPageComponent } from './info-page.component';
import { LegalPageComponent } from './legal-page.component';

export const routes: Routes = [
  { path: 'info', component: InfoPageComponent },
  { path: 'servizi', component: LegalPageComponent },
  { path: 'termini', component: LegalPageComponent },
  { path: 'privacy', component: LegalPageComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  {
    path: 'admin',
    component: AdminShellComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', component: AdminPlaceListComponent },
      { path: 'sedi', component: AdminSediComponent },
      { path: 'places/new', component: AdminPlaceEditorComponent },
      { path: 'places/:id', component: AdminPlaceEditorComponent }
    ]
  }
];
