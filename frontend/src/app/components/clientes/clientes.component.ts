import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  private clienteService = inject(ClienteService);
  private cdr = inject(ChangeDetectorRef);

  // Controle de Estado da Lista
  clientes: any[] = [];
  clientesOriginais: any[] = [];
  carregando = false;
  termoBusca = '';

  // Modais e Formulário
  exibirModalForm = false;
  exibirModalExcluir = false;
  modoEdicao = false;

  mensagemAlerta = '';
  tipoAlerta: 'success' | 'danger' = 'success';

  clienteSelecionado: any = this.criarClienteVazio();
  clienteParaExcluir: any = null;
  errosForm: { [key: string]: string } = {};

  ngOnInit(): void {
    this.carregarClientes();
  }

  criarClienteVazio() {
    return {
      id: null,
      nome: '',
      documento: '',
      telefone: '',
      email: '',
      veiculo_modelo: '',
      veiculo_placa: ''
    };
  }

  carregarClientes(): void {
    this.carregando = true;
    this.clienteService.listar().subscribe({
      next: (res: any) => {
        const dados = Array.isArray(res) ? res : (res?.dados || res?.clientes || []);
        this.clientesOriginais = dados;
        this.clientes = [...dados];
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao listar clientes:', err);
        this.exibirAlerta('Erro ao carregar lista de clientes.', 'danger');
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  aoBuscar(): void {
    if (!this.termoBusca.trim()) {
      this.clientes = [...this.clientesOriginais];
    } else {
      const termo = this.termoBusca.toLowerCase().trim();
      this.clientes = this.clientesOriginais.filter(c =>
        (c.nome && c.nome.toLowerCase().includes(termo)) ||
        (c.documento && c.documento.toLowerCase().includes(termo)) ||
        (c.email && c.email.toLowerCase().includes(termo)) ||
        (c.veiculo_placa && c.veiculo_placa.toLowerCase().includes(termo))
      );
    }
    this.cdr.detectChanges();
  }

  abrirModalNovo(): void {
    this.modoEdicao = false;
    this.clienteSelecionado = this.criarClienteVazio();
    this.errosForm = {};
    this.exibirModalForm = true;
    this.cdr.detectChanges();
  }

  abrirModalEditar(cliente: any): void {
    this.modoEdicao = true;
    this.clienteSelecionado = { ...cliente };
    this.errosForm = {};
    this.exibirModalForm = true;
    this.cdr.detectChanges();
  }

  solicitarExclusao(cliente: any): void {
    this.clienteParaExcluir = cliente;
    this.exibirModalExcluir = true;
    this.cdr.detectChanges();
  }

  confirmarExclusao(): void {
    if (!this.clienteParaExcluir?.id) return;

    this.clienteService.excluir(this.clienteParaExcluir.id).subscribe({
      next: () => {
        this.clientesOriginais = this.clientesOriginais.filter(c => c.id !== this.clienteParaExcluir.id);
        this.aoBuscar();
        this.exibirModalExcluir = false;
        this.clienteParaExcluir = null;
        this.exibirAlerta('Cliente excluído com sucesso!', 'success');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao excluir cliente:', err);
        this.exibirModalExcluir = false;
        this.exibirAlerta('Erro ao excluir cliente. Verifique se ele possui agendamentos ativos.', 'danger');
        this.cdr.detectChanges();
      }
    });
  }

  salvarCliente(): void {
    this.errosForm = {};
    const placaDigitada = this.clienteSelecionado.veiculo_placa?.trim().toUpperCase();

    // Validações de campos obrigatórios
    if (!this.clienteSelecionado.nome?.trim()) {
      this.errosForm['nome'] = 'O nome é obrigatório.';
    }
    if (!this.clienteSelecionado.documento?.trim()) {
      this.errosForm['documento'] = 'O CPF/Documento é obrigatório.';
    }
    if (!this.clienteSelecionado.veiculo_modelo?.trim()) {
      this.errosForm['veiculo_modelo'] = 'O modelo do veículo é obrigatório.';
    }

    // Validação e Trava de Placa Duplicada
    if (!placaDigitada) {
      this.errosForm['veiculo_placa'] = 'A placa do veículo é obrigatória.';
    } else {
      const placaExiste = this.clientesOriginais.some(c =>
        c.id !== this.clienteSelecionado.id &&
        c.veiculo_placa &&
        c.veiculo_placa.trim().toUpperCase() === placaDigitada
      );

      if (placaExiste) {
        this.errosForm['veiculo_placa'] = `A placa "${placaDigitada}" já pertence a outro cliente cadastrado.`;
      }
    }

    if (Object.keys(this.errosForm).length > 0) {
      this.cdr.detectChanges();
      return;
    }

    this.clienteSelecionado.veiculo_placa = placaDigitada;

    if (this.modoEdicao) {
      this.clienteService.atualizar(this.clienteSelecionado.id, this.clienteSelecionado).subscribe({
        next: () => {
          this.exibirModalForm = false;
          this.exibirAlerta('Dados do cliente atualizados com sucesso!', 'success');
          this.carregarClientes();
        },
        error: (err) => {
          console.error('Erro ao atualizar cliente:', err);
          this.exibirAlerta('Erro ao atualizar cliente.', 'danger');
          this.cdr.detectChanges();
        }
      });
    } else {
      this.clienteService.criar(this.clienteSelecionado).subscribe({
        next: () => {
          this.exibirModalForm = false;
          this.exibirAlerta('Novo cliente cadastrado com sucesso!', 'success');
          this.carregarClientes();
        },
        error: (err) => {
          console.error('Erro ao criar cliente:', err);
          this.exibirAlerta('Erro ao cadastrar novo cliente.', 'danger');
          this.cdr.detectChanges();
        }
      });
    }
  }

  private exibirAlerta(mensagem: string, tipo: 'success' | 'danger'): void {
    this.mensagemAlerta = mensagem;
    this.tipoAlerta = tipo;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.mensagemAlerta = '';
      this.cdr.detectChanges();
    }, 4000);
  }
}