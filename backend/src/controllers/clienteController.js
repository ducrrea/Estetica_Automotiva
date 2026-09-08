// Controlador de Clientes
const clienteService = require('../services/clienteService');

// Lista clientes com suporte a filtro de busca
async function listar(req, res, next) {
  try {
    const { busca } = req.query;
    const clientes = await clienteService.listar(busca);
    return res.status(200).json({ sucesso: true, dados: clientes });
  } catch (error) {
    return next(error);
  }
}

// Obtém um cliente por ID
async function obterPorId(req, res, next) {
  try {
    const cliente = await clienteService.obterPorId(req.params.id);
    return res.status(200).json({ sucesso: true, dados: cliente });
  } catch (error) {
    return next(error);
  }
}

// Cria um novo cliente
async function criar(req, res, next) {
  try {
    const novo = await clienteService.criar(req.body);
    return res.status(201).json({ sucesso: true, dados: novo, mensagem: 'Cliente cadastrado com sucesso.' });
  } catch (error) {
    return next(error);
  }
}

// Atualiza os dados de um cliente
async function atualizar(req, res, next) {
  try {
    const atualizado = await clienteService.atualizar(req.params.id, req.body);
    return res.status(200).json({ sucesso: true, dados: atualizado, mensagem: 'Cliente atualizado com sucesso.' });
  } catch (error) {
    return next(error);
  }
}

// Exclui um cliente existente
async function excluir(req, res, next) {
  try {
    const resultado = await clienteService.excluir(req.params.id);
    return res.status(200).json({ sucesso: true, ...resultado });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listar,
  obterPorId,
  criar,
  atualizar,
  excluir,
};
