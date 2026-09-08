// Controlador de Estatísticas do Dashboard
const clienteRepository = require('../repositories/clienteRepository');
const recursoRepository = require('../repositories/recursoRepository');
const agendamentoRepository = require('../repositories/agendamentoRepository');

// Retorna métricas resumidas para o painel principal
async function obterEstatisticas(req, res, next) {
  try {
    const clientes = await clienteRepository.listarTodos();
    const recursos = await recursoRepository.listarTodos();
    const agendamentos = await agendamentoRepository.listarTodos();
    const hoje = new Date().toISOString().split('T')[0];
    const agendamentosHoje = agendamentos.filter((a) => a.data_agendamento === hoje && a.status !== 'CANCELADO');
    return res.status(200).json({
      sucesso: true,
      dados: {
        totalClientes: clientes.length,
        totalRecursos: recursos.length,
        totalAgendamentos: agendamentos.length,
        agendamentosHoje: agendamentosHoje.length,
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  obterEstatisticas,
};
