import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Solicitacao {
  solicitacao_id?: number;
  patrimonio_id: number;
  user_id: number;
  tipo: 'Atribuição' | 'Transferência' | 'Devolução';
  observacao?: string;
  created_at?: string;
  status?: string;
}

export interface Patrimonio {
  patrimonio_id?: number;
  name: string;
  status: string;
  estoque: number;
  id_user_responsavel: number;
  setor_id: number;
  categoria_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class SolicitacoesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  // Solicitações
  criarSolicitacao(solicitacao: Omit<Solicitacao, 'solicitacao_id' | 'created_at'>): Observable<Solicitacao> {
    return this.http.post<Solicitacao>(`${this.apiUrl}/solicitacoes`, solicitacao);
  }

  getTodasSolicitacoes(): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(`${this.apiUrl}/solicitacoes`);
  }

  getSolicitacaoPorId(id: number): Observable<Solicitacao> {
    return this.http.get<Solicitacao>(`${this.apiUrl}/solicitacoes/${id}`);
  }

  deletarSolicitacao(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/solicitacoes/${id}`);
  }

  // Patrimônios
  getTodosPatrimonios(): Observable<Patrimonio[]> {
    return this.http.get<Patrimonio[]>(`${this.apiUrl}/patrimonios`);
  }

  criarPatrimonio(patrimonio: Omit<Patrimonio, 'patrimonio_id'>): Observable<Patrimonio> {
    return this.http.post<Patrimonio>(`${this.apiUrl}/patrimonios`, patrimonio);
  }

  getPatrimonioPorId(id: number): Observable<Patrimonio> {
    return this.http.get<Patrimonio>(`${this.apiUrl}/patrimonios/${id}`);
  }

  atualizarPatrimonio(id: number, patrimonio: Partial<Patrimonio>): Observable<Patrimonio> {
    return this.http.patch<Patrimonio>(`${this.apiUrl}/patrimonios/update/${id}`, patrimonio);
  }

  deletarPatrimonio(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/patrimonios/${id}`);
  }
}