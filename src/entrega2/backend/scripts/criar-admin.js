require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../src/config/db');

async function criarAdmin() {
  const nome = process.env.ADMIN_NOME || 'Administrador';
  const email = (process.env.ADMIN_EMAIL || '').toLowerCase();
  const senha = process.env.ADMIN_SENHA;

  if (!email || !senha) {
    console.error('Defina ADMIN_EMAIL e ADMIN_SENHA no .env');
    process.exit(1);
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const hash = await bcrypt.hash(senha, 10);

    const { rows } = await client.query(
      `INSERT INTO usuarios (nome, email, senha_hash, tipo, status_cadastro)
       VALUES ($1, $2, $3, 'administrador', 'aprovado')
       ON CONFLICT (email) DO NOTHING
       RETURNING id_usuario`,
      [nome, email, hash]
    );

    if (rows.length === 0) {
      await client.query('ROLLBACK');
      console.log('Esse admin já existe. Nada foi alterado.');
      return;
    }

    await client.query(
      "INSERT INTO administradores (id_usuario, nivel_acesso) VALUES ($1, 'master')",
      [rows[0].id_usuario]
    );
    await client.query('COMMIT');
    console.log(`✅ Admin criado: ${email}`);
  } catch (erro) {
    await client.query('ROLLBACK');
    console.error('Erro:', erro.message);
  } finally {
    client.release();
    await pool.end(); // fecha a conexão para o script terminar
  }
}

criarAdmin();