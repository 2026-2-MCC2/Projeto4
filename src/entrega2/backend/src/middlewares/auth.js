const jwt = require('jsonwebtoken');

// Confere se veio um token válido
function autenticar(req, res, next) {
  const header = req.headers.authorization || '';   // "Bearer eyJ..."
  const [tipo, token] = header.split(' ');

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ erro: 'Token não enviado' });
  }

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET); // { id, tipo, iat, exp }
    next(); // libera para a próxima etapa
  } catch {
    return res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
}

// Confere se o tipo do usuário está entre os permitidos
function permitir(...tiposPermitidos) {
  return (req, res, next) => {
    if (!tiposPermitidos.includes(req.usuario.tipo)) {
      return res.status(403).json({ erro: 'Acesso negado' });
    }
    next();
  };
}

module.exports = { autenticar, permitir };