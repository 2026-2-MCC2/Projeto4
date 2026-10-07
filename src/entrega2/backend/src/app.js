const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const app = express();          // cria a aplicação

app.use(cors());                // libera o frontend a chamar a API
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

module.exports = app;