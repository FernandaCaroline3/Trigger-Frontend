import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  user_id?: number;
  id?: number;
  name: string;
  username: string;
  email: string;
  senha: string;
  setor?: string;
  phone?: string;
  bio?: string;
  adm?: boolean;
  createdAt?: string;
}

export interface LoginCredentials {
  username: string;
  senha: string;
}

export interface RegisterData {
  name: string;
  username: string;
  email: string;
  senha: string;
  setor?: string;
}

export interface ApiResponse {
  message: string;
  user?: any;
  token?: string;
  success?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Registrar usuário
  register(userData: RegisterData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/auth/register`, userData);
  }

  // Login
  login(credentials: LoginCredentials): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/auth/login`, credentials);
  }

  // ✅ MÉTODO NOVO: Atualizar perfil
  updateUserProfile(profileData: any): Observable<any> {
    const currentUser = this.getCurrentUser();
    
    // Verifica se tem usuário logado
    if (!currentUser) {
      throw new Error('Usuário não está logado');
    }

    // Prepara os dados para o backend
    const updateData = {
      userId: currentUser.user_id || currentUser.id, // Tenta ambos os nomes
      name: profileData.name,
      phone: profileData.phone,
      bio: profileData.bio,
      setor: profileData.department
    };
    
    console.log('🔄 Enviando para o backend:', updateData);
    
    return this.http.put(`${this.apiUrl}/usuarios/profile/update`, updateData);
  }

  // Verificar se usuário está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // ✅ Verificar se usuário é admin
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user ? user.adm === true : false;
  }

  // Logout
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Obter token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Obter usuário atual
  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // ✅ Obter nome do usuário
  getUserName(): string {
    const user = this.getCurrentUser();
    return user?.name || 'Usuário';
  }
}