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
router.post('/revendas/:id/propostas', cliente.criarProposta);

router.get('/propostas/enviadas', cliente.listarPropostasEnviadas);
router.get('/propostas/recebidas', cliente.listarPropostasRecebidas);
router.patch('/propostas/:id', cliente.responderProposta);
router.patch('/propostas/:id/cancelar', cliente.cancelarProposta);

module.exports = router;
