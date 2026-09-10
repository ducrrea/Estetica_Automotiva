import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/agendamentos';
  private apiRecursosUrl = 'http://localhost:3000/api/recursos';

  listar(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  listarRecursos(): Observable<any> {
    return this.http.get(this.apiRecursosUrl);
  }

  criar(agendamento: any): Observable<any> {
    return this.http.post(this.apiUrl, agendamento);
  }

  atualizar(id: any, agendamento: any): Observable<any> {
    if (!id || id === 'undefined') {
      return throwError(() => new Error('ID do agendamento inválido ou ausente.'));
    }

    // Tenta via PUT primeiro; se o servidor esperar PATCH, tenta PATCH como fallback
    return this.http.put(`${this.apiUrl}/${id}`, agendamento).pipe(
      catchError((err) => {
        if (err.status === 404 || err.status === 405) {
          return this.http.patch(`${this.apiUrl}/${id}`, agendamento);
        }
        return throwError(() => err);
      })
    );
  }

  excluir(id: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  cancelar(id: any): Observable<any> {
    return this.excluir(id);
  }
}