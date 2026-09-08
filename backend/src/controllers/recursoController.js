// Controlador de Recursos (Boxes de Estética Automotiva)
const recursoService = require('../services/recursoService');

// Lista todos os boxes/recursos disponíveis
async function listar(req, res, next) {
  try {
    const recursos = await recursoService.listar();
    return res.status(200).json({ sucesso: true, dados: recursos });
  } catch (error) {
    return next(error);
  }
}

// Obtém um box/recurso pelo ID
async function obterPorId(req, res, next) {
  try {
    const recurso = await recursoService.obterPorId(req.params.id);
    return res.status(200).json({ sucesso: true, dados: recurso });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listar,
  obterPorId,
};
