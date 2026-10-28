const express = require('express');
const { listarCadastros, decidirCadastro } = require('../controllers/admin.controller');
const { listarLogs } = require('../controllers/logs.controller');
const { listarPapeis, atualizarNivelAdmin } = require('../controllers/papeis.controller');
const { obterMonitoramento } = require('../controllers/monitoramento.controller');
const tickets = require('../controllers/tickets.controller');
const { autenticar, permitir } = require('../middlewares/auth');
const { exigirMaster } = require('../middlewares/nivelAcesso');

const router = express.Router();

// todas as rotas abaixo exigem token de ADMINISTRADOR
router.use(autenticar, permitir('administrador'));

router.get('/cadastros', listarCadastros);                       // RF03
router.patch('/cadastros/:id', exigirMaster, decidirCadastro);   // RF04 (restrito a nível master)

router.get('/logs', listarLogs);

router.get('/papeis', listarPapeis);
router.patch('/administradores/:id/nivel', exigirMaster, atualizarNivelAdmin);

router.get('/monitoramento', obterMonitoramento);

router.get('/tickets', tickets.listarTodosTickets);
router.get('/tickets/:id', tickets.buscarTicketAdmin);
router.post('/tickets/:id/mensagens', tickets.responderComoAdmin);
router.patch('/tickets/:id/status', tickets.atualizarStatusTicket);

module.exports = router;