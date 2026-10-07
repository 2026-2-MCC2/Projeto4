const express = require('express');
const { cadastrar, login, me } = require('../controllers/auth.controller');
const { autenticar } = require('../middlewares/auth');

const router = express.Router();

router.post('/cadastro', cadastrar); // RF01
router.post('/login', login);        // RF02
router.get('/me', autenticar, me);   // protegida: precisa de token

module.exports = router;