import { Injectable } from '@angular/core';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  department: string;
  password: string;
  avatar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [
    { 
      id: '1', 
      name: 'Admin Geral', 
      email: 'admin@empresa.com', 
      role: 'admin', 
      department: 'Geral', 
      password: 'admin123',
      avatar: '👤'
    },
    { 
      id: '2', 
      name: 'João Silva', 
      email: 'joao@empresa.com', 
      role: 'admin', 
      department: 'Vendas', 
      password: 'vendas123',
      avatar: '👤'
    },
    { 
      id: '3', 
      name: 'Maria Santos', 
      email: 'maria@empresa.com', 
      role: 'user', 
      department: 'Marketing', 
      password: 'user123',
      avatar: '👤'
    },
    { 
      id: '4', 
      name: 'Pedro Oliveira', 
      email: 'pedro@empresa.com', 
      role: 'user', 
      department: 'Vendas', 
      password: 'user123',
      avatar: '👤'
    }
  ];

  private currentUser: User | null = null;
  private isAuthenticatedValue: boolean = false;

  constructor() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
      this.isAuthenticatedValue = true;
    }
  }

  login(email: string, password: string): boolean {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.currentUser = user;
      this.isAuthenticatedValue = true;
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser = null;
    this.isAuthenticatedValue = false;
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedValue;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  getUsers(): User[] {
    return this.users;
  }

  updateUserProfile(updatedUser: User): boolean {
    const index = this.users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updatedUser };
      if (this.currentUser?.id === updatedUser.id) {
        this.currentUser = { ...this.currentUser, ...updatedUser };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      }
      return true;
    }
    return false;
  }

  getDepartments(): string[] {
    return ['Geral', 'Vendas', 'Marketing', 'TI', 'RH', 'Financeiro', 'Operações'];
  }

  addUser(userData: Omit<User, 'id'>): boolean {
    const newUser: User = {
      ...userData,
      id: (this.users.length + 1).toString(),
      avatar: '👤'
    };
    this.users.push(newUser);
    return true;
  }

  removeUser(userId: string): boolean {
    if (userId === this.currentUser?.id) {
      alert('Você não pode remover seu próprio usuário.');
      return false;
    }
    
    const index = this.users.findIndex(user => user.id === userId);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }
}