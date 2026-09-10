const { Router } = require('express');
const agendamentoRoutes = require('./agendamentoRoutes');
const authRoutes = require('./authRoutes');
const clienteRoutes = require('./clienteRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const recursoRoutes = require('./recursoRoutes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/clientes', clienteRoutes);
router.use('/recursos', recursoRoutes);
router.use('/agendamentos', agendamentoRoutes);
router.use('/dashboard', dashboardRoutes);

router.get('/health', (req, res) => {
	return res.status(200).json({ status: 'ONLINE', timestamp: new Date() });
});

module.exports = router;