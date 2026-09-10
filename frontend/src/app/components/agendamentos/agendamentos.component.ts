import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { AgendamentoService } from '../../services/agendamento.service';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-agendamentos',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './agendamentos.component.html',
  styleUrls: ['./agendamentos.component.css']
})
export class AgendamentosComponent implements OnInit {
  private agendamentoService = inject(AgendamentoService);
  private clienteService = inject(ClienteService);
  private cdr = inject(ChangeDetectorRef);

  agendamentos: any[] = [];
  clientes: any[] = [];
  recursos: any[] = [];
  carregando = false;
  salvando = false;

  exibirModalForm = false;
  exibirModalExcluir = false;
  modoEdicao = false;

  mensagemSucesso = '';
  alertaConflito = '';
  errosForm: { [key: string]: string } = {};

  novoAgendamento: any = this.criarAgendamentoVazio();
  agendamentoParaExcluir: any = null;

  ngOnInit(): void {
    this.carregarDados();
  }

  criarAgendamentoVazio() {
    return {
      id: null,
      cliente_id: 0,
      recurso_id: 0,
      data_agendamento: new Date().toISOString().split('T')[0],
      hora_agendamento: '09:00',
      servico: '',
      valor: null,
      observacoes: ''
    };
  }

  obterBoxesPadrao() {
    return [
      { id: 1, nome: 'Box 01', tipo: 'Lavagem & Estética' },
      { id: 2, nome: 'Box 02', tipo: 'Polimento Técnico' },
      { id: 3, nome: 'Box 03', tipo: 'Higienização Interna' }
    ];
  }

  carregarDados(): void {
    this.carregando = true;

    this.clienteService.listar().subscribe({
      next: (res: any) => {
        this.clientes = Array.isArray(res) ? res : (res?.dados || res?.clientes || []);
        this.cdr.detectChanges();
      }
    });

    this.agendamentoService.listarRecursos().subscribe({
      next: (res: any) => {
        const lista = Array.isArray(res) ? res : (res?.dados || res?.recursos || []);
        this.recursos = lista.length > 0 ? lista : this.obterBoxesPadrao();
        this.cdr.detectChanges();
      },
      error: () => {
        this.recursos = this.obterBoxesPadrao();
        this.cdr.detectChanges();
      }
    });

    this.agendamentoService.listar().subscribe({
      next: (res: any) => {
        this.agendamentos = Array.isArray(res) ? res : (res?.dados || res?.agendamentos || []);
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erro ao carregar agendamentos:', err);
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  abrirModalNovo(): void {
    this.modoEdicao = false;
    this.alertaConflito = '';
    this.errosForm = {};
    this.novoAgendamento = this.criarAgendamentoVazio();

    if (this.recursos.length > 0) {
      this.novoAgendamento.recurso_id = this.recursos[0].id;
    }
    if (this.clientes.length > 0) {
      this.novoAgendamento.cliente_id = this.clientes[0].id;
    }

    this.exibirModalForm = true;
    this.cdr.detectChanges();
  }

  editarAgendamento(agendamento: any): void {
    this.modoEdicao = true;
    this.alertaConflito = '';
    this.errosForm = {};
    this.novoAgendamento = { ...agendamento };
    this.exibirModalForm = true;
    this.cdr.detectChanges();
  }

  solicitarExclusao(agendamento: any): void {
    this.agendamentoParaExcluir = agendamento;
    this.exibirModalExcluir = true;
    this.cdr.detectChanges();
  }

  confirmarExclusao(): void {
    if (!this.agendamentoParaExcluir?.id) return;

    const id = this.agendamentoParaExcluir.id;
    this.agendamentoService.excluir(id).subscribe({
      next: () => {
        this.agendamentos = this.agendamentos.filter(a => a.id !== id);
        this.exibirModalExcluir = false;
        this.agendamentoParaExcluir = null;
        this.mensagemSucesso = 'Agendamento removido com sucesso!';
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.exibirModalExcluir = false;
        this.alertaConflito = 'Erro ao excluir agendamento.';
        this.cdr.detectChanges();
      }
    });
  }

  salvarAgendamento(): void {
  this.errosForm = {};
  this.alertaConflito = '';

  if (!this.novoAgendamento.cliente_id || Number(this.novoAgendamento.cliente_id) === 0) {
    this.alertaConflito = 'Por favor, selecione um Cliente.';
    this.cdr.detectChanges();
    return;
  }

  if (!this.novoAgendamento.recurso_id || Number(this.novoAgendamento.recurso_id) === 0) {
    this.alertaConflito = 'Por favor, selecione um Box de Estética.';
    this.cdr.detectChanges();
    return;
  }

  if (!this.novoAgendamento.servico?.trim()) {
    this.errosForm['servico'] = 'O serviço é obrigatório.';
    this.cdr.detectChanges();
    return;
  }

  // Busca o ID em todas as propriedades possíveis retornadas pela API/Banco
  const idAgendamento = 
    this.novoAgendamento.id ?? 
    this.novoAgendamento.id_agendamento ?? 
    this.novoAgendamento._id ?? 
    this.novoAgendamento.codigo;

  if (this.modoEdicao && (!idAgendamento || idAgendamento === 0)) {
    this.alertaConflito = 'Não foi possível identificar o ID deste agendamento para atualização.';
    this.cdr.detectChanges();
    return;
  }

  let valorFormatado = 0;
  if (this.novoAgendamento.valor !== null && this.novoAgendamento.valor !== undefined) {
    const strValor = String(this.novoAgendamento.valor).replace(',', '.');
    valorFormatado = parseFloat(strValor) || 0;
  }

  const payload: any = {
    cliente_id: Number(this.novoAgendamento.cliente_id),
    recurso_id: Number(this.novoAgendamento.recurso_id),
    data_agendamento: this.novoAgendamento.data_agendamento,
    hora_agendamento: this.novoAgendamento.hora_agendamento,
    servico: this.novoAgendamento.servico,
    valor: valorFormatado,
    observacoes: this.novoAgendamento.observacoes || '',
    status: this.novoAgendamento.status || 'AGENDADO'
  };

  this.salvando = true;

  if (this.modoEdicao && idAgendamento) {
    payload.id = idAgendamento;
    this.agendamentoService.atualizar(idAgendamento, payload).subscribe({
      next: () => this.finalizarSalvar('Agendamento atualizado com sucesso!'),
      error: (err: any) => this.tratarErroSalvar(err)
    });
  } else {
    this.agendamentoService.criar(payload).subscribe({
      next: () => this.finalizarSalvar('Agendamento realizado com sucesso!'),
      error: (err: any) => this.tratarErroSalvar(err)
    });
  }
}

  private finalizarSalvar(msg: string): void {
    this.salvando = false;
    this.exibirModalForm = false;
    this.mensagemSucesso = msg;
    this.carregarDados();
  }

  private tratarErroSalvar(err: any): void {
    this.salvando = false;
    console.error('Detalhe do erro enviado pela API:', err);

    if (err?.status === 404) {
      this.alertaConflito = 'Rota de alteração não encontrada no servidor.';
    } else if (typeof err?.error === 'string' && !err.error.includes('<!DOCTYPE')) {
      this.alertaConflito = err.error;
    } else if (err?.error?.mensagem) {
      this.alertaConflito = err.error.mensagem;
    } else if (err?.error?.message) {
      this.alertaConflito = err.error.message;
    } else {
      this.alertaConflito = 'Erro ao salvar alterações no servidor.';
    }

    this.cdr.detectChanges();
  }
}