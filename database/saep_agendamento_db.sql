-- ==========================================================
-- SCRIPT DE CRIAÇÃO E POPULAÇÃO DO BANCO DE DADOS
-- Projeto: Sistema de Agendamento - Centro de Estética Automotiva
-- Banco de Dados: saep_agendamento_db
-- SGBD: PostgreSQL 18+
-- ==========================================================

-- Criação do banco de dados (executar se necessário)
-- CREATE DATABASE saep_agendamento_db;

-- 1. Tabela de Usuários do Sistema (Administradores / Operadores)
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    perfil VARCHAR(30) DEFAULT 'ADMINISTRADOR',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Clientes da Estética Automotiva
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    documento VARCHAR(20) NOT NULL UNIQUE,
    veiculo_modelo VARCHAR(80) NOT NULL,
    veiculo_placa VARCHAR(10) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de Recursos (Boxes de Lavagem / Polimento / Detalhamento)
CREATE TABLE IF NOT EXISTS recursos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    tipo VARCHAR(50) NOT NULL,
    descricao TEXT,
    tempo_estimado_min INT DEFAULT 60,
    status VARCHAR(20) DEFAULT 'ATIVO',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela de Agendamentos de Serviços
CREATE TABLE IF NOT EXISTS agendamentos (
    id SERIAL PRIMARY KEY,
    cliente_id INT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    recurso_id INT NOT NULL REFERENCES recursos(id) ON DELETE RESTRICT,
    data_agendamento DATE NOT NULL,
    hora_agendamento TIME NOT NULL,
    servico VARCHAR(100) NOT NULL,
    valor NUMERIC(10, 2) DEFAULT 0.00,
    status VARCHAR(30) DEFAULT 'AGENDADO',
    observacoes TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Restrição de integridade para evitar duplo agendamento no mesmo Box/Data/Hora
    CONSTRAINT uq_recurso_data_hora UNIQUE (recurso_id, data_agendamento, hora_agendamento)
);

-- Índices para otimização de consultas e validações de conflito
CREATE INDEX IF NOT EXISTS idx_agendamentos_busca ON agendamentos (recurso_id, data_agendamento, hora_agendamento);
CREATE INDEX IF NOT EXISTS idx_clientes_documento ON clientes (documento);
CREATE INDEX IF NOT EXISTS idx_clientes_nome ON clientes (nome);

-- ==========================================================
-- CARGA INICIAL DE DADOS (SEEDS)
-- ==========================================================

-- Inserção de Usuário Administrador Padrão (Senha padrão: admin123)
INSERT INTO usuarios (nome, email, senha, perfil)
VALUES 
    ('Administrador Master', 'admin@estetica.com', '$2a$10$thUOISFYAUI70cXdQEp.e.nkm.ELucYvCpvhIIEdF/2NAf9QBFrz2', 'ADMINISTRADOR')
ON CONFLICT (email) DO UPDATE SET senha = EXCLUDED.senha;

-- Inserção dos 5 Recursos Obrigatórios (Boxes Especializados)
INSERT INTO recursos (nome, tipo, descricao, tempo_estimado_min, status)
VALUES 
    ('Box 01 - Lavagem Detalhada & Snow Foam', 'Lavagem', 'Especializado em pré-lavagem com shampoo neutro, snow foam e secagem com ar filtrado.', 60, 'ATIVO'),
    ('Box 02 - Polimento Técnico & Correção', 'Polimento', 'Cabine com iluminação LED de alta definição para correção de verniz e remoção de micro-riscos.', 120, 'ATIVO'),
    ('Box 03 - Vitrificação Cerâmica & Nano', 'Proteção', 'Ambiente com temperatura e umidade controladas para cura de vitrificadores e selantes.', 180, 'ATIVO'),
    ('Box 04 - Higienização Interna & Oxi', 'Interior', 'Estação para limpeza a vapor dos bancos, higienização de couro e oxi-sanitização com gerador de ozônio.', 90, 'ATIVO'),
    ('Box 05 - Estufa de Secagem & Aplicação PPF', 'Película & PPF', 'Box estéril e livre de poeira para recorte e aplicação de Paint Protection Film (PPF).', 240, 'ATIVO')
ON CONFLICT (nome) DO NOTHING;

-- Inserção de Clientes Iniciais para Demonstração
INSERT INTO clientes (nome, email, telefone, documento, veiculo_modelo, veiculo_placa)
VALUES 
    ('Carlos Eduardo Silva', 'carlos.silva@email.com', '(11) 98765-4321', '123.456.789-00', 'BMW M3 Competition', 'BRA2E19'),
    ('Mariana Albuquerque', 'mariana.albuquerque@email.com', '(11) 97654-3210', '234.567.890-11', 'Porsche 911 Carrera', 'EST8X88'),
    ('Roberto Mendes', 'roberto.mendes@email.com', '(11) 96543-2109', '345.678.901-22', 'Audi RS6 Avant', 'CAR9A01'),
    ('Fernanda Lima Castro', 'fernanda.lima@email.com', '(11) 95432-1098', '456.789.012-33', 'Mercedes-AMG C63', 'AMG4G63'),
    ('Lucas Nogueira', 'lucas.nogueira@email.com', '(11) 94321-0987', '567.890.123-44', 'Toyota Corolla GR', 'GRT7K12')
ON CONFLICT (documento) DO NOTHING;

-- Inserção de Agendamentos Iniciais
INSERT INTO agendamentos (cliente_id, recurso_id, data_agendamento, hora_agendamento, servico, valor, status, observacoes)
VALUES 
    (1, 1, CURRENT_DATE, '09:00:00', 'Lavagem Detalhada Premium', 180.00, 'AGENDADO', 'Cliente solicitou atenção especial nas caixas de roda'),
    (2, 2, CURRENT_DATE, '10:30:00', 'Polimento Técnico em 2 Etapas', 850.00, 'AGENDADO', 'Correção de swirls leves no capô'),
    (3, 3, CURRENT_DATE, '14:00:00', 'Vitrificação Cerâmica 9H (3 anos)', 1600.00, 'AGENDADO', 'Veículo 0km recém-retirado da concessionária'),
    (4, 4, CURRENT_DATE + INTERVAL '1 day', '08:30:00', 'Higienização Interna Completa + Ozônio', 350.00, 'AGENDADO', 'Higienização de bancos de couro claro')
ON CONFLICT DO NOTHING;

TRUNCATE TABLE agendamentos CASCADE;
