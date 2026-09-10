// Serviço Angular para Operações de Clientes
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente, RespostaApiCliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/clientes';



  // Lista clientes cadastrados com busca opcional por nome ou documento
  listar(busca?: string): Observable<RespostaApiCliente> {
    let params = new HttpParams();
    if (busca && busca.trim()) {
      params = params.set('busca', busca.trim());
    }
    return this.http.get<RespostaApiCliente>(this.apiUrl, { params });
  }

  // Obtém um cliente por ID
  obterPorId(id: number): Observable<RespostaApiCliente> {
    return this.http.get<RespostaApiCliente>(`${this.apiUrl}/${id}`);
  }

  // Cadastra um novo cliente
  criar(cliente: Cliente): Observable<RespostaApiCliente> {
    return this.http.post<RespostaApiCliente>(this.apiUrl, cliente);
  }

  // Atualiza um cliente existente
  atualizar(id: number, cliente: Cliente): Observable<RespostaApiCliente> {
    return this.http.put<RespostaApiCliente>(`${this.apiUrl}/${id}`, cliente);
  }

  // Exclui um cliente da base de dados
  excluir(id: number): Observable<{ sucesso: boolean; mensagem: string }> {
    return this.http.delete<{ sucesso: boolean; mensagem: string }>(`${this.apiUrl}/${id}`);
  }
}
