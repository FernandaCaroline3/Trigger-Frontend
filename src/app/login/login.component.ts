import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../service/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  senha: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    if (!this.username || !this.senha) {
      this.errorMessage = 'Por favor, preencha username e senha';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials = {
      username: this.username,
      senha: this.senha
    };

    console.log('🔐 Tentando login com:', credentials);

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('✅ Login bem-sucedido:', response);
        
        // Salvar token e informações do usuário
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          console.log('🔑 Token salvo:', response.token);
        }
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
          console.log('👤 Usuário salvo:', response.user);
        }
        
        // Redirecionar para a página principal
        this.router.navigate(['/app']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('❌ Erro no login:', error);
        
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else if (error.status === 401) {
          this.errorMessage = 'Username ou senha inválidos';
        } else if (error.status === 404) {
          this.errorMessage = 'Usuário não encontrado';
        } else {
          this.errorMessage = 'Erro ao fazer login. Tente novamente.';
        }
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  clearError() {
    this.errorMessage = '';
  }
}