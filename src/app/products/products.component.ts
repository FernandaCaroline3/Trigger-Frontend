import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitacoesService, Solicitacao, Patrimonio } from '../service/solicitacoes/solicitacoes.service';
import { AuthService } from '../service/auth/auth.service';

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
export class ProductsComponent implements OnInit {
  private solicitacoesService = inject(SolicitacoesService);
  private authService = inject(AuthService);

  currentSection: 'create' | 'my-requests' | 'all-requests' | 'pending' = 'create';
  isAdmin = false;

  // Dados para o formulário
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

  tiposSolicitacao = [
    { value: 'Atribuição', label: 'Atribuição' },
    { value: 'Transferência', label: 'Transferência' },
    { value: 'Devolução', label: 'Devolução' }
  ];

  // Novo formulário adaptado para o backend
  newRequest = {
    patrimonio_id: 0,
    user_id: 0,
    tipo: 'Atribuição' as 'Atribuição' | 'Transferência' | 'Devolução',
    observacao: ''
  };

  // Listas
  myRequests: Solicitacao[] = [];
  allRequests: Solicitacao[] = [];
  pendingRequests: Solicitacao[] = [];
  patrimonios: Patrimonio[] = [];

  ngOnInit(): void {
    this.checkAdminStatus();
    this.carregarPatrimonios();
    this.carregarTodasSolicitacoes();
  }

  checkAdminStatus() {
    this.isAdmin = this.authService.isAdmin();
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.newRequest.user_id = currentUser.id;
    }
  }

  carregarPatrimonios() {
    this.solicitacoesService.getTodosPatrimonios().subscribe({
      next: (data) => {
        this.patrimonios = data;
      },
      error: (error) => {
        console.error('Erro ao carregar patrimônios:', error);
      }
    });
  }

  carregarTodasSolicitacoes() {
    this.solicitacoesService.getTodasSolicitacoes().subscribe({
      next: (data) => {
        console.log('✅ Solicitações carregadas:', data);
        this.allRequests = data;
        this.filtrarMinhasSolicitacoes();
        this.filtrarSolicitacoesPendentes();
      },
      error: (error) => {
        console.error('❌ Erro ao carregar solicitações:', error);
      }
    });
  }

  filtrarMinhasSolicitacoes() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.myRequests = this.allRequests.filter(solicitacao => 
        solicitacao.user_id === currentUser.id
      );
    }
  }

  filtrarSolicitacoesPendentes() {
    this.pendingRequests = this.allRequests.filter(solicitacao => 
      solicitacao.status === 'pending' || !solicitacao.status
    );
  }

  createRequest() {
    if (!this.newRequest.patrimonio_id || !this.newRequest.user_id) {
      alert('Por favor, selecione um patrimônio e verifique se está logado.');
      return;
    }

    this.solicitacoesService.criarSolicitacao(this.newRequest).subscribe({
      next: (response) => {
        console.log('✅ Solicitação criada com sucesso:', response);
        alert('Solicitação criada com sucesso!');
        
        // Resetar formulário
        this.newRequest = {
          patrimonio_id: 0,
          user_id: this.newRequest.user_id, // Mantém o user_id
          tipo: 'Atribuição',
          observacao: ''
        };

        // Recarregar lista
        this.carregarTodasSolicitacoes();
      },
      error: (error) => {
        console.error('❌ Erro ao criar solicitação:', error);
        alert(`Erro ao criar solicitação: ${error.message}`);
      }
    });
  }

  approveRequest(id: number) {
    // Implementar aprovação no backend quando tiver o endpoint
    const request = this.pendingRequests.find((r) => r.solicitacao_id === id);
    if (request) {
      // Aqui você faria uma requisição PATCH para atualizar o status
      this.pendingRequests = this.pendingRequests.filter((r) => r.solicitacao_id !== id);
      alert('Solicitação aprovada!');
    }
  }

  rejectRequest(id: number) {
    // Implementar rejeição no backend quando tiver o endpoint
    const request = this.pendingRequests.find((r) => r.solicitacao_id === id);
    if (request) {
      // Aqui você faria uma requisição PATCH para atualizar o status
      this.pendingRequests = this.pendingRequests.filter((r) => r.solicitacao_id !== id);
      alert('Solicitação rejeitada!');
    }
  }

  deleteRequest(id: number) {
    if (confirm('Tem certeza que deseja excluir esta solicitação?')) {
      this.solicitacoesService.deletarSolicitacao(id).subscribe({
        next: () => {
          this.myRequests = this.myRequests.filter(request => request.solicitacao_id !== id);
          this.allRequests = this.allRequests.filter(request => request.solicitacao_id !== id);
          alert('Solicitação excluída com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao excluir solicitação:', error);
          alert('Erro ao excluir solicitação.');
        }
      });
    }
  }

  // Métodos auxiliares para o template
  getStatusText(status: string | undefined): string {
    const statusMap: { [key: string]: string } = {
      pending: 'Pendente',
      approved: 'Aprovado',
      rejected: 'Rejeitado',
    };
    return statusMap[status || 'pending'] || 'Pendente';
  }

  getStatusClass(status: string | undefined): string {
    return `status-${status || 'pending'}`;
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

  getTipoText(tipo: string): string {
    return tipo; // Já está em português
  }

  showAllRequests() {
    this.currentSection = 'all-requests';
    this.carregarTodasSolicitacoes();
  }

  getPatrimonioNome(patrimonioId: number): string {
    const patrimonio = this.patrimonios.find(p => p.patrimonio_id === patrimonioId);
    return patrimonio ? patrimonio.name : 'Patrimônio não encontrado';
  }
}