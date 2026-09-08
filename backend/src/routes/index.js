// Agrupador Central de Rotas da API REST
const { Router } = require('express');
const authRoutes = require('./authRoutes');
const clienteRoutes = require('./clienteRoutes');
const recursoRoutes = require('./recursoRoutes');
const agendamentoRoutes = require('./agendamentoRoutes');
const dashboardRoutes = require('./dashboardRoutes');

const router = Router();

// Registro das rotas modulares
router.use('/auth', authRoutes);
router.use('/clientes', clienteRoutes);
router.use('/recursos', recursoRoutes);
router.use('/agendamentos', agendamentoRoutes);
router.use('/dashboard', dashboardRoutes);

// Rota de verificação de integridade (Health Check)
router.get('/health', (req, res) => {
  return res.status(200).json({ status: 'ONLINE', timestamp: new Date() });
});

module.exports = router;
