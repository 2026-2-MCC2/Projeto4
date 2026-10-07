const express = require('express');
const { cadastrar } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/cadastro', cadastrar); // RF01

module.exports = router;