// Rotas de Autenticação
const { Router } = require('express');
const authController = require('../controllers/authController');
const { autenticarToken } = require('../middlewares/authMiddleware');

const router = Router();

// Rota de login
router.post('/login', authController.login);

// Rota para verificar usuário autenticado
router.get('/me', autenticarToken, authController.obterPerfil);

module.exports = router;
