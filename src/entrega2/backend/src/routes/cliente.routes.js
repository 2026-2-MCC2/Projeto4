const express = require('express');
const { autenticar, permitir } = require('../middlewares/auth');
const { exigirCliente } = require('../middlewares/perfis');
const cliente = require('../controllers/cliente.controller');

const router = express.Router();

// todas as rotas abaixo exigem token de CLIENTE aprovado
router.use(autenticar, permitir('cliente'), exigirCliente);

router.post('/compras', cliente.comprarIngresso);
router.get('/ingressos', cliente.listarMeusIngressos);

router.get('/revendas', cliente.listarMinhasRevendas);
router.post('/revendas', cliente.criarRevenda);
router.patch('/revendas/:id/cancelar', cliente.cancelarRevenda);
router.post('/revendas/:id/comprar', cliente.comprarRevenda);

module.exports = router;
