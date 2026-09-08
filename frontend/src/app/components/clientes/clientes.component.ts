// Componente de Gerenciamento de Clientes
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
})
export class ClientesComponent implements OnInit {
  private clienteService = inject(ClienteService);

  clientes: Cliente[] = [];
  termoBusca = '';
  carregando = false;
  exibirModalForm = false;
  exibirModalExcluir = false;
  modoEdicao = false;
  mensagemAlerta = '';
  tipoAlerta = 'success';

  clienteSelecionado: Cliente = this.criarClienteEmBranco();
  clienteParaExcluir: Cliente | null = null;
  errosForm: { [key: string]: string } = {};

  ngOnInit(): void {
    this.carregarClientes();
  }

  // Instancia um objeto vazio de cliente
  private criarClienteEmBranco(): Cliente {
    return { nome: '', email: '', telefone: '', documento: '', veiculo_modelo: '', veiculo_placa: '' };
  }

  // Carrega a lista de clientes da API
  carregarClientes(): void {
    this.carregando = true;
    this.clienteService.listar(this.termoBusca).subscribe({
      next: (res) => {
        this.clientes = Array.isArray(res.dados) ? res.dados : [];
        this.carregando = false;
      },
      error: (err) => {
        this.mostrarAlerta(err.error?.erro || 'Erro ao carregar clientes.', 'danger');
        this.carregando = false;
      },
    });
  }

  // Dispara busca ao digitar no campo de pesquisa
  aoBuscar(): void {
    this.carregarClientes();
  }

  // Abre modal para cadastrar novo cliente
  abrirModalNovo(): void {
    this.modoEdicao = false;
    this.clienteSelecionado = this.criarClienteEmBranco();
    this.errosForm = {};
    this.exibirModalForm = true;
  }

  // Abre modal para editar cliente existente
  abrirModalEditar(cliente: Cliente): void {
    this.modoEdicao = true;
    this.clienteSelecionado = { ...cliente };
    this.errosForm = {};
    this.exibirModalForm = true;
  }

  // Valida campos obrigatórios visualmente
  validarFormulario(): boolean {
    this.errosForm = {};
    if (!this.clienteSelecionado.nome?.trim()) this.errosForm['nome'] = 'O nome do cliente é obrigatório.';
    if (!this.clienteSelecionado.documento?.trim()) this.errosForm['documento'] = 'O CPF/Documento é obrigatório.';
    if (!this.clienteSelecionado.veiculo_modelo?.trim()) this.errosForm['veiculo_modelo'] = 'O modelo do veículo é obrigatório.';
    if (!this.clienteSelecionado.veiculo_placa?.trim()) this.errosForm['veiculo_placa'] = 'A placa do veículo é obrigatória.';
    return Object.keys(this.errosForm).length === 0;
  }

  // Salva inclusão ou alteração de cliente
  salvarCliente(): void {
    if (!this.validarFormulario()) return;
    if (this.modoEdicao && this.clienteSelecionado.id) {
      this.clienteService.atualizar(this.clienteSelecionado.id, this.clienteSelecionado).subscribe({
        next: () => this.concluirSalvamento('Cliente atualizado com sucesso!'),
        error: (err) => this.mostrarAlerta(err.error?.erro || 'Erro ao atualizar cliente.', 'danger'),
      });
    } else {
      this.clienteService.criar(this.clienteSelecionado).subscribe({
        next: () => this.concluirSalvamento('Cliente cadastrado com sucesso!'),
        error: (err) => this.mostrarAlerta(err.error?.erro || 'Erro ao cadastrar cliente.', 'danger'),
      });
    }
  }

  // Finaliza a ação de salvar fechando modal e recarregando lista
  private concluirSalvamento(mensagem: string): void {
    this.exibirModalForm = false;
    this.mostrarAlerta(mensagem, 'success');
    this.carregarClientes();
  }

  // Abre modal para confirmar exclusão
  solicitarExclusao(cliente: Cliente): void {
    this.clienteParaExcluir = cliente;
    this.exibirModalExcluir = true;
  }

  // Confirma exclusão de cliente
  confirmarExclusao(): void {
    if (!this.clienteParaExcluir?.id) return;
    this.clienteService.excluir(this.clienteParaExcluir.id).subscribe({
      next: () => {
        this.exibirModalExcluir = false;
        this.mostrarAlerta('Cliente excluído com sucesso!', 'success');
        this.carregarClientes();
      },
      error: (err) => {
        this.exibirModalExcluir = false;
        this.mostrarAlerta(err.error?.erro || 'Erro ao excluir cliente.', 'danger');
      },
    });
  }

  // Exibe mensagem de alerta temporária
  mostrarAlerta(msg: string, tipo: string): void {
    this.mensagemAlerta = msg;
    this.tipoAlerta = tipo;
    setTimeout(() => (this.mensagemAlerta = ''), 5000);
  }
}
