// Rotas de Gestão de Clientes
const { Router } = require('express');
const clienteController = require('../controllers/clienteController');
const { autenticarToken } = require('../middlewares/authMiddleware');

const router = Router();

// Aplica autenticação em todas as rotas de clientes
router.use(autenticarToken);

router.get('/', clienteController.listar);
router.get('/:id', clienteController.obterPorId);
router.post('/', clienteController.criar);
router.put('/:id', clienteController.atualizar);
router.delete('/:id', clienteController.excluir);

module.exports = router;
