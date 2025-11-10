import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;

  constructor(private router: Router) {}

  login() {
    if (this.email && this.password) {
      this.isLoading = true;
      
      // Simulação de login
      setTimeout(() => {
        this.isLoading = false;
        this.router.navigate(['/app/profile']);
      }, 1500);
    }
  }
}