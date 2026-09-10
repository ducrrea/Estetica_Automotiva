const { Router } = require('express');
const agendamentoController = require('../controllers/agendamentoController');
const { autenticarToken } = require('../middlewares/authMiddleware');

const router = Router();

router.use(autenticarToken);
router.get('/', agendamentoController.listar);
router.post('/', agendamentoController.criar);
router.put('/:id', agendamentoController.atualizar);
router.patch('/:id', agendamentoController.atualizar);
router.patch('/:id/status', agendamentoController.alterarStatus);
router.delete('/:id', agendamentoController.excluir);

module.exports = router;