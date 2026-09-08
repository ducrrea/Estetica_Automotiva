// Repositório para acesso a dados de Usuários
const { query, getIsPgConnected } = require('../config/database');
const bcrypt = require('bcryptjs');

// Armazenamento em memória para contingência
let usuariosMemoria = [
  {
    id: 1,
    nome: 'Administrador Master',
    email: 'admin@estetica.com',
    senha: bcrypt.hashSync('admin123', 10),
    perfil: 'ADMINISTRADOR',
    criado_em: new Date(),
  },
];

// Busca usuário por e-mail no banco de dados
async function buscarPorEmail(email) {
  if (getIsPgConnected()) {
    const res = await query('SELECT * FROM usuarios WHERE email = $1', [email]);
    return res.rows[0] || null;
  }
  return usuariosMemoria.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

// Busca usuário por identificador (ID)
async function buscarPorId(id) {
  if (getIsPgConnected()) {
    const res = await query('SELECT id, nome, email, perfil, criado_em FROM usuarios WHERE id = $1', [id]);
    return res.rows[0] || null;
  }
  const u = usuariosMemoria.find((u) => u.id === parseInt(id, 10));
  if (!u) return null;
  return { id: u.id, nome: u.nome, email: u.email, perfil: u.perfil, criado_em: u.criado_em };
}

module.exports = {
  buscarPorEmail,
  buscarPorId,
};
