// Serviço de Regras de Negócio e Conflito para Agendamentos
const agendamentoRepository = require('../repositories/agendamentoRepository');
const clienteRepository = require('../repositories/clienteRepository');
const recursoRepository = require('../repositories/recursoRepository');

// Lista todos os agendamentos registrados
async function listar() {
  return agendamentoRepository.listarTodos();
}

// Valida campos obrigatórios de entrada do agendamento
function validarDados(dados) {
  const { cliente_id, recurso_id, data_agendamento, hora_agendamento, servico } = dados;
  if (!cliente_id) throw new Error('A seleção do Cliente é obrigatória.');
  if (!recurso_id) throw new Error('A seleção do Box/Recurso é obrigatória.');
  if (!data_agendamento) throw new Error('A Data do agendamento é obrigatória.');
  if (!hora_agendamento) throw new Error('A Hora do agendamento é obrigatória.');
  if (!servico || !servico.trim()) throw new Error('A especificação do Serviço é obrigatória.');
}

// Verifica se há conflito de horário para o Box (Anti-Double Booking)
async function verificarConflito(recursoId, data, hora, idIgnorar = null) {
  const conflito = await agendamentoRepository.buscarConflito(recursoId, data, hora, idIgnorar);
  if (conflito) {
    const err = new Error(
      `Conflito de Horário: O ${conflito.recurso_nome || 'Box selecionado'} já possui um agendamento para a data ${data} às ${hora}. Escolha outro horário ou outro Box.`
    );
    err.status = 409;
    err.isConflict = true;
    throw err;
  }
}

// Cria um novo agendamento com validação estrita de conflito
async function criar(dados) {
  validarDados(dados);
  const { cliente_id, recurso_id, data_agendamento, hora_agendamento } = dados;
  const cliente = await clienteRepository.buscarPorId(cliente_id);
  if (!cliente) throw new Error('Cliente selecionado não foi encontrado.');
  const recurso = await recursoRepository.buscarPorId(recurso_id);
  if (!recurso) throw new Error('Box/Recurso selecionado não foi encontrado.');
  await verificarConflito(recurso_id, data_agendamento, hora_agendamento);
  return agendamentoRepository.criar(dados, cliente, recurso);
}

// Atualiza um agendamento validando referências e conflito de horário
async function atualizar(id, dados) {
  validarDados(dados);
  const { cliente_id, recurso_id, data_agendamento, hora_agendamento } = dados;
  const cliente = await clienteRepository.buscarPorId(cliente_id);
  if (!cliente) throw new Error('Cliente selecionado não foi encontrado.');
  const recurso = await recursoRepository.buscarPorId(recurso_id);
  if (!recurso) throw new Error('Box/Recurso selecionado não foi encontrado.');
  await verificarConflito(recurso_id, data_agendamento, hora_agendamento, id);
  const atualizado = await agendamentoRepository.atualizar(id, dados, cliente, recurso);
  if (!atualizado) throw new Error('Agendamento não encontrado para atualização.');
  return atualizado;
}

// Altera o status do agendamento (Ex: REALIZADO, CANCELADO)
async function alterarStatus(id, novoStatus) {
  const statusPermitidos = ['AGENDADO', 'EM_ANDAMENTO', 'FINALIZADO', 'CANCELADO'];
  if (!statusPermitidos.includes(novoStatus)) {
    throw new Error(`Status inválido. Permitidos: ${statusPermitidos.join(', ')}`);
  }
  const atualizado = await agendamentoRepository.atualizarStatus(id, novoStatus);
  if (!atualizado) throw new Error('Agendamento não encontrado para atualização.');
  return atualizado;
}

// Exclui um agendamento
async function excluir(id) {
  const sucesso = await agendamentoRepository.excluir(id);
  if (!sucesso) throw new Error('Agendamento não encontrado para exclusão.');
  return { mensagem: 'Agendamento removido com sucesso.' };
}

module.exports = {
  listar,
  criar,
  atualizar,
  alterarStatus,
  excluir,
  verificarConflito,
};
