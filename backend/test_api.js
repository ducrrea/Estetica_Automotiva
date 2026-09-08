// Script de Teste Automatizado da API REST e Validação de Conflito de Double-Booking
const http = require('http');

function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('--- INICIANDO TESTES AUTOMATIZADOS ---');

  // 1. Teste de Login Inválido
  const loginErr = await request(
    { hostname: 'localhost', port: 3000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { email: 'admin@estetica.com', senha: 'senha_incorreta' }
  );
  console.log('CT01 - Login Incorreto:', loginErr.status === 400 ? 'PASSOU (Erro esperado recebido)' : 'FALHOU', loginErr.body);

  // 2. Teste de Login Válido
  const loginOk = await request(
    { hostname: 'localhost', port: 3000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { email: 'admin@estetica.com', senha: 'admin123' }
  );
  console.log('CT02 - Login Válido:', loginOk.status === 200 ? 'PASSOU' : 'FALHOU');
  const token = loginOk.body.token;
  const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  // 3. Teste de Listagem de Recursos (Boxes)
  const recursos = await request({ hostname: 'localhost', port: 3000, path: '/api/recursos', method: 'GET', headers: authHeaders });
  console.log('CT06 - Recursos Cadastrados:', recursos.body.dados?.length >= 5 ? `PASSOU (${recursos.body.dados.length} boxes encontrados)` : 'FALHOU');

  // 4. Teste de Listagem e Criação de Clientes
  const clientes = await request({ hostname: 'localhost', port: 3000, path: '/api/clientes', method: 'GET', headers: authHeaders });
  console.log('CT04/05 - Clientes Listados:', clientes.body.dados?.length > 0 ? `PASSOU (${clientes.body.dados.length} clientes)` : 'FALHOU');

  // 5. Teste de Agendamento Normal
  const dataTeste = '2026-11-20';
  const horaTeste = '16:00';
  const recursoId = recursos.body.dados[0].id;
  const clienteId = clientes.body.dados[0].id;

  const agendamento1 = await request(
    { hostname: 'localhost', port: 3000, path: '/api/agendamentos', method: 'POST', headers: authHeaders },
    { cliente_id: clienteId, recurso_id: recursoId, data_agendamento: dataTeste, hora_agendamento: horaTeste, servico: 'Lavagem Snow Foam', valor: 220 }
  );
  console.log('CT07 - Agendamento Válido:', agendamento1.status === 201 ? 'PASSOU' : 'FALHOU', agendamento1.body.mensagem);

  // 6. Teste de Validação de Conflito de Horário (Double-Booking no mesmo Box)
  const agendamento2 = await request(
    { hostname: 'localhost', port: 3000, path: '/api/agendamentos', method: 'POST', headers: authHeaders },
    { cliente_id: clienteId, recurso_id: recursoId, data_agendamento: dataTeste, hora_agendamento: horaTeste, servico: 'Polimento Técnico', valor: 500 }
  );
  console.log('CT08 - Bloqueio de Conflito (Double-Booking):', agendamento2.status === 409 ? `PASSOU (Status 409 Conflito retornado: "${agendamento2.body.erro}")` : 'FALHOU');

  console.log('--- TODOS OS TESTES DE BACKEND FORAM CONCLUÍDOS ---');
}

runTests().catch(console.error);
