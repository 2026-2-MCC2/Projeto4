const express = require('express');
const { autenticar } = require('../middlewares/auth');
const tickets = require('../controllers/tickets.controller');

const router = express.Router();

// qualquer usuário logado (cliente, organizador, fornecedor ou admin) pode abrir/ver os próprios tickets
router.use(autenticar);

router.post('/', tickets.criarTicket);
router.get('/', tickets.listarMeusTickets);
router.get('/:id', tickets.buscarMeuTicket);
router.post('/:id/mensagens', tickets.responderMeuTicket);

module.exports = router;
