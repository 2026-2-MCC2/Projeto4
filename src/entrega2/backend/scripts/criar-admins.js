// Cria várias contas de administrador de uma vez, lendo nome/e-mail/senha de
// um arquivo LOCAL que nunca é commitado (admins-credenciais.local.json, já
// está no .gitignore da raiz). Rodar: node scripts/criar-admins.js
//
// Para adicionar/trocar admins, edite esse .json (copie o formato abaixo) e
// rode o script de novo — quem já existe (mesmo e-mail) é só ignorado.
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const pool = require('../src/config/db');

const ARQUIVO_CREDENCIAIS = path.join(__dirname, 'admins-credenciais.local.json');

async function criarAdmins() {
  if (!fs.existsSync(ARQUIVO_CREDENCIAIS)) {
    console.error(
      `Não encontrei ${ARQUIVO_CREDENCIAIS}.\n` +
      'Crie esse arquivo com uma lista [{ "nome": "...", "email": "...", "senha": "..." }, ...].'
    );
    process.exit(1);
  }
  const admins = JSON.parse(fs.readFileSync(ARQUIVO_CREDENCIAIS, 'utf8'));

  for (const admin of admins) {
    const nome = admin.nome;
    const email = String(admin.email || '').toLowerCase();
    const senha = admin.senha;

    if (!nome || !email || !senha) {
      console.log(`⚠️  Pulando entrada inválida (faltou nome/email/senha): ${JSON.stringify(admin)}`);
      continue;
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
        console.log(`– ${email} já existe, nada foi alterado.`);
        continue;
      }

      await client.query(
        "INSERT INTO administradores (id_usuario, nivel_acesso) VALUES ($1, 'master')",
        [rows[0].id_usuario]
      );
      await client.query('COMMIT');
      console.log(`✅ Admin criado: ${nome} <${email}>`);
    } catch (erro) {
      await client.query('ROLLBACK');
      console.error(`Erro ao criar ${email}:`, erro.message);
    } finally {
      client.release();
    }
  }

  await pool.end();
}

criarAdmins();
