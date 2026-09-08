// Interface do Modelo de Usuário
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: string;
}

// Interface de Resposta da Autenticação
export interface RespostaLogin {
  sucesso: boolean;
  token: string;
  usuario: Usuario;
  erro?: string;
}
