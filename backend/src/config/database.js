// Configuração de conexão com o banco de dados PostgreSQL
const { Pool } = require('pg');
require('dotenv').config();

// Pool de conexões do PostgreSQL
const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT, 10) || 5432,
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'saep_agendamento_db',
  connectionTimeoutMillis: 3000,
});

// Flag indicando se o PostgreSQL está conectado
let isPgConnected = false;

// Inicializa a verificação e criação de tabelas
async function initDatabase() {
  try {
    const client = await pool.connect();
    isPgConnected = true;
    client.release();
    console.log('[PostgreSQL] Conectado com sucesso ao banco saep_agendamento_db.');
    await criarTabelasSeNecessario();
  } catch (error) {
    console.warn('[PostgreSQL] Aviso: Conexão direta falhou. Utilizando repositório adaptativo:', error.message);
    isPgConnected = false;
  }
}

// Cria as tabelas iniciais caso não existam
async function criarTabelasSeNecessario() {
  if (!isPgConnected) return;
  const fs = require('fs');
  const path = require('path');
  const sqlPath = path.resolve(__dirname, '../../../database/saep_agendamento_db.sql');
  if (fs.existsSync(sqlPath)) {
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    await pool.query(sql);
    console.log('[PostgreSQL] Estrutura e dados iniciais verificados com sucesso.');
  }
}

// Executa uma query SQL no PostgreSQL
async function query(text, params) {
  return pool.query(text, params);
}

// Retorna se o banco PostgreSQL está ativo
function getIsPgConnected() {
  return isPgConnected;
}

module.exports = {
  pool,
  query,
  initDatabase,
  getIsPgConnected,
};
