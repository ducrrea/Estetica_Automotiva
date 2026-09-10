const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDatabase } = require('./config/database');
const routes = require('./routes');
const { tratarErros } = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração de Middlewares Globais
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API de Estética Automotiva está funcionando online!');
});

// Injeção de Rotas Principais
app.use('/api', routes);

// Middleware Central de Tratamento de Erros
app.use(tratarErros);

// Inicialização do Servidor e Banco de Dados
async function iniciarServidor() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`[Servidor] API de Estética Automotiva rodando na porta ${PORT}`);
  });
}

iniciarServidor();

module.exports = app;