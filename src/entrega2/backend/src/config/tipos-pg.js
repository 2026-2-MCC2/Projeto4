// Ensina o driver "pg" a entregar os tipos do jeito que o frontend espera.
// Sem isto: datas viram objetos Date e números decimais viram texto ("125.50").
const { types } = require('pg');

types.setTypeParser(1082, (valor) => valor);              // DATE    → "2026-12-31"
types.setTypeParser(1700, (valor) => parseFloat(valor));  // NUMERIC → 125.5
types.setTypeParser(20,   (valor) => parseInt(valor, 10)); // COUNT/SUM de inteiros → número
