const express = require('express');
const { autenticar, permitir } = require('../middlewares/auth');
const { exigirOrganizador } = require('../middlewares/perfis');
const { carregarEvento } = require('../middlewares/evento');
const eventos = require('../controllers/eventos.controller');
const itens = require('../controllers/itens.controller');
const custos = require('../controllers/custos.controller');
const cotacoes = require('../controllers/cotacoes.controller');
const orcamento = require('../controllers/orcamento.controller');

const router = express.Router();

// todas as rotas abaixo exigem token de ORGANIZADOR aprovado
router.use(autenticar, permitir('organizador'), exigirOrganizador);

// RF05 – eventos
router.post('/', eventos.criarEvento);
router.get('/', eventos.listarEventos);

// visão geral de propostas de TODOS os eventos do organizador (sem precisar entrar em cada um)
// precisa vir antes de "/:id" pra não ser confundida com um id de evento
router.get('/propostas', eventos.listarPropostasOrganizador);

// daqui para baixo toda rota tem /:id → confere se o evento é do organizador logado
router.use('/:id', carregarEvento);

router.get('/:id', eventos.buscarEvento);
router.put('/:id', eventos.atualizarEvento);
router.delete('/:id', eventos.excluirEvento);
router.patch('/:id/status', eventos.alterarStatus);          // RF08

router.get('/:id/itens', itens.listarItens);                 // RF06
router.post('/:id/itens', itens.criarItem);
router.put('/:id/itens/:idItem', itens.atualizarItem);
router.delete('/:id/itens/:idItem', itens.excluirItem);

router.get('/:id/custos', custos.listarCustos);              // RF07
router.post('/:id/custos', custos.criarCusto);
router.put('/:id/custos/:idCusto', custos.atualizarCusto);
router.delete('/:id/custos/:idCusto', custos.excluirCusto);

router.get('/:id/propostas', cotacoes.listarPropostas);                                  // RF11
router.patch('/:id/propostas/:idProposta/selecionar', cotacoes.selecionarProposta);      // RF12
router.patch('/:id/propostas/:idProposta/desselecionar', cotacoes.desselecionarProposta);

router.get('/:id/orcamento', orcamento.obterOrcamento);      // RF12
router.get('/:id/ticket', orcamento.obterTicket);            // RF13

module.exports = router;
