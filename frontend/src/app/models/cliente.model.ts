// Interface do Modelo de Cliente e Veículo
export interface Cliente {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  documento: string;
  veiculo_modelo: string;
  veiculo_placa: string;
  criado_em?: string;
  atualizado_em?: string;
}

// Interface de Resposta Padrão da API para Clientes
export interface RespostaApiCliente {
  sucesso: boolean;
  dados: Cliente | Cliente[];
  mensagem?: string;
  erro?: string;
}
