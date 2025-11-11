import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';

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
    password: ''
  };
  
  confirmPassword: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    console.log('📝 Formulário de cadastro submetido');

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

    // Verifica se o email já existe
    const existingUser = this.authService.getUsers().find(user => user.email === this.userData.email);
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
        // Adiciona valores padrão para department e role
        const userWithDefaults = {
          ...this.userData,
          department: 'Geral',
          role: 'user' as 'admin' | 'user'
        };
        
        const success = this.authService.addUser(userWithDefaults);
        
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
    const isValid = !!this.userData.name && 
           !!this.userData.email && 
           !!this.userData.password && 
           !!this.confirmPassword;

    console.log('✅ Formulário válido?', isValid);
    console.log('Nome:', this.userData.name);
    console.log('Email:', this.userData.email);
    console.log('Senha:', this.userData.password);
    console.log('Confirmação:', this.confirmPassword);

    return isValid;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  clearErrors(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}