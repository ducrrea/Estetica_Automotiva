import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ClienteService } from '../../services/cliente.service';
import { AgendamentoService } from '../../services/agendamento.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private clienteService = inject(ClienteService);
  private agendamentoService = inject(AgendamentoService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  // Mapeamento completo para garantir exibição independente do nome usado no HTML
  stats: any = {
    totalClientes: 0,
    totalBoxes: 5,
    totalRecursos: 5,
    agendamentosHoje: 0,
    hoje: 0,
    totalAgendados: 0,
    totalAgendamentos: 0,
    total: 0
  };

  // Métricas diretas
  totalClientes = 0;
  totalBoxes = 5;
  totalRecursos = 5;
  agendamentosHoje = 0;
  totalAgendados = 0;
  totalAgendamentos = 0;

  // Listas de dados para bindings do HTML
  recursos: any[] = [];
  agendamentos: any[] = [];
  clientes: any[] = [];

  ngOnInit(): void {
    this.carregarDadosPainel();
  }

  carregarDadosPainel(): void {
    forkJoin({
      clientes: this.clienteService.listar(),
      agendamentos: this.agendamentoService.listar()
    }).subscribe({
      next: (res: any) => {
        // Processa Clientes
        const listaClientes = Array.isArray(res.clientes)
          ? res.clientes
          : (res.clientes?.dados || res.clientes?.clientes || []);
        
        this.clientes = listaClientes;
        const qtdClientes = listaClientes.length;
        this.totalClientes = qtdClientes;
        this.stats.totalClientes = qtdClientes;

        // Processa Agendamentos
        const listaAgendamentos = Array.isArray(res.agendamentos)
          ? res.agendamentos
          : (res.agendamentos?.dados || res.agendamentos?.agendamentos || []);
        
        this.agendamentos = listaAgendamentos;
        const qtdAgendados = listaAgendamentos.length;
        
        // Define valor para todas as variações possíveis da variável no card
        this.totalAgendados = qtdAgendados;
        this.totalAgendamentos = qtdAgendados;
        this.stats.totalAgendados = qtdAgendados;
        this.stats.totalAgendamentos = qtdAgendados;
        this.stats.total = qtdAgendados;

        // Agendamentos de Hoje
        const hoje = new Date().toISOString().split('T')[0];
        const qtdHoje = listaAgendamentos.filter((a: any) => {
          if (!a.data_agendamento) return false;
          const dataItem = a.data_agendamento.toString().split('T')[0];
          return dataItem === hoje;
        }).length;

        this.agendamentosHoje = qtdHoje;
        this.stats.agendamentosHoje = qtdHoje;
        this.stats.hoje = qtdHoje;

        // Atualiza a renderização do Angular
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar métricas do painel:', err);
      }
    });
  }

  // Redirecionamentos para os botões de ação do Painel
  gerenciarClientes(): void {
    this.router.navigate(['/clientes']);
  }

  novoAgendamento(): void {
    this.router.navigate(['/agendamentos']);
  }

  abrirModalAgendamento(): void {
    this.router.navigate(['/agendamentos']);
  }
}