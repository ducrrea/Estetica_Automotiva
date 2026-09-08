// Middleware Centralizado para Tratamento de Erros
function tratarErros(err, req, res, next) {
  console.error('[Erro na Aplicação]:', err.message);
  const status = err.status || (err.message.includes('não encontrado') ? 404 : 400);
  return res.status(status).json({
    sucesso: false,
    erro: err.message,
    conflito: Boolean(err.isConflict),
  });
}

module.exports = {
  tratarErros,
};
