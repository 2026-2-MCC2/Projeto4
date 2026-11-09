const pool = require('../config/db');

// Só deixa passar admins com nivel_acesso = 'master' (os outros ficam
// restritos a tickets de suporte e ao painel básico). Usa a coluna
// nivel_acesso que já existe em administradores desde o schema.sql original.
async function exigirMaster(req, res, next) {
  const { rows } = await pool.query(
    'SELECT nivel_acesso FROM administradores WHERE id_usuario = $1',
    [req.usuario.id]
  );
  if (!rows[0] || rows[0].nivel_acesso !== 'master') {
    return res.status(403).json({ erro: 'Essa ação é restrita a administradores de nível master' });
  }
  next();
}

module.exports = { exigirMaster };
