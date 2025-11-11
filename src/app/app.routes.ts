import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MenuComponent } from './menu/menu.component';
import { ProfileComponent } from './profile/profile.component';
import { ReportsComponent } from './reports/reports.component';
import { ProductsComponent } from './products/products.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }, // ← ESTA LINHA DEVE VIR ANTES DO 'app'
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
  { path: '**', redirectTo: '/login' } // ← ESTA SEMPRE DEVE SER A ÚLTIMA
];