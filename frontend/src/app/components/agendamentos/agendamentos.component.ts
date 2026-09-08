// Componente de Gerenciamento de Agendamentos e Validação de Conflito de Boxes
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { AgendamentoService } from '../../services/agendamento.service';
import { ClienteService } from '../../services/cliente.service';
import { RecursoService } from '../../services/recurso.service';
import { Agendamento } from '../../models/agendamento.model';
import { Cliente } from '../../models/cliente.model';
import { Recurso } from '../../models/recurso.model';

@Component({
  selector: 'app-agendamentos',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './agendamentos.component.html',
  styleUrls: ['./agendamentos.component.css'],
})
export class AgendamentosComponent implements OnInit {
  private agendamentoService = inject(AgendamentoService);
  private clienteService = inject(ClienteService);
  private recursoService = inject(RecursoService);

  agendamentos: Agendamento[] = [];
  clientes: Cliente[] = [];
  recursos: Recurso[] = [];

  carregando = false;
  salvando = false;
  exibirModalForm = false;
  
  // Alerta especial para Conflito de Horário (Double-Booking)
  alertaConflito = '';
  mensagemSucesso = '';
  errosForm: { [key: string]: string } = {};

  novoAgendamento: Agendamento = this.criarAgendamentoEmBranco();

  ngOnInit(): void {
    this.carregarDados();
  }

  // Cria objeto padrão em branco para novo agendamento
  private criarAgendamentoEmBranco(): Agendamento {
    const hoje = new Date().toISOString().split('T')[0];
    return {
      cliente_id: 0,
      recurso_id: 0,
      data_agendamento: hoje,
      hora_agendamento: '09:00',
      servico: 'Lavagem Detalhada Premium',
      valor: 180.0,
      observacoes: '',
    };
  }

  // Carrega agendamentos, clientes e os 5+ recursos da API
  carregarDados(): void {
    this.carregando = true;
    this.agendamentoService.listar().subscribe({
      next: (res) => {
        this.agendamentos = Array.isArray(res.dados) ? res.dados : [];
        this.carregando = false;
      },
      error: () => (this.carregando = false),
    });
    this.clienteService.listar().subscribe({
      next: (res) => (this.clientes = Array.isArray(res.dados) ? res.dados : []),
    });
    this.recursoService.listar().subscribe({
      next: (res) => (this.recursos = Array.isArray(res.dados) ? res.dados : []),
    });
  }

  // Abre modal de novo agendamento e reseta alertas
  abrirModalNovo(): void {
    this.novoAgendamento = this.criarAgendamentoEmBranco();
    if (this.clientes.length > 0 && this.clientes[0].id) {
      this.novoAgendamento.cliente_id = this.clientes[0].id;
    }
    if (this.recursos.length > 0) {
      this.novoAgendamento.recurso_id = this.recursos[0].id;
    }
    this.alertaConflito = '';
    this.errosForm = {};
    this.exibirModalForm = true;
  }

  // Valida campos obrigatórios antes do envio
  validarFormulario(): boolean {
    this.errosForm = {};
    this.alertaConflito = '';
    if (!this.novoAgendamento.cliente_id) this.errosForm['cliente_id'] = 'Selecione um cliente.';
    if (!this.novoAgendamento.recurso_id) this.errosForm['recurso_id'] = 'Selecione um Box/Recurso.';
    if (!this.novoAgendamento.data_agendamento) this.errosForm['data_agendamento'] = 'Informe a data.';
    if (!this.novoAgendamento.hora_agendamento) this.errosForm['hora_agendamento'] = 'Informe o horário.';
    if (!this.novoAgendamento.servico?.trim()) this.errosForm['servico'] = 'Informe o serviço.';
    return Object.keys(this.errosForm).length === 0;
  }

  // Salva o agendamento tratando explicitamente erros de conflito de horário (409)
  salvarAgendamento(): void {
    if (!this.validarFormulario()) return;
    this.salvando = true;
    this.alertaConflito = '';
    this.agendamentoService.criar(this.novoAgendamento).subscribe({
      next: () => {
        this.salvando = false;
        this.exibirModalForm = false;
        this.mensagemSucesso = 'Agendamento confirmado com sucesso!';
        setTimeout(() => (this.mensagemSucesso = ''), 5000);
        this.carregarDados();
      },
      error: (err) => {
        this.salvando = false;
        // Tratamento da Regra de Conflito de Horário (Double-Booking)
        this.alertaConflito = err.error?.erro || 'Erro ao processar o agendamento.';
      },
    });
  }

  // Cancela um agendamento existente
  cancelarAgendamento(agendamento: Agendamento): void {
    if (!agendamento.id) return;
    if (confirm(`Deseja cancelar o agendamento de ${agendamento.cliente_nome} no ${agendamento.recurso_nome}?`)) {
      this.agendamentoService.alterarStatus(agendamento.id, 'CANCELADO').subscribe({
        next: () => {
          this.mensagemSucesso = 'Agendamento cancelado com sucesso!';
          setTimeout(() => (this.mensagemSucesso = ''), 4000);
          this.carregarDados();
        },
      });
    }
  }
}
