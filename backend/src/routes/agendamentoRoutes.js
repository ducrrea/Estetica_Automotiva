// Rotas de Gestão de Agendamentos
const { Router } = require('express');
const agendamentoController = require('../controllers/agendamentoController');
const { autenticarToken } = require('../middlewares/authMiddleware');

const router = Router();

// Aplica autenticação nas rotas de agendamentos
router.use(autenticarToken);

router.get('/', agendamentoController.listar);
router.post('/', agendamentoController.criar);
router.patch('/:id/status', agendamentoController.alterarStatus);
router.delete('/:id', agendamentoController.excluir);

module.exports = router;
