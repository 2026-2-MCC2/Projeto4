const express = require('express');
const { cadastrar, login } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/cadastro', cadastrar); // RF01
router.post('/login', login);        // RF02

module.exports = router;