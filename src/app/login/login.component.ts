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
goToRegister(): void {
  this.router.navigate(['/register']);
}
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

    this.isLoading = true;
    this.errorMessage = '';

        const success = this.authService.login(this.email, this.password);
      
      if (success) {
        this.router.navigate(['/home']);
      } else {
        this.errorMessage = 'E-mail ou senha incorretos';
      }
      
      this.isLoading = false;

    /*setTimeout(() => {
      const success = this.authService.login(this.email, this.password);
      
      if (success) {
        this.router.navigate(['/home']);
      } else {
        this.errorMessage = 'E-mail ou senha incorretos';
      }
      
      this.isLoading = false;
    }, 1000);*/
  }
}