import { Injectable } from '@angular/core';
import { AuthService, User } from '../auth/auth.service';

export interface Report {
  id: number;
  title: string;
  content: string;
  author: string;
  authorId: string;
  department: string;
  type: 'weekly' | 'monthly';
  status: 'pending' | 'reviewed' | 'approved';
  createdAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
}

export interface ProductRequest {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  author: string;
  authorId: string;
  department: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private reports: Report[] = [
    {
      id: 1,
      title: 'Relatório Semanal - Vendas',
      content: 'Relatório semanal do setor de vendas com resultados positivos...',
      author: 'Pedro Oliveira',
      authorId: '4',
      department: 'Vendas',
      type: 'weekly',
      status: 'reviewed',
      createdAt: new Date('2024-10-20'),
      reviewedBy: 'João Silva',
      reviewedAt: new Date('2024-10-21')
    },
    {
      id: 2,
      title: 'Relatório Mensal - Marketing - Outubro',
      content: 'Relatório mensal completo das campanhas de marketing...',
      author: 'Maria Santos',
      authorId: '3',
      department: 'Marketing',
      type: 'monthly',
      status: 'approved',
      createdAt: new Date('2024-10-25'),
      reviewedBy: 'Admin Geral',
      reviewedAt: new Date('2024-10-26')
    },
    {
      id: 3,
      title: 'Relatório Semanal - TI',
      content: 'Atividades da semana no departamento de TI...',
      author: 'Admin Geral',
      authorId: '1',
      department: 'TI',
      type: 'weekly',
      status: 'pending',
      createdAt: new Date('2024-10-28')
    }
  ];

  private productRequests: ProductRequest[] = [
    {
      id: 1,
      title: 'Novo Notebook',
      description: 'Solicitação de notebook para novo funcionário',
      status: 'approved',
      createdAt: new Date('2024-10-15'),
      author: 'Maria Santos',
      authorId: '3',
      department: 'Marketing'
    },
    {
      id: 2,
      title: 'Software de Edição',
      description: 'Necessário software Adobe Creative Cloud para equipe',
      status: 'pending',
      createdAt: new Date('2024-10-27'),
      author: 'João Silva',
      authorId: '2',
      department: 'Vendas'
    }
  ];

  constructor(private authService: AuthService) {}

  getReports(): Report[] {
    const user = this.authService.getCurrentUser();
    if (!user) return [];

    if (user.role === 'user') {
      return this.reports.filter(report => 
        report.authorId === user.id || 
        (report.type === 'monthly' && report.department === user.department)
      );
    }

    return this.reports;
  }

  createReport(reportData: Omit<Report, 'id' | 'createdAt' | 'status' | 'author' | 'authorId'>): boolean {
    const user = this.authService.getCurrentUser();
    if (!user) return false;

    if (reportData.type === 'monthly' && user.role !== 'admin') {
      alert('Apenas administradores podem criar relatórios mensais.');
      return false;
    }

    if (reportData.type === 'monthly' && reportData.department !== user.department && user.department !== 'Geral') {
      alert('Você só pode criar relatórios mensais para seu próprio setor.');
      return false;
    }

    if (reportData.type === 'weekly' && user.role === 'user' && reportData.department !== user.department) {
      alert('Você só pode criar relatórios semanais para seu próprio setor.');
      return false;
    }

    const newReport: Report = {
      ...reportData,
      id: Math.max(0, ...this.reports.map(r => r.id)) + 1,
      author: user.name,
      authorId: user.id,
      status: 'pending',
      createdAt: new Date()
    };

    this.reports.push(newReport);
    return true;
  }

  updateReportStatus(reportId: number, status: 'reviewed' | 'approved', reviewedBy: string): boolean {
    const report = this.reports.find(r => r.id === reportId);
    const user = this.authService.getCurrentUser();
    
    if (report && user?.role === 'admin') {
      report.status = status;
      report.reviewedBy = reviewedBy;
      report.reviewedAt = new Date();
      return true;
    }
    return false;
  }

  deleteReport(reportId: number): boolean {
    const report = this.reports.find(r => r.id === reportId);
    const user = this.authService.getCurrentUser();
    
    if (report && user && (user.id === report.authorId || user.role === 'admin')) {
      this.reports = this.reports.filter(r => r.id !== reportId);
      return true;
    }
    return false;
  }

  getProductRequests(): ProductRequest[] {
    const user = this.authService.getCurrentUser();
    if (!user) return [];

    if (user.role === 'user') {
      return this.productRequests.filter(request => request.authorId === user.id);
    }

    return this.productRequests.filter(request => 
      request.department === user.department || user.department === 'Geral'
    );
  }

  createProductRequest(title: string, description: string): boolean {
    const user = this.authService.getCurrentUser();
    if (!user) return false;

    const newRequest: ProductRequest = {
      id: Math.max(0, ...this.productRequests.map(pr => pr.id)) + 1,
      title,
      description,
      status: 'pending',
      createdAt: new Date(),
      author: user.name,
      authorId: user.id,
      department: user.department
    };

    this.productRequests.push(newRequest);
    return true;
  }

  updateProductRequestStatus(requestId: number, status: 'approved' | 'rejected'): boolean {
    const request = this.productRequests.find(r => r.id === requestId);
    const user = this.authService.getCurrentUser();
    
    if (request && user?.role === 'admin') {
      request.status = status;
      return true;
    }
    return false;
  }

  deleteProductRequest(requestId: number): boolean {
    const request = this.productRequests.find(r => r.id === requestId);
    const user = this.authService.getCurrentUser();
    
    if (request && user && (user.id === request.authorId || user.role === 'admin')) {
      this.productRequests = this.productRequests.filter(r => r.id !== requestId);
      return true;
    }
    return false;
  }

  getReportStats() {
    const reports = this.getReports();
    return {
      total: reports.length,
      pending: reports.filter(r => r.status === 'pending').length,
      reviewed: reports.filter(r => r.status === 'reviewed').length,
      approved: reports.filter(r => r.status === 'approved').length
    };
  }

  getDepartments(): string[] {
    return [...new Set(this.reports.map(report => report.department))];
  }
}