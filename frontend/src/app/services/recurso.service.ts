// Serviço Angular para Consulta aos Recursos / Boxes
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RespostaApiRecurso } from '../models/recurso.model';

@Injectable({
  providedIn: 'root',
})
export class RecursoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/recursos';

  // Obtém a lista de todos os boxes/recursos disponíveis
  listar(): Observable<RespostaApiRecurso> {
    return this.http.get<RespostaApiRecurso>(this.apiUrl);
  }

  // Obtém detalhes de um box específico
  obterPorId(id: number): Observable<RespostaApiRecurso> {
    return this.http.get<RespostaApiRecurso>(`${this.apiUrl}/${id}`);
  }
}
