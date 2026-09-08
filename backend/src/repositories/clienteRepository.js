// Repositório para acesso a dados de Clientes
const { query, getIsPgConnected } = require('../config/database');

// Armazenamento em memória para contingência
let clientesMemoria = [
  {
    id: 1,
    nome: 'Carlos Eduardo Silva',
    email: 'carlos.silva@email.com',
    telefone: '(11) 98765-4321',
    documento: '123.456.789-00',
    veiculo_modelo: 'BMW M3 Competition',
    veiculo_placa: 'BRA2E19',
    criado_em: new Date(),
  },
  {
    id: 2,
    nome: 'Mariana Albuquerque',
    email: 'mariana.albuquerque@email.com',
    telefone: '(11) 97654-3210',
    documento: '234.567.890-11',
    veiculo_modelo: 'Porsche 911 Carrera',
    veiculo_placa: 'EST8X88',
    criado_em: new Date(),
  },
  {
    id: 3,
    nome: 'Roberto Mendes',
    email: 'roberto.mendes@email.com',
    telefone: '(11) 96543-2109',
    documento: '345.678.901-22',
    veiculo_modelo: 'Audi RS6 Avant',
    veiculo_placa: 'CAR9A01',
    criado_em: new Date(),
  },
];
let proximoClienteId = 4;

// Lista clientes com suporte a filtro de busca por nome ou documento
async function listarTodos(termo = '') {
  if (getIsPgConnected()) {
    if (termo) {
      const sql = 'SELECT * FROM clientes WHERE nome ILIKE $1 OR documento ILIKE $1 ORDER BY id DESC';
      const res = await query(sql, [`%${termo}%`]);
      return res.rows;
    }
    const res = await query('SELECT * FROM clientes ORDER BY id DESC');
    return res.rows;
  }
  const filtro = (termo || '').toLowerCase().trim();
  if (!filtro) return [...clientesMemoria].reverse();
  return clientesMemoria.filter((c) => c.nome.toLowerCase().includes(filtro) || c.documento.includes(filtro));
}

// Busca cliente por ID
async function buscarPorId(id) {
  if (getIsPgConnected()) {
    const res = await query('SELECT * FROM clientes WHERE id = $1', [id]);
    return res.rows[0] || null;
  }
  return clientesMemoria.find((c) => c.id === parseInt(id, 10)) || null;
}

// Busca cliente por documento (CPF/CNPJ)
async function buscarPorDocumento(documento) {
  if (getIsPgConnected()) {
    const res = await query('SELECT * FROM clientes WHERE documento = $1', [documento]);
    return res.rows[0] || null;
  }
  return clientesMemoria.find((c) => c.documento === documento) || null;
}

// Insere um novo cliente
async function criar(dados) {
  const { nome, email, telefone, documento, veiculo_modelo, veiculo_placa } = dados;
  if (getIsPgConnected()) {
    const sql = `
      INSERT INTO clientes (nome, email, telefone, documento, veiculo_modelo, veiculo_placa)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `;
    const res = await query(sql, [nome, email, telefone, documento, veiculo_modelo, veiculo_placa]);
    return res.rows[0];
  }
  const novoCliente = { id: proximoClienteId++, nome, email, telefone, documento, veiculo_modelo, veiculo_placa, criado_em: new Date() };
  clientesMemoria.push(novoCliente);
  return novoCliente;
}

// Atualiza os dados de um cliente existente
async function atualizar(id, dados) {
  const { nome, email, telefone, documento, veiculo_modelo, veiculo_placa } = dados;
  if (getIsPgConnected()) {
    const sql = `
      UPDATE clientes SET nome = $1, email = $2, telefone = $3, documento = $4,
      veiculo_modelo = $5, veiculo_placa = $6, atualizado_em = CURRENT_TIMESTAMP
      WHERE id = $7 RETURNING *
    `;
    const res = await query(sql, [nome, email, telefone, documento, veiculo_modelo, veiculo_placa, id]);
    return res.rows[0] || null;
  }
  const index = clientesMemoria.findIndex((c) => c.id === parseInt(id, 10));
  if (index === -1) return null;
  clientesMemoria[index] = { ...clientesMemoria[index], nome, email, telefone, documento, veiculo_modelo, veiculo_placa, atualizado_em: new Date() };
  return clientesMemoria[index];
}

// Exclui um cliente pelo identificador
async function excluir(id) {
  if (getIsPgConnected()) {
    const res = await query('DELETE FROM clientes WHERE id = $1 RETURNING id', [id]);
    return res.rowCount > 0;
  }
  const index = clientesMemoria.findIndex((c) => c.id === parseInt(id, 10));
  if (index === -1) return false;
  clientesMemoria.splice(index, 1);
  return true;
}

module.exports = {
  listarTodos,
  buscarPorId,
  buscarPorDocumento,
  criar,
  atualizar,
  excluir,
};
