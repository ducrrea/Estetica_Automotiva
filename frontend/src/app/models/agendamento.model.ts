// Interface do Modelo de Agendamento
export interface Agendamento {
  id?: number;
  cliente_id: number;
  cliente_nome?: string;
  cliente_telefone?: string;
  veiculo_modelo?: string;
  veiculo_placa?: string;
  recurso_id: number;
  recurso_nome?: string;
  recurso_tipo?: string;
  data_agendamento: string;
  hora_agendamento: string;
  servico: string;
  valor?: number;
  status?: string;
  observacoes?: string;
  criado_em?: string;
}

// Interface de Resposta Padrão da API para Agendamentos
export interface RespostaApiAgendamento {
  sucesso: boolean;
  dados: Agendamento | Agendamento[];
  mensagem?: string;
  erro?: string;
  conflito?: boolean;
}
