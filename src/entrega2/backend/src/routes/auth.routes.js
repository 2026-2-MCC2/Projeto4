const express = require('express');
const rateLimit = require('express-rate-limit');
const { cadastrar, login, me } = require('../controllers/auth.controller');
const { autenticar } = require('../middlewares/auth');

const router = express.Router();

// Limita tentativas por IP pra dificultar força bruta de senha/spam de cadastro.
const limiteLogin = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'Muitas tentativas de login. Tente novamente em alguns minutos.' },
});
const limiteCadastro = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'Muitas tentativas de cadastro. Tente novamente mais tarde.' },
});

router.post('/cadastro', limiteCadastro, cadastrar); // RF01
router.post('/login', limiteLogin, login);           // RF02
router.get('/me', autenticar, me);                   // protegida: precisa de token

module.exports = router;