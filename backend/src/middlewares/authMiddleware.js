// Middleware de Autenticação JWT
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_padrao_2026';

// Valida a presença e integridade do token Bearer no cabeçalho
function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ erro: 'Acesso negado. Token de autenticação não fornecido.' });
  }
  try {
    const decodificado = jwt.verify(token, JWT_SECRET);
    req.usuario = decodificado;
    return next();
  } catch (error) {
    return res.status(403).json({ erro: 'Token inválido ou expirado. Faça login novamente.' });
  }
}

module.exports = {
  autenticarToken,
};
