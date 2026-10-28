const pool = require('../config/db');
const { idValido } = require('../utils/validar');

// RF (admin) – Papéis: quantos usuários existem de cada tipo (dado real,
// não um catálogo de "módulos" inventado) + os administradores e o nível
// de acesso de cada um (coluna nivel_acesso, já existe desde o schema.sql).
async function listarPapeis(req, res) {
  const { rows: porTipo } = await pool.query(
    `SELECT tipo, status_cadastro, COUNT(*) AS total
       FROM usuarios GROUP BY tipo, status_cadastro ORDER BY tipo, status_cadastro`
  );

  const { rows: administradores } = await pool.query(
    `SELECT u.id_usuario, u.nome, u.email, a.nivel_acesso, u.criado_em
       FROM administradores a
       JOIN usuarios u ON u.id_usuario = a.id_usuario
      ORDER BY u.nome`
  );

  res.json({ usuarios_por_tipo: porTipo, administradores });
}

// Só um admin 'master' pode promover/rebaixar outro admin.
async function atualizarNivelAdmin(req, res) {
  const idUsuario = idValido(req.params.id);
  if (!idUsuario) return res.status(400).json({ erro: 'ID inválido' });

  const { nivel_acesso: nivel } = req.body;
  if (!['master', 'suporte'].includes(nivel)) {
    return res.status(400).json({ erro: "nivel_acesso deve ser 'master' ou 'suporte'" });
  }

  const { rows } = await pool.query(
    `UPDATE administradores SET nivel_acesso = $1
      WHERE id_usuario = $2
      RETURNING id_usuario, nivel_acesso`,
    [nivel, idUsuario]
  );
  if (!rows[0]) return res.status(404).json({ erro: 'Administrador não encontrado' });
  res.json(rows[0]);
}

module.exports = { listarPapeis, atualizarNivelAdmin };
