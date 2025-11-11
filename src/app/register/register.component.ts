import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../auth/auth.service'; // ← Corrigido o caminho

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, FormsModule]
})
export class RegisterComponent {
  userData = {
    name: '',
    email: '',
    department: '',
    role: 'user' as 'admin' | 'user',
    password: ''
  };
  
  confirmPassword: string = '';
  departments: string[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.departments = this.authService.getDepartments();
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      this.errorMessage = 'Por favor, preencha todos os campos';
      return;
    }

    if (this.userData.password !== this.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem';
      return;
    }

    if (this.userData.password.length < 6) {
      this.errorMessage = 'A senha deve ter pelo menos 6 caracteres';
      return;
    }

    // Verifica se o email já existe (com tipagem correta)
    const existingUser = this.authService.getUsers().find((user: User) => user.email === this.userData.email);
    if (existingUser) {
      this.errorMessage = 'Este email já está cadastrado';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Simula processamento
    setTimeout(() => {
      try {
        const success = this.authService.addUser(this.userData);
        
        if (success) {
          this.successMessage = 'Usuário cadastrado com sucesso! Redirecionando para login...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessage = 'Erro ao cadastrar usuário. Tente novamente.';
        }
      } catch (error) {
        this.errorMessage = 'Erro ao processar cadastro. Tente novamente.';
      }
      
      this.isLoading = false;
    }, 1500);
  }

  isFormValid(): boolean {
    return !!this.userData.name && 
           !!this.userData.email && 
           !!this.userData.department && 
           !!this.userData.password && 
           !!this.confirmPassword;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  clearErrors(): void {
    this.errorMessage = '';
  }
}