// Controlador de Autenticação
const authService = require('../services/authService');

// Processa a solicitação de login de usuário
async function login(req, res, next) {
  try {
    const { email, senha } = req.body;
    const resultado = await authService.login(email, senha);
    return res.status(200).json({ sucesso: true, ...resultado });
  } catch (error) {
    return next(error);
  }
}

// Retorna os dados do usuário atualmente autenticado
async function obterPerfil(req, res) {
  return res.status(200).json({ sucesso: true, usuario: req.usuario });
}

module.exports = {
  login,
  obterPerfil,
};
