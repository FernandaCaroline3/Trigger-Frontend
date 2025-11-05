import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  settings = {
    notifications: {
      email: true,
      push: true,
      sms: false,
      weeklyDigest: true,
      reportApprovals: true,
      productRequests: true
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
      showPhone: false,
      activityStatus: true
    },
    preferences: {
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo',
      theme: 'light',
      dateFormat: 'dd/MM/yyyy',
      itemsPerPage: 20
    }
  };

  security = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  languages = [
    { code: 'pt-BR', name: 'Português (Brasil)' },
    { code: 'en-US', name: 'English (US)' },
    { code: 'es-ES', name: 'Español' }
  ];

  timezones = [
    'America/Sao_Paulo',
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo'
  ];

  themes = [
    { value: 'light', label: 'Claro' },
    { value: 'dark', label: 'Escuro' },
    { value: 'auto', label: 'Automático' }
  ];

  dateFormats = [
    { value: 'dd/MM/yyyy', label: 'DD/MM/AAAA' },
    { value: 'MM/dd/yyyy', label: 'MM/DD/AAAA' },
    { value: 'yyyy-MM-dd', label: 'AAAA-MM-DD' }
  ];

  itemsPerPageOptions = [10, 20, 50, 100];

  saveSettings() {
    // Simular salvamento
    alert('Configurações salvas com sucesso!');
  }

  changePassword() {
    if (this.security.newPassword !== this.security.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    if (this.security.newPassword.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres!');
      return;
    }

    alert('Senha alterada com sucesso!');
    
    // Reset form
    this.security = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  exportData() {
    alert('Iniciando exportação de dados...');
    // Implementar lógica de exportação
  }

  deleteAccount() {
    const confirmed = confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.');
    if (confirmed) {
      alert('Sua conta será excluída. Implemente a lógica de exclusão aqui.');
    }
  }
}