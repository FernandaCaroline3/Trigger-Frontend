import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService); // ✅ Usando inject()
  private router = inject(Router); // ✅ Usando inject()

  // Ou usando constructor (escolha uma abordagem):
  // constructor(
  //   private authService: AuthService,
  //   private router: Router
  // ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}