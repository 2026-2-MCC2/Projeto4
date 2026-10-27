const express = require('express');
const { autenticar, permitir } = require('../middlewares/auth');
const { exigirFornecedor } = require('../middlewares/perfis');
const fornecedor = require('../controllers/fornecedor.controller');

const router = express.Router();

// todas as rotas abaixo exigem token de FORNECEDOR aprovado
router.use(autenticar, permitir('fornecedor'), exigirFornecedor);

router.get('/eventos', fornecedor.listarEventos);                  // RF09
router.get('/eventos/:id', fornecedor.buscarEvento);               // RF09

router.post('/propostas', fornecedor.enviarProposta);              // RF10
router.get('/propostas', fornecedor.listarMinhasPropostas);
router.put('/propostas/:id', fornecedor.editarProposta);
router.patch('/propostas/:id/cancelar', fornecedor.cancelarProposta);

module.exports = router;
