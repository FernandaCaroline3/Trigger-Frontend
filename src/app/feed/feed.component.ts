import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Post {
  id: number;
  author: string;
  authorRole: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  liked: boolean;
}

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent {
  newPostContent = '';
  currentUser = {
    name: 'João Silva',
    role: 'Administrador'
  };

  posts: Post[] = [
    {
      id: 1,
      author: 'Maria Santos',
      authorRole: 'Coordenadora de Vendas',
      content: 'Relatório de vendas do último trimestre mostra crescimento de 15% em comparação com o mesmo período do ano anterior. Destacamos o excelente desempenho da equipe comercial.',
      timestamp: '2 horas atrás',
      likes: 8,
      comments: 3,
      liked: false
    },
    {
      id: 2,
      author: 'Carlos Oliveira',
      authorRole: 'Gerente de TI',
      content: 'Sistema de gestão atualizado com novas funcionalidades. Todas as equipes devem participar do treinamento agendado para próxima quarta-feira.',
      timestamp: '1 dia atrás',
      likes: 12,
      comments: 5,
      liked: true
    },
    {
      id: 3,
      author: 'Ana Costa',
      authorRole: 'Analista de Marketing',
      content: 'Campanha de lançamento do novo produto atingiu 85% do público-alvo. Resultados preliminares mostram excelente engajamento nas redes sociais.',
      timestamp: '3 dias atrás',
      likes: 15,
      comments: 7,
      liked: false
    }
  ];

  createPost() {
    if (this.newPostContent.trim()) {
      const newPost: Post = {
        id: Date.now(),
        author: this.currentUser.name,
        authorRole: this.currentUser.role,
        content: this.newPostContent,
        timestamp: 'Agora',
        likes: 0,
        comments: 0,
        liked: false
      };
      
      this.posts.unshift(newPost);
      this.newPostContent = '';
    }
  }

  toggleLike(post: Post) {
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
  }

  addComment(post: Post) {
    post.comments++;
  }
}