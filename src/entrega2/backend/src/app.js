const express = require('express');
const cors = require('cors');

const app = express();          // cria a aplicação

app.use(cors());                // libera o frontend a chamar a API
app.use(express.json());        // permite ler JSON enviado pelo frontend

// rota de teste
app.get('/', (req, res) => {
  res.json({ mensagem: 'API InterLink funcionando!' });
});

module.exports = app;