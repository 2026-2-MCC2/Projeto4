const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
require('./config/tipos-pg');   // datas e números saem no formato certo no JSON

const app = express();          // cria a aplicação

// Só libera o(s) domínio(s) do nosso próprio front-end (configurável por
// variável de ambiente), não qualquer site. Sempre libera localhost nas
// portas comuns de dev (Vite) pra não travar o desenvolvimento local.
const origensPermitidas = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:4173',
].filter(Boolean);

app.use(cors({
  origin(origem, callback) {
    if (!origem || origensPermitidas.includes(origem)) return callback(null, true);
    callback(new Error('Origem não permitida pelo CORS'));
  },
}));
app.use(express.json());        // permite ler JSON enviado pelo frontend

// rota de teste
app.get('/', (req, res) => {
  res.json({ mensagem: 'API InterLink funcionando!' });
});

// testa se a API e o banco estão funcionando
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ api: 'ok', banco: 'ok' });
  } catch (erro) {
    console.error(erro.message);
    res.status(500).json({ api: 'ok', banco: 'erro' });
  }
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/eventos', require('./routes/eventos.routes'));         // Organizador
app.use('/api/fornecedor', require('./routes/fornecedor.routes'));   // Fornecedor
app.use('/api/relatorios', require('./routes/relatorios.routes'));   // Administrador (RF14)
app.use('/api/tickets', require('./routes/tickets.routes'));         // Suporte (qualquer usuário logado)

// ATENÇÃO: estas duas ficam SEMPRE por último, depois de todas as rotas
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

app.use((erro, req, res, next) => {
  if (erro.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido no corpo da requisição' });
  }
  console.error(erro);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

module.exports = app;