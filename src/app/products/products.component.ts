import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
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
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  API_URL = 'http://localhost:3000';
  constructor(private readonly http: HttpClient) {}

  currentSection: 'create' | 'my-requests' | 'all-requests' | 'pending' =
    'create';
  isAdmin = true;

  categories = [
    { value: 'software', label: 'Software' },
    { value: 'hardware', label: 'Hardware' },
    { value: 'services', label: 'Serviços' },
    { value: 'materials', label: 'Materiais' },
    { value: 'other', label: 'Outros' },
  ];

  priorities = [
    { value: 'low', label: 'Baixa' },
    { value: 'medium', label: 'Média' },
    { value: 'high', label: 'Alta' },
    { value: 'urgent', label: 'Urgente' },
  ];

  newRequest = {
    title: '',
    description: '',
    category: this.categories[0].value,
    priority: this.priorities[0].value,
    estimatedCost: null as number | null,
  };

  myRequests: ProductRequest[] = [];

  allRequests: ProductRequest[] = [];

  pendingRequests: ProductRequest[] = [];

  createRequest() {
    this.http.post(`${this.API_URL}/solicitacao`, this.newRequest).subscribe({
      next: (res) => {
        console.log('deu boa');
        alert('Solicitacao criada com sucesso');
      },
      error: (error) => {
        console.log('deu ruim');
        alert(`Erro ao criar solicitacao ${error}`);
      },
    });
  }

  approveRequest(id: number) {
    const request = this.pendingRequests.find((r) => r.id === id);
    if (request) {
      request.status = 'approved';
      request.approvedBy = 'João Silva';
      request.approvedAt = new Date();
      this.pendingRequests = this.pendingRequests.filter((r) => r.id !== id);
    }
  }

  rejectRequest(id: number) {
    const request = this.pendingRequests.find((r) => r.id === id);
    if (request) {
      request.status = 'rejected';
      this.pendingRequests = this.pendingRequests.filter((r) => r.id !== id);
    }
  }

  deleteRequest(id: number) {
    this.myRequests = this.myRequests.filter((request) => request.id !== id);
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      pending: 'Pendente',
      approved: 'Aprovado',
      rejected: 'Rejeitado',
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
      low: 'Baixa',
      medium: 'Média',
      high: 'Alta',
      urgent: 'Urgente',
    };
    return priorityMap[priority] || priority;
  }

  getCategoryText(category: string): string {
    const categoryMap: { [key: string]: string } = {
      software: 'Software',
      hardware: 'Hardware',
      services: 'Serviços',
      materials: 'Materiais',
      other: 'Outros',
    };
    return categoryMap[category] || category;
  }

  getAllRequests() {
    this.http.get<ProductRequest[]>(`${this.API_URL}/solicitacao`).subscribe({
      next: (data) => {
        console.log('✅ Dados recebidos:', data);
        this.allRequests = data;
      },
      error: (err) => {
        console.error('❌ Erro ao buscar solicitações:', err);
      },
    });
  }

  showAllRequests() {
    console.log('cliquei na parada');
    this.currentSection = 'all-requests';
    this.getAllRequests();
  }

  ngOnInit(): void {
    this.getAllRequests();
  }
}
