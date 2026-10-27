const express = require('express');
const { autenticar, permitir } = require('../middlewares/auth');
const relatorios = require('../controllers/relatorios.controller');

const router = express.Router();

// todas as rotas abaixo exigem token de ADMINISTRADOR
router.use(autenticar, permitir('administrador'));

router.get('/resumo', relatorios.resumo);                // RF14
router.get('/eventos', relatorios.listarEventos);
router.get('/eventos/:id', relatorios.buscarEvento);
router.get('/propostas', relatorios.listarPropostas);

module.exports = router;
