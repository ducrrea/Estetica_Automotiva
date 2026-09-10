// Serviço Angular para Indicadores do Dashboard
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RespostaApiDashboard } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/dashboard/stats';


  // Obtém métricas consolidadas do sistema
  obterEstatisticas(): Observable<RespostaApiDashboard> {
    return this.http.get<RespostaApiDashboard>(this.apiUrl);
  }
}
