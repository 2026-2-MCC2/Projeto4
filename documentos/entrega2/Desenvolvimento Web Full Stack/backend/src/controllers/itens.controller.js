const pool = require('../config/db');
const { idValido, texto, vazio } = require('../utils/validar');

const CATEGORIAS = ['iluminacao', 'alimentacao', 'bebida', 'seguranca', 'estrutura', 'outros'];
const CAMPOS_ITEM = 'id_item, id_evento, nome, categoria, descricao';

function validarItem(corpo) {
  const nome = texto(corpo.nome, 100);
  const temDescricao = !vazio(corpo.descricao);
  const descricao = temDescricao ? texto(corpo.descricao, 2000) : null;

  if (!nome) return { erro: 'Informe o nome do item (até 100 caracteres)' };
  if (!CATEGORIAS.includes(corpo.categoria)) {
    return { erro: `A categoria deve ser uma destas: ${CATEGORIAS.join(', ')}` };
  }
  if (temDescricao && !descricao) return { erro: 'A descrição deve ter no máximo 2000 caracteres' };
  return { dados: { nome, categoria: corpo.categoria, descricao } };
}

// Os itens só mudam antes de o evento ser publicado (os fornecedores já estariam cotando)
function eventoEditavel(req, res) {
  if (req.evento.status !== 'rascunho') {
    res.status(409).json({
      erro: 'Os itens só podem ser alterados enquanto o evento está em rascunho',
    });
    return false;
  }
  return true;
}

// RF06 – Listar itens do evento
async function listarItens(req, res) {
  const { rows } = await pool.query(
    `SELECT ${CAMPOS_ITEM} FROM itens_custo WHERE id_evento = $1 ORDER BY id_item`,
    [req.evento.id_evento]
  );
  res.json(rows);
}

// RF06 – Criar item
async function criarItem(req, res) {
  if (!eventoEditavel(req, res)) return;
  const { erro, dados } = validarItem(req.body);
  if (erro) return res.status(400).json({ erro });

  const { rows } = await pool.query(
    `INSERT INTO itens_custo (id_evento, nome, categoria, descricao)
     VALUES ($1, $2, $3, $4) RETURNING ${CAMPOS_ITEM}`,
    [req.evento.id_evento, dados.nome, dados.categoria, dados.descricao]
  );
  res.status(201).json(rows[0]);
}

// RF06 – Atualizar item
async function atualizarItem(req, res) {
  const idItem = idValido(req.params.idItem);
  if (!idItem) return res.status(400).json({ erro: 'ID de item inválido' });
  if (!eventoEditavel(req, res)) return;
  const { erro, dados } = validarItem(req.body);
  if (erro) return res.status(400).json({ erro });

  const { rows } = await pool.query(
    `UPDATE itens_custo SET nome = $1, categoria = $2, descricao = $3
      WHERE id_item = $4 AND id_evento = $5
      RETURNING ${CAMPOS_ITEM}`,
    [dados.nome, dados.categoria, dados.descricao, idItem, req.evento.id_evento]
  );
  if (!rows[0]) return res.status(404).json({ erro: 'Item não encontrado neste evento' });
  res.json(rows[0]);
}

// RF06 – Excluir item
async function excluirItem(req, res) {
  const idItem = idValido(req.params.idItem);
  if (!idItem) return res.status(400).json({ erro: 'ID de item inválido' });
  if (!eventoEditavel(req, res)) return;

  const { rowCount } = await pool.query(
    'DELETE FROM itens_custo WHERE id_item = $1 AND id_evento = $2',
    [idItem, req.evento.id_evento]
  );
  if (rowCount === 0) return res.status(404).json({ erro: 'Item não encontrado neste evento' });
  res.status(204).send();
}

module.exports = { listarItens, criarItem, atualizarItem, excluirItem };
