// Rotas de Métricas do Dashboard
const { Router } = require('express');
const dashboardController = require('../controllers/dashboardController');
const { autenticarToken } = require('../middlewares/authMiddleware');

const router = Router();

// Aplica autenticação nas rotas de estatísticas
router.use(autenticarToken);

router.get('/stats', dashboardController.obterEstatisticas);

module.exports = router;
