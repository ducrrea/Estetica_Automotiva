// Repositório para acesso a dados de Agendamentos
const { query, getIsPgConnected } = require('../config/database');

// Armazenamento em memória para contingência
let agendamentosMemoria = [
  {
    id: 1,
    cliente_id: 1,
    cliente_nome: 'Carlos Eduardo Silva',
    cliente_telefone: '(11) 98765-4321',
    veiculo_modelo: 'BMW M3 Competition',
    recurso_id: 1,
    recurso_nome: 'Box 01 - Lavagem Detalhada & Snow Foam',
    data_agendamento: new Date().toISOString().split('T')[0],
    hora_agendamento: '09:00',
    servico: 'Lavagem Detalhada Premium',
    valor: 180.0,
    status: 'AGENDADO',
    observacoes: 'Atenção especial nas caixas de roda',
    criado_em: new Date(),
  },
  {
    id: 2,
    cliente_id: 2,
    cliente_nome: 'Mariana Albuquerque',
    cliente_telefone: '(11) 97654-3210',
    veiculo_modelo: 'Porsche 911 Carrera',
    recurso_id: 2,
    recurso_nome: 'Box 02 - Polimento Técnico & Correção',
    data_agendamento: new Date().toISOString().split('T')[0],
    hora_agendamento: '10:30',
    servico: 'Polimento Técnico em 2 Etapas',
    valor: 850.0,
    status: 'AGENDADO',
    observacoes: 'Correção de swirls leves',
    criado_em: new Date(),
  },
];
let proximoAgendamentoId = 3;

// Lista agendamentos com dados populados de Cliente e Recurso
async function listarTodos() {
  if (getIsPgConnected()) {
    const sql = `
      SELECT a.id, a.cliente_id, a.recurso_id, TO_CHAR(a.data_agendamento, 'YYYY-MM-DD') AS data_agendamento,
             TO_CHAR(a.hora_agendamento, 'HH24:MI') AS hora_agendamento, a.servico, a.valor, a.status,
             a.observacoes, a.criado_em, c.nome AS cliente_nome, c.telefone AS cliente_telefone,
             c.veiculo_modelo, c.veiculo_placa, r.nome AS recurso_nome, r.tipo AS recurso_tipo
      FROM agendamentos a
      JOIN clientes c ON c.id = a.cliente_id
      JOIN recursos r ON r.id = a.recurso_id
      ORDER BY a.data_agendamento DESC, a.hora_agendamento DESC
    `;
    const res = await query(sql);
    return res.rows;
  }
  return [...agendamentosMemoria].reverse();
}

// Verifica se já existe agendamento ativo no mesmo Box, Data e Hora
async function buscarConflito(recursoId, data, hora, agendamentoIdIgnorar = null) {
  const horaNormalizada = hora.length === 5 ? `${hora}:00` : hora;
  if (getIsPgConnected()) {
    let sql = `
      SELECT a.*, r.nome AS recurso_nome FROM agendamentos a
      JOIN recursos r ON r.id = a.recurso_id
      WHERE a.recurso_id = $1 AND a.data_agendamento = $2 AND a.hora_agendamento = $3 AND a.status != 'CANCELADO'
    `;
    const params = [recursoId, data, horaNormalizada];
    if (agendamentoIdIgnorar) {
      sql += ' AND a.id != $4';
      params.push(agendamentoIdIgnorar);
    }
    const res = await query(sql, params);
    return res.rows[0] || null;
  }
  const horaAbreviada = hora.substring(0, 5);
  return agendamentosMemoria.find((a) => {
    if (agendamentoIdIgnorar && a.id === parseInt(agendamentoIdIgnorar, 10)) return false;
    return (
      a.recurso_id === parseInt(recursoId, 10) &&
      a.data_agendamento === data &&
      a.hora_agendamento.substring(0, 5) === horaAbreviada &&
      a.status !== 'CANCELADO'
    );
  }) || null;
}

// Cria um novo agendamento
async function criar(dados, infoCliente, infoRecurso) {
  const { cliente_id, recurso_id, data_agendamento, hora_agendamento, servico, valor, observacoes } = dados;
  if (getIsPgConnected()) {
    const sql = `
      INSERT INTO agendamentos (cliente_id, recurso_id, data_agendamento, hora_agendamento, servico, valor, observacoes)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
    `;
    const res = await query(sql, [cliente_id, recurso_id, data_agendamento, hora_agendamento, servico, valor || 0, observacoes || '']);
    return res.rows[0];
  }
  const novo = {
    id: proximoAgendamentoId++,
    cliente_id: parseInt(cliente_id, 10),
    cliente_nome: infoCliente ? infoCliente.nome : 'Cliente',
    cliente_telefone: infoCliente ? infoCliente.telefone : '',
    veiculo_modelo: infoCliente ? infoCliente.veiculo_modelo : '',
    recurso_id: parseInt(recurso_id, 10),
    recurso_nome: infoRecurso ? infoRecurso.nome : 'Box',
    data_agendamento,
    hora_agendamento: hora_agendamento.substring(0, 5),
    servico,
    valor: parseFloat(valor) || 0,
    status: 'AGENDADO',
    observacoes: observacoes || '',
    criado_em: new Date(),
  };
  agendamentosMemoria.push(novo);
  return novo;
}

// Atualiza o status de um agendamento
async function atualizarStatus(id, novoStatus) {
  if (getIsPgConnected()) {
    const sql = 'UPDATE agendamentos SET status = $1, atualizado_em = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
    const res = await query(sql, [novoStatus, id]);
    return res.rows[0] || null;
  }
  const agendamento = agendamentosMemoria.find((a) => a.id === parseInt(id, 10));
  if (!agendamento) return null;
  agendamento.status = novoStatus;
  agendamento.atualizado_em = new Date();
  return agendamento;
}

// Exclui um agendamento
async function excluir(id) {
  if (getIsPgConnected()) {
    const res = await query('DELETE FROM agendamentos WHERE id = $1 RETURNING id', [id]);
    return res.rowCount > 0;
  }
  const index = agendamentosMemoria.findIndex((a) => a.id === parseInt(id, 10));
  if (index === -1) return false;
  agendamentosMemoria.splice(index, 1);
  return true;
}

module.exports = {
  listarTodos,
  buscarConflito,
  criar,
  atualizarStatus,
  excluir,
};
