const pool = require('../config/db');
const { idValido, numero, texto } = require('../utils/validar');

const TIPOS = ['fiscal', 'operacional', 'variavel', 'outro'];
const CAMPOS_CUSTO = 'id_custo, id_evento, tipo, descricao, valor, por_participante';

function validarCusto(corpo) {
  const descricao = texto(corpo.descricao, 150);
  const valor = numero(corpo.valor);
  const porParticipante = corpo.por_participante === undefined ? false : corpo.por_participante;

  if (!TIPOS.includes(corpo.tipo)) return { erro: `O tipo deve ser um destes: ${TIPOS.join(', ')}` };
  if (!descricao) return { erro: 'Informe a descrição do custo (até 150 caracteres)' };
  if (valor === null || valor < 0 || valor > 9999999999.99) {
    return { erro: 'O valor deve ser um número maior ou igual a zero' };
  }
  if (typeof porParticipante !== 'boolean') {
    return { erro: 'por_participante deve ser true ou false' };
  }
  return { dados: { tipo: corpo.tipo, descricao, valor, por_participante: porParticipante } };
}

// Custos podem ser ajustados até o evento ser cancelado
function eventoEditavel(req, res) {
  if (req.evento.status === 'cancelado') {
    res.status(409).json({ erro: 'Evento cancelado não pode ser alterado' });
    return false;
  }
  return true;
}

// RF07 – Listar custos do evento
async function listarCustos(req, res) {
  const { rows } = await pool.query(
    `SELECT ${CAMPOS_CUSTO} FROM custos_evento WHERE id_evento = $1 ORDER BY id_custo`,
    [req.evento.id_evento]
  );
  res.json(rows);
}

// RF07 – Criar custo
async function criarCusto(req, res) {
  if (!eventoEditavel(req, res)) return;
  const { erro, dados } = validarCusto(req.body);
  if (erro) return res.status(400).json({ erro });

  const { rows } = await pool.query(
    `INSERT INTO custos_evento (id_evento, tipo, descricao, valor, por_participante)
     VALUES ($1, $2, $3, $4, $5) RETURNING ${CAMPOS_CUSTO}`,
    [req.evento.id_evento, dados.tipo, dados.descricao, dados.valor, dados.por_participante]
  );
  res.status(201).json(rows[0]);
}

// RF07 – Atualizar custo
async function atualizarCusto(req, res) {
  const idCusto = idValido(req.params.idCusto);
  if (!idCusto) return res.status(400).json({ erro: 'ID de custo inválido' });
  if (!eventoEditavel(req, res)) return;
  const { erro, dados } = validarCusto(req.body);
  if (erro) return res.status(400).json({ erro });

  const { rows } = await pool.query(
    `UPDATE custos_evento SET tipo = $1, descricao = $2, valor = $3, por_participante = $4
      WHERE id_custo = $5 AND id_evento = $6
      RETURNING ${CAMPOS_CUSTO}`,
    [dados.tipo, dados.descricao, dados.valor, dados.por_participante, idCusto, req.evento.id_evento]
  );
  if (!rows[0]) return res.status(404).json({ erro: 'Custo não encontrado neste evento' });
  res.json(rows[0]);
}

// RF07 – Excluir custo
async function excluirCusto(req, res) {
  const idCusto = idValido(req.params.idCusto);
  if (!idCusto) return res.status(400).json({ erro: 'ID de custo inválido' });
  if (!eventoEditavel(req, res)) return;

  const { rowCount } = await pool.query(
    'DELETE FROM custos_evento WHERE id_custo = $1 AND id_evento = $2',
    [idCusto, req.evento.id_evento]
  );
  if (rowCount === 0) return res.status(404).json({ erro: 'Custo não encontrado neste evento' });
  res.status(204).send();
}

module.exports = { listarCustos, criarCusto, atualizarCusto, excluirCusto };
