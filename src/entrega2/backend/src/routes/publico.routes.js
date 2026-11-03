const express = require('express');
const publico = require('../controllers/publico.controller');

const router = express.Router();

// rotas sem autenticação — vitrine pública (landing page e /eventos do site)
router.get('/eventos', publico.listarEventos);
router.get('/eventos/:id', publico.buscarEvento);
router.get('/revendas', publico.listarRevendas);
router.get('/revendas/:id', publico.buscarRevenda);

module.exports = router;
