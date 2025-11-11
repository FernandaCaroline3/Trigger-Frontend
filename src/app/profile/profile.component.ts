import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../service/auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  isEditing = false;
  isLoading = false; // ✅ PROPRIEDADE ADICIONADA
  
  user = {
    name: '',
    email: '',
    role: '',
    department: '',
    phone: '(00) 00000-0000',
    joinedDate: '',
    bio: 'Nenhuma biografia informada.',
    avatar: '75'
  };

  stats = {
    reportsCreated: 0,
    requestsMade: 0,
    approvalRate: 0,
    activeDays: 0
  };

  originalUser = { ...this.user };

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUserData();
    this.loadUserStats();
  }

  loadUserData() {
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser) {
      this.user = {
        name: currentUser.name || 'Usuário',
        email: currentUser.email || '',
        role: currentUser.adm ? 'Administrador' : 'Usuário',
        department: currentUser.setor || 'Não informado',
        phone: currentUser.phone || '(00) 00000-0000',
        joinedDate: this.formatJoinDate(currentUser.createdAt),
        bio: currentUser.bio || 'Nenhuma biografia informada.',
        avatar: '75'
      };
      this.originalUser = { ...this.user };
    }
  }

  loadUserStats() {
    this.stats = {
      reportsCreated: 0,
      requestsMade: 0, 
      approvalRate: 0,
      activeDays: this.calculateActiveDays()
    };
  }

  calculateActiveDays(): number {
    if (!this.user.joinedDate || this.user.joinedDate === 'Data não informada') {
      return 0;
    }
    
    try {
      const joinDate = new Date(this.user.joinedDate);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - joinDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return 0;
    }
  }

  formatJoinDate(dateString: any): string {
    if (!dateString) return 'Data não informada';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  }

  enableEdit() {
    this.isEditing = true;
    this.originalUser = { ...this.user };
  }

  // ✅ MÉTODO saveProfile CORRIGIDO
  saveProfile() {
    if (!this.isFormValid()) {
      alert('Por favor, preencha pelo menos o nome e email.');
      return;
    }

    this.isLoading = true;
    console.log('🔄 Iniciando atualização do perfil...', this.user);

    this.authService.updateUserProfile(this.user).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('✅ Resposta do backend:', response);

        if (response.success && response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
          this.loadUserData();
          alert('Perfil atualizado com sucesso! As alterações foram salvas permanentemente.');
        } else {
          alert('Erro: ' + (response.message || 'Resposta inválida do servidor'));
        }

        this.isEditing = false;
        this.originalUser = { ...this.user };
      },
      error: (error) => {
        this.isLoading = false;
        console.error('❌ Erro ao atualizar perfil:', error);
        
        let errorMessage = 'Erro ao atualizar perfil. ';
        
        if (error.status === 404) {
          errorMessage += 'Usuário não encontrado.';
        } else if (error.status === 400) {
          errorMessage += 'Dados inválidos.';
        } else if (error.error?.message) {
          errorMessage += error.error.message;
        } else {
          errorMessage += 'Tente novamente.';
        }
        
        alert(errorMessage);
      }
    });
  }

  cancelEdit() {
    this.user = { ...this.originalUser };
    this.isEditing = false;
  }

  isFormValid(): boolean {
    return !!this.user.name && !!this.user.email;
  }
}