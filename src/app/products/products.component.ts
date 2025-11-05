import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ProductRequest {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  createdAt: Date;
  department: string;
  author: string;
  estimatedCost?: number;
  approvedBy?: string;
  approvedAt?: Date;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  currentSection: 'create' | 'my-requests' | 'all-requests' | 'pending' = 'create';
  isAdmin = true;
  
  newRequest = {
    title: '',
    description: '',
    category: 'software',
    priority: 'medium',
    estimatedCost: null as number | null
  };

  categories = [
    { value: 'software', label: 'Software' },
    { value: 'hardware', label: 'Hardware' },
    { value: 'services', label: 'Serviços' },
    { value: 'materials', label: 'Materiais' },
    { value: 'other', label: 'Outros' }
  ];

  priorities = [
    { value: 'low', label: 'Baixa' },
    { value: 'medium', label: 'Média' },
    { value: 'high', label: 'Alta' },
    { value: 'urgent', label: 'Urgente' }
  ];

  myRequests: ProductRequest[] = [
    {
      id: 1,
      title: 'Licença Microsoft Office 365',
      description: 'Necessário para atualização dos softwares de produtividade da equipe de desenvolvimento.',
      category: 'software',
      priority: 'high',
      status: 'approved',
      createdAt: new Date('2024-01-10'),
      department: 'TI',
      author: 'João Silva',
      estimatedCost: 2500,
      approvedBy: 'Administrador',
      approvedAt: new Date('2024-01-12')
    },
    {
      id: 2,
      title: 'Novos Monitores 24"',
      description: 'Solicitação de 5 monitores para a equipe de desenvolvimento para melhorar a produtividade.',
      category: 'hardware',
      priority: 'medium',
      status: 'pending',
      createdAt: new Date('2024-01-15'),
      department: 'TI',
      author: 'João Silva',
      estimatedCost: 4000
    }
  ];

  allRequests: ProductRequest[] = [
    {
      id: 3,
      title: 'Software de Gestão de Projetos',
      description: 'Aquisição de licença para software de gestão de projetos para equipe de marketing.',
      category: 'software',
      priority: 'medium',
      status: 'approved',
      createdAt: new Date('2024-01-08'),
      department: 'Marketing',
      author: 'Ana Costa',
      estimatedCost: 1800,
      approvedBy: 'Administrador',
      approvedAt: new Date('2024-01-09')
    }
  ];

  pendingRequests: ProductRequest[] = [
    {
      id: 4,
      title: 'Impressora Multifuncional',
      description: 'Substituição da impressora atual que apresenta constantes problemas técnicos.',
      category: 'hardware',
      priority: 'high',
      status: 'pending',
      createdAt: new Date('2024-01-18'),
      department: 'RH',
      author: 'Carlos Oliveira',
      estimatedCost: 1200
    }
  ];

  createRequest() {
    if (this.newRequest.title && this.newRequest.description) {
      const request: ProductRequest = {
        id: Date.now(),
        title: this.newRequest.title,
        description: this.newRequest.description,
        category: this.newRequest.category,
        priority: this.newRequest.priority,
        status: 'pending',
        createdAt: new Date(),
        department: 'TI',
        author: 'João Silva',
        estimatedCost: this.newRequest.estimatedCost || undefined
      };
      
      this.myRequests.unshift(request);
      
      // Reset form
      this.newRequest = {
        title: '',
        description: '',
        category: 'software',
        priority: 'medium',
        estimatedCost: null
      };
      
      alert('Solicitação enviada com sucesso!');
    }
  }

  approveRequest(id: number) {
    const request = this.pendingRequests.find(r => r.id === id);
    if (request) {
      request.status = 'approved';
      request.approvedBy = 'João Silva';
      request.approvedAt = new Date();
      this.pendingRequests = this.pendingRequests.filter(r => r.id !== id);
    }
  }

  rejectRequest(id: number) {
    const request = this.pendingRequests.find(r => r.id === id);
    if (request) {
      request.status = 'rejected';
      this.pendingRequests = this.pendingRequests.filter(r => r.id !== id);
    }
  }

  deleteRequest(id: number) {
    this.myRequests = this.myRequests.filter(request => request.id !== id);
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

  getPriorityClass(priority: string): string {
    return `priority-${priority}`;
  }

  getPriorityText(priority: string): string {
    const priorityMap: { [key: string]: string } = {
      'low': 'Baixa',
      'medium': 'Média',
      'high': 'Alta',
      'urgent': 'Urgente'
    };
    return priorityMap[priority] || priority;
  }

  getCategoryText(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'software': 'Software',
      'hardware': 'Hardware',
      'services': 'Serviços',
      'materials': 'Materiais',
      'other': 'Outros'
    };
    return categoryMap[category] || category;
  }
}