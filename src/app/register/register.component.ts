import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../service/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  userData = {
    name: '',
    username: '',
    email: '',
    senha: '',
    confirmPassword: '',
    setor: ''
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  clearErrors() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  isFormValid(): boolean {
    return this.userData.name !== '' && 
           this.userData.username !== '' && 
           this.userData.email !== '' && 
           this.userData.senha !== '' && 
           this.userData.confirmPassword !== '' &&
           this.userData.senha === this.userData.confirmPassword;
  }

  onSubmit() {
    if (!this.isFormValid()) {
      this.errorMessage = 'Por favor, preencha todos os campos corretamente.';
      return;
    }

    if (this.userData.senha !== this.userData.confirmPassword) {
      this.errorMessage = 'Senhas não coincidem!';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Preparar dados para API (remover confirmPassword)
    const { confirmPassword, ...registerData } = this.userData;

    console.log('📝 Tentando registrar:', registerData);

    this.authService.register(registerData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.message || 'Cadastro realizado com sucesso!';
        
        console.log('✅ Usuário cadastrado:', response);
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('❌ Erro no cadastro:', error);
        
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else if (error.status === 400) {
          this.errorMessage = 'Usuário já existe com este email ou username';
        } else {
          this.errorMessage = 'Erro ao cadastrar usuário. Tente novamente.';
        }
      }
    });
  }
}