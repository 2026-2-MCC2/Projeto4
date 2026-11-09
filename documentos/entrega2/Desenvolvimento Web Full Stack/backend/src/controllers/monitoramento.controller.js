const pool = require('../config/db');

// RF (admin) – Monitoramento: só números reais e mensuráveis (uptime do
// processo, memória, latência do banco, contagens). Nada de "uptime 99.9%"
// nem serviços inventados (escrow/blockchain não existem neste sistema).
async function obterMonitoramento(req, res) {
  const inicio = Date.now();
  let bancoOk = true;
  try {
    await pool.query('SELECT 1');
  } catch {
    bancoOk = false;
  }
  const latenciaBanco = Date.now() - inicio;

  const memoria = process.memoryUsage();

  const [{ rows: usuarios }, { rows: eventos }, { rows: propostas }, { rows: ticketsAbertos }] =
    await Promise.all([
      pool.query('SELECT COUNT(*) AS total FROM usuarios'),
      pool.query('SELECT COUNT(*) AS total FROM eventos'),
      pool.query('SELECT COUNT(*) AS total FROM propostas'),
      pool.query("SELECT COUNT(*) AS total FROM tickets_suporte WHERE status IN ('aberto','em_andamento')"),
    ]);

  res.json({
    tempo_atividade_segundos: Math.round(process.uptime()),
    memoria_mb: {
      usada: Math.round(memoria.heapUsed / 1024 / 1024),
      total: Math.round(memoria.heapTotal / 1024 / 1024),
    },
    banco: { ok: bancoOk, latencia_ms: latenciaBanco },
    totais: {
      usuarios: Number(usuarios[0].total),
      eventos: Number(eventos[0].total),
      propostas: Number(propostas[0].total),
      tickets_abertos: Number(ticketsAbertos[0].total),
    },
  });
}

module.exports = { obterMonitoramento };
