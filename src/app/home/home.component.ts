import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../service/auth/auth.service';
import { DataService, Report, ProductRequest } from '../data/data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: User | null = null;
  isAdmin: boolean = false;
  reports: Report[] = [];
  productRequests: ProductRequest[] = [];
  stats: any = {};

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.authService.isAdmin();
    this.loadData();
  }

  loadData() {
    this.reports = this.dataService.getReports().slice(0, 3);
    this.productRequests = this.dataService.getProductRequests().slice(0, 3);
    this.stats = this.dataService.getReportStats();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pendente',
      'reviewed': 'Revisado',
      'approved': 'Aprovado',
      'rejected': 'Rejeitado'
    };
    return statusMap[status] || status;
  }

  // ✅ CORREÇÃO: Método que aceita tanto Date quanto string
  formatDate(date: Date | string): string {
    // Se for string, converte para Date
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}