import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  isEditing = false;
  
  user = {
    name: 'João Silva',
    email: 'joao.silva@capsa.com',
    role: 'Administrador',
    department: 'Tecnologia da Informação',
    phone: '(11) 99999-9999',
    joinedDate: '2023-01-15',
    bio: 'Especialista em desenvolvimento de sistemas e soluções tecnológicas.',
    avatar: 'JS'
  };

  originalUser = { ...this.user };

  enableEdit() {
    this.isEditing = true;
    this.originalUser = { ...this.user };
  }

  saveProfile() {
    this.isEditing = false;
    alert('Perfil atualizado com sucesso!');
  }

  cancelEdit() {
    this.isEditing = false;
    this.user = { ...this.originalUser };
  }

  changePassword() {
    alert('Funcionalidade de alteração de senha será implementada em breve!');
  }
}