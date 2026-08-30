import { Routes } from '@angular/router';
import { adminGuard } from './admin.route.guard';
import { AdminLoginComponent } from './admin-login.component';
import { AdminPlaceEditorComponent } from './admin-place-editor.component';
import { AdminPlaceListComponent } from './admin-place-list.component';
import { AdminSediComponent } from './admin-sedi.component';
import { AdminShellComponent } from './admin-shell.component';

export const routes: Routes = [
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
