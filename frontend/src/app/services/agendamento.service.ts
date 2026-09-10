// Serviço Angular para Operações de Agendamentos
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agendamento, RespostaApiAgendamento } from '../models/agendamento.model';

@Injectable({
  providedIn: 'root',
})
export class AgendamentoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/agendamentos';



  // Lista todos os agendamentos realizados
  listar(): Observable<RespostaApiAgendamento> {
    return this.http.get<RespostaApiAgendamento>(this.apiUrl);
  }

  // Cria um novo agendamento (processando validação de conflito de horário)
  criar(agendamento: Agendamento): Observable<RespostaApiAgendamento> {
    return this.http.post<RespostaApiAgendamento>(this.apiUrl, agendamento);
  }

  // Atualiza o status de um agendamento
  alterarStatus(id: number, status: string): Observable<RespostaApiAgendamento> {
    return this.http.patch<RespostaApiAgendamento>(`${this.apiUrl}/${id}/status`, { status });
  }

  // Exclui um agendamento
  excluir(id: number): Observable<{ sucesso: boolean; mensagem: string }> {
    return this.http.delete<{ sucesso: boolean; mensagem: string }>(`${this.apiUrl}/${id}`);
  }
}
