// Serviço de Recursos (Boxes de Estética Automotiva)
const recursoRepository = require('../repositories/recursoRepository');

// Lista todos os recursos cadastrados
async function listar() {
  return recursoRepository.listarTodos();
}

// Obtém um recurso específico por ID
async function obterPorId(id) {
  const recurso = await recursoRepository.buscarPorId(id);
  if (!recurso) throw new Error('Box/Recurso não encontrado.');
  return recurso;
}

module.exports = {
  listar,
  obterPorId,
};
