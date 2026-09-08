// Repositório para acesso a dados de Recursos (Boxes de Estética Automotiva)
const { query, getIsPgConnected } = require('../config/database');

// Armazenamento em memória contendo os 5 recursos obrigatórios
let recursosMemoria = [
  {
    id: 1,
    nome: 'Box 01 - Lavagem Detalhada & Snow Foam',
    tipo: 'Lavagem',
    descricao: 'Pré-lavagem com shampoo neutro, snow foam e secagem com ar filtrado.',
    tempo_estimado_min: 60,
    status: 'ATIVO',
  },
  {
    id: 2,
    nome: 'Box 02 - Polimento Técnico & Correção',
    tipo: 'Polimento',
    descricao: 'Cabine com iluminação LED de alta definição para correção de verniz.',
    tempo_estimado_min: 120,
    status: 'ATIVO',
  },
  {
    id: 3,
    nome: 'Box 03 - Vitrificação Cerâmica & Nano',
    tipo: 'Proteção',
    descricao: 'Ambiente com temperatura controlada para cura de vitrificadores 9H.',
    tempo_estimado_min: 180,
    status: 'ATIVO',
  },
  {
    id: 4,
    nome: 'Box 04 - Higienização Interna & Oxi',
    tipo: 'Interior',
    descricao: 'Limpeza a vapor, higienização de couro e oxi-sanitização por ozônio.',
    tempo_estimado_min: 90,
    status: 'ATIVO',
  },
  {
    id: 5,
    nome: 'Box 05 - Estufa de Secagem & Aplicação PPF',
    tipo: 'Película & PPF',
    descricao: 'Box estéril e livre de poeira para aplicação de Paint Protection Film.',
    tempo_estimado_min: 240,
    status: 'ATIVO',
  },
];

// Lista todos os recursos ativos
async function listarTodos() {
  if (getIsPgConnected()) {
    const res = await query('SELECT * FROM recursos ORDER BY id ASC');
    return res.rows;
  }
  return [...recursosMemoria];
}

// Busca recurso específico por identificador
async function buscarPorId(id) {
  if (getIsPgConnected()) {
    const res = await query('SELECT * FROM recursos WHERE id = $1', [id]);
    return res.rows[0] || null;
  }
  return recursosMemoria.find((r) => r.id === parseInt(id, 10)) || null;
}

module.exports = {
  listarTodos,
  buscarPorId,
};
