import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  isSidebarCollapsed = false;
  currentUser = {
    name: 'João Silva',
    role: 'Administrador',
    department: 'TI',
    avatar: 'JS'
  };

  menuItems = [
    { path: '/app/profile', icon: 'person', label: 'Meu Perfil', active: false },
    // { path: '/app/reports', icon: 'assessment', label: 'Relatórios', active: false }, // REMOVIDO
    { path: '/app/products', icon: 'inventory_2', label: 'Patrimonios', active: false }, // NOME ALTERADO
    { path: '/app/settings', icon: 'settings', label: 'Configurações', active: false }
  ];

  constructor(private router: Router) {}

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
    this.menuItems.forEach(item => item.active = item.path === path);
  }

  logout() {
    this.router.navigate(['/login']);
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }
}