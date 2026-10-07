const express = require('express');
const { listarCadastros, decidirCadastro } = require('../controllers/admin.controller');
const { autenticar, permitir } = require('../middlewares/auth');

const router = express.Router();

// todas as rotas abaixo exigem token de ADMINISTRADOR
router.use(autenticar, permitir('administrador'));

router.get('/cadastros', listarCadastros);          // RF03
router.patch('/cadastros/:id', decidirCadastro);    // RF04

module.exports = router;