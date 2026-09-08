// Interface das Métricas do Dashboard
export interface EstatisticasDashboard {
  totalClientes: number;
  totalRecursos: number;
  totalAgendamentos: number;
  agendamentosHoje: number;
}

// Interface de Resposta da API para o Dashboard
export interface RespostaApiDashboard {
  sucesso: boolean;
  dados: EstatisticasDashboard;
  erro?: string;
}
