// Componente do Painel Geral e Métricas
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { DashboardService } from '../../services/dashboard.service';
import { RecursoService } from '../../services/recurso.service';
import { EstatisticasDashboard } from '../../models/dashboard.model';
import { Recurso } from '../../models/recurso.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private recursoService = inject(RecursoService);

  stats: EstatisticasDashboard = { totalClientes: 0, totalRecursos: 5, totalAgendamentos: 0, agendamentosHoje: 0 };
  recursos: Recurso[] = [];
  carregando = true;

  ngOnInit(): void {
    this.carregarDados();
  }

  // Carrega as estatísticas consolidadas e recursos
  carregarDados(): void {
    this.carregando = true;
    this.dashboardService.obterEstatisticas().subscribe({
      next: (res) => {
        if (res.sucesso) this.stats = res.dados;
      },
    });
    this.recursoService.listar().subscribe({
      next: (res) => {
        if (res.sucesso) this.recursos = res.dados;
        this.carregando = false;
      },
      error: () => (this.carregando = false),
    });
  }
}
