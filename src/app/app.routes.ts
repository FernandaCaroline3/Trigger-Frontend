// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { ProfileComponent } from './profile/profile.component';
import { ReportsComponent } from './reports/reports.component';
import { ProductsComponent } from './products/products.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'app', 
    component: MenuComponent,
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'settings', component: SettingsComponent },
      { path: '', redirectTo: 'profile', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/login' }
];