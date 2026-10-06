const pool = require('./config/db');

// ...código que já existe...

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