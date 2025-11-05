import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Report {
  id: number;
  title: string;
  type: string;
  status: string;
  content: string;
  createdAt: Date;
  department: string;
  author: string;
  reviewedBy?: string;
  reviewedAt?: Date;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  currentSection: 'create' | 'my-reports' | 'all-reports' | 'pending' = 'create';
  isAdmin = true;
  
  newReport = {
    title: '',
    type: 'weekly',
    department: 'TI',
    content: ''
  };

  myReports: Report[] = [
    {
      id: 1,
      title: 'Relatório Semanal - Vendas',
      type: 'weekly',
      status: 'approved',
      content: 'Relatório das vendas da semana mostrando crescimento de 15% em comparação com a semana anterior.',
      createdAt: new Date('2024-01-15'),
      department: 'Vendas',
      author: 'João Silva',
      reviewedBy: 'Administrador',
      reviewedAt: new Date('2024-01-16')
    },
    {
      id: 2,
      title: 'Relatório Mensal - TI',
      type: 'monthly',
      status: 'pending',
      content: 'Relatório de atividades do departamento de TI para o mês de Janeiro.',
      createdAt: new Date('2024-01-20'),
      department: 'TI',
      author: 'João Silva'
    }
  ];

  allReports: Report[] = [
    {
      id: 3,
      title: 'Relatório Semanal - Marketing',
      type: 'weekly',
      status: 'approved',
      content: 'Campanha de marketing digital atingiu 85% do público-alvo.',
      createdAt: new Date('2024-01-14'),
      department: 'Marketing',
      author: 'Ana Costa',
      reviewedBy: 'Administrador',
      reviewedAt: new Date('2024-01-15')
    }
  ];

  pendingReports: Report[] = [
    {
      id: 4,
      title: 'Relatório Semanal - RH',
      type: 'weekly',
      status: 'pending',
      content: 'Processos seletivos em andamento e treinamentos realizados.',
      createdAt: new Date('2024-01-19'),
      department: 'RH',
      author: 'Carlos Oliveira'
    }
  ];

  departments = ['TI', 'Vendas', 'Marketing', 'RH', 'Financeiro'];

  createReport() {
    if (this.newReport.title && this.newReport.content) {
      const report: Report = {
        id: Date.now(),
        title: this.newReport.title,
        type: this.newReport.type,
        status: 'pending',
        content: this.newReport.content,
        createdAt: new Date(),
        department: this.newReport.department,
        author: 'João Silva'
      };
      
      this.myReports.unshift(report);
      
      // Reset form
      this.newReport = {
        title: '',
        type: 'weekly',
        department: 'TI',
        content: ''
      };
      
      alert('Relatório criado com sucesso!');
    }
  }

  deleteReport(id: number) {
    this.myReports = this.myReports.filter(report => report.id !== id);
  }

  approveReport(id: number) {
    const report = this.pendingReports.find(r => r.id === id);
    if (report) {
      report.status = 'approved';
      report.reviewedBy = 'João Silva';
      report.reviewedAt = new Date();
      this.pendingReports = this.pendingReports.filter(r => r.id !== id);
    }
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pendente',
      'approved': 'Aprovado',
      'rejected': 'Rejeitado'
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }
}