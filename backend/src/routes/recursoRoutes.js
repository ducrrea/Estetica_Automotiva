// Rotas de Consulta aos Recursos / Boxes de Estética
const { Router } = require('express');
const recursoController = require('../controllers/recursoController');
const { autenticarToken } = require('../middlewares/authMiddleware');

const router = Router();

// Aplica autenticação nas rotas de recursos
router.use(autenticarToken);

router.get('/', recursoController.listar);
router.get('/:id', recursoController.obterPorId);

module.exports = router;
