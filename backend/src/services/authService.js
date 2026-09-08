// Serviço de Autenticação e Gestão de Sessão
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuarioRepository = require('../repositories/usuarioRepository');

const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_padrao_2026';

// Autentica as credenciais do usuário e emite token JWT
async function login(email, senha) {
  if (!email || !senha) {
    throw new Error('E-mail e senha são obrigatórios.');
  }
  const usuario = await usuarioRepository.buscarPorEmail(email);
  if (!usuario) {
    throw new Error('Credenciais inválidas. Verifique seu e-mail e senha.');
  }
  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
  if (!senhaCorreta) {
    throw new Error('Credenciais inválidas. Verifique seu e-mail e senha.');
  }
  const token = jwt.sign(
    { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
  return {
    token,
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil },
  };
}

module.exports = {
  login,
};
