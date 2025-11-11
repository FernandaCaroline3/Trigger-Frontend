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

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Mantenha o setTimeout para simular chamada de API
    setTimeout(() => {
      const success = this.authService.login(this.email, this.password);
      
      if (success) {
        console.log('✅ Login bem-sucedido, redirecionando...');
        this.router.navigate(['/app']); // ← MUDEI PARA '/app'
      } else {
        this.errorMessage = 'E-mail ou senha incorretos';
        console.log('❌ Login falhou');
      }
      
      this.isLoading = false;
    }, 1000);
  }
}