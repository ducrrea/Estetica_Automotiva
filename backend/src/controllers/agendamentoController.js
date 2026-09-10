// Controlador de Agendamentos
const agendamentoService = require('../services/agendamentoService');

// Lista todos os agendamentos cadastrados
async function listar(req, res, next) {
  try {
    const agendamentos = await agendamentoService.listar();
    return res.status(200).json({ sucesso: true, dados: agendamentos });
  } catch (error) {
    return next(error);
  }
}

// Cria um novo agendamento com validação de conflito de horário
async function criar(req, res, next) {
  try {
    const novo = await agendamentoService.criar(req.body);
    return res.status(201).json({ sucesso: true, dados: novo, mensagem: 'Agendamento confirmado com sucesso!' });
  } catch (error) {
    return next(error);
  }
}

// Atualiza os dados completos de um agendamento
async function atualizar(req, res, next) {
  try {
    const atualizado = await agendamentoService.atualizar(req.params.id, req.body);
    return res.status(200).json({ sucesso: true, dados: atualizado, mensagem: 'Agendamento atualizado com sucesso!' });
  } catch (error) {
    return next(error);
  }
}

// Altera o status do agendamento (Ex: REALIZADO, CANCELADO)
async function alterarStatus(req, res, next) {
  try {
    const { status } = req.body;
    const atualizado = await agendamentoService.alterarStatus(req.params.id, status);
    return res.status(200).json({ sucesso: true, dados: atualizado, mensagem: 'Status atualizado com sucesso!' });
  } catch (error) {
    return next(error);
  }
}

// Exclui um agendamento
async function excluir(req, res, next) {
  try {
    const resultado = await agendamentoService.excluir(req.params.id);
    return res.status(200).json({ sucesso: true, ...resultado });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listar,
  criar,
  atualizar,
  alterarStatus,
  excluir,
};
