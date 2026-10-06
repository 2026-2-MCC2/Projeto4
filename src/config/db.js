const { Pool } = require('pg');

// Pool = um conjunto de conexões reaproveitáveis com o banco
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // o Supabase exige conexão segura (SSL)
});

module.exports = pool;