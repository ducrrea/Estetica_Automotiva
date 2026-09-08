// Interface do Modelo de Recurso (Box de Estética Automotiva)
export interface Recurso {
  id: number;
  nome: string;
  tipo: string;
  descricao: string;
  tempo_estimado_min: number;
  status: string;
}

// Interface de Resposta Padrão da API para Recursos
export interface RespostaApiRecurso {
  sucesso: boolean;
  dados: Recurso[];
  erro?: string;
}
