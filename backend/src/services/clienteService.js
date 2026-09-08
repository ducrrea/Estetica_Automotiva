// Serviço de Regras de Negócio para Clientes
const clienteRepository = require('../repositories/clienteRepository');

// Lista clientes cadastrados com busca opcional
async function listar(termo) {
  return clienteRepository.listarTodos(termo);
}

// Busca cliente por ID
async function obterPorId(id) {
  const cliente = await clienteRepository.buscarPorId(id);
  if (!cliente) throw new Error('Cliente não encontrado.');
  return cliente;
}

// Valida os campos obrigatórios do cliente
function validarDados(dados) {
  const { nome, documento, veiculo_modelo, veiculo_placa } = dados;
  if (!nome || !nome.trim()) throw new Error('O campo Nome é obrigatório.');
  if (!documento || !documento.trim()) throw new Error('O campo Documento/CPF é obrigatório.');
  if (!veiculo_modelo || !veiculo_modelo.trim()) throw new Error('O Modelo do veículo é obrigatório.');
  if (!veiculo_placa || !veiculo_placa.trim()) throw new Error('A Placa do veículo é obrigatória.');
}

// Cria um novo cliente com validação de unicidade de documento
async function criar(dados) {
  validarDados(dados);
  const existente = await clienteRepository.buscarPorDocumento(dados.documento.trim());
  if (existente) throw new Error('Já existe um cliente cadastrado com este Documento/CPF.');
  return clienteRepository.criar({
    nome: dados.nome.trim(),
    email: (dados.email || '').trim(),
    telefone: (dados.telefone || '').trim(),
    documento: dados.documento.trim(),
    veiculo_modelo: dados.veiculo_modelo.trim(),
    veiculo_placa: dados.veiculo_placa.trim().toUpperCase(),
  });
}

// Atualiza os dados de um cliente existente
async function atualizar(id, dados) {
  validarDados(dados);
  const cliente = await clienteRepository.buscarPorId(id);
  if (!cliente) throw new Error('Cliente não encontrado.');
  const existente = await clienteRepository.buscarPorDocumento(dados.documento.trim());
  if (existente && existente.id !== parseInt(id, 10)) {
    throw new Error('Já existe outro cliente com este Documento/CPF.');
  }
  return clienteRepository.atualizar(id, {
    nome: dados.nome.trim(),
    email: (dados.email || '').trim(),
    telefone: (dados.telefone || '').trim(),
    documento: dados.documento.trim(),
    veiculo_modelo: dados.veiculo_modelo.trim(),
    veiculo_placa: dados.veiculo_placa.trim().toUpperCase(),
  });
}

// Exclui um cliente da base de dados
async function excluir(id) {
  const sucesso = await clienteRepository.excluir(id);
  if (!sucesso) throw new Error('Cliente não encontrado para exclusão.');
  return { mensagem: 'Cliente excluído com sucesso.' };
}

module.exports = {
  listar,
  obterPorId,
  criar,
  atualizar,
  excluir,
};
