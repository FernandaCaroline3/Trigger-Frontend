import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Por favor, insira um e-mail válido';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Simula delay de rede
    setTimeout(() => {
      const success = this.authService.login(this.email, this.password);
      
      if (success) {
        this.handleSuccessfulLogin();
      } else {
        this.handleFailedLogin();
      }
      
      this.isLoading = false;
    }, 1500);
  }

  private handleSuccessfulLogin(): void {
    this.router.navigate(['/home']);
  }

  private handleFailedLogin(): void {
    this.errorMessage = 'E-mail ou senha incorretos. Tente novamente.';
    this.password = '';
  }

  clearError(): void {
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}