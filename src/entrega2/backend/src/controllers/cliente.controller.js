const pool = require('../config/db');
const { emTransacao } = require('../config/transacao');
const { idValido, inteiro } = require('../utils/validar');
const { registrarLog } = require('../utils/registrar-log');

// RF — compra de ingresso (um lote de N ingressos do mesmo evento, de uma vez)
async function comprarIngresso(req, res) {
  const idEvento = idValido(req.body.id_evento);
  const quantidade = inteiro(req.body.quantidade);
  if (!idEvento) return res.status(400).json({ erro: 'ID de evento inválido' });
  if (!quantidade || quantidade <= 0) {
    return res.status(400).json({ erro: 'Informe uma quantidade de ingressos maior que zero' });
  }

  try {
    const compra = await emTransacao(async (client) => {
      // trava a linha do evento pra não vender mais ingressos do que existe
      // quando duas compras chegam ao mesmo tempo
      const { rows } = await client.query(
        `SELECT id_evento, preco_ingresso, ingressos_total, ingressos_vendidos
           FROM eventos
          WHERE id_evento = $1 AND publicado_para_venda = true
          FOR UPDATE`,
        [idEvento]
      );
      const evento = rows[0];
      if (!evento) {
        const erro = new Error('Evento não encontrado ou indisponível para venda');
        erro.status = 404;
        throw erro;
      }
      const disponiveis = evento.ingressos_total - evento.ingressos_vendidos;
      if (quantidade > disponiveis) {
        const erro = new Error(`Só restam ${disponiveis} ingresso(s) para este evento`);
        erro.status = 409;
        throw erro;
      }

      const valorTotal = Math.round(evento.preco_ingresso * quantidade * 100) / 100;
      const { rows: compraRows } = await client.query(
        `INSERT INTO compras (id_cliente, id_evento, quantidade, valor_unitario, valor_total)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id_compra, id_evento, quantidade, valor_unitario, valor_total, status, criado_em`,
        [req.idCliente, idEvento, quantidade, evento.preco_ingresso, valorTotal]
      );
      await client.query(
        `UPDATE eventos SET ingressos_vendidos = ingressos_vendidos + $1 WHERE id_evento = $2`,
        [quantidade, idEvento]
      );
      return compraRows[0];
    });

    await registrarLog(req.usuario.id, 'ingresso_comprado', `compra #${compra.id_compra} — evento #${idEvento}`);
    res.status(201).json(compra);
  } catch (erro) {
    if (erro.status) return res.status(erro.status).json({ erro: erro.message });
    throw erro;
  }
}

// "Seus Ingressos" — tudo que o cliente comprou (e ainda não revendeu)
async function listarMeusIngressos(req, res) {
  const { rows } = await pool.query(
    `SELECT c.id_compra, c.quantidade, c.valor_unitario, c.valor_total, c.status, c.criado_em,
            e.id_evento, e.nome, e.data, e.data_fim, e.local, e.categoria, e.imagem_url,
            EXISTS (
              SELECT 1 FROM revendas r WHERE r.id_compra = c.id_compra AND r.status = 'disponivel'
            ) AS em_revenda
       FROM compras c
       JOIN eventos e ON e.id_evento = c.id_evento
      WHERE c.id_cliente = $1 AND c.status = 'confirmada'
      ORDER BY c.criado_em DESC`,
    [req.idCliente]
  );
  res.json(rows);
}

// "Suas Revendas" — os anúncios de revenda que o próprio cliente criou
async function listarMinhasRevendas(req, res) {
  const { rows } = await pool.query(
    `SELECT r.id_revenda, r.preco_unitario, r.status, r.criado_em,
            c.id_compra, c.quantidade, c.valor_unitario AS preco_original,
            e.id_evento, e.nome, e.data, e.local
       FROM revendas r
       JOIN compras c ON c.id_compra = r.id_compra
       JOIN eventos e ON e.id_evento = c.id_evento
      WHERE c.id_cliente = $1
      ORDER BY r.criado_em DESC`,
    [req.idCliente]
  );
  res.json(rows);
}

// Anunciar uma compra própria para revenda
async function criarRevenda(req, res) {
  const idCompra = idValido(req.body.id_compra);
  const preco = Number(req.body.preco_unitario);
  if (!idCompra) return res.status(400).json({ erro: 'ID de compra inválido' });
  if (!Number.isFinite(preco) || preco <= 0) {
    return res.status(400).json({ erro: 'Informe um preço de revenda maior que zero' });
  }

  const { rows: compras } = await pool.query(
    `SELECT id_compra FROM compras WHERE id_compra = $1 AND id_cliente = $2 AND status = 'confirmada'`,
    [idCompra, req.idCliente]
  );
  if (!compras[0]) {
    return res.status(404).json({ erro: 'Compra não encontrada, não é sua, ou já foi revendida' });
  }

  const { rows: ativas } = await pool.query(
    `SELECT id_revenda FROM revendas WHERE id_compra = $1 AND status = 'disponivel'`,
    [idCompra]
  );
  if (ativas[0]) {
    return res.status(409).json({ erro: 'Esta compra já está anunciada para revenda' });
  }

  const { rows } = await pool.query(
    `INSERT INTO revendas (id_compra, preco_unitario)
     VALUES ($1, $2)
     RETURNING id_revenda, id_compra, preco_unitario, status, criado_em`,
    [idCompra, preco]
  );
  await registrarLog(req.usuario.id, 'revenda_criada', `revenda #${rows[0].id_revenda} — compra #${idCompra}`);
  res.status(201).json(rows[0]);
}

// Cancelar um anúncio de revenda próprio (enquanto ainda não foi vendido)
async function cancelarRevenda(req, res) {
  const idRevenda = idValido(req.params.id);
  if (!idRevenda) return res.status(400).json({ erro: 'ID de revenda inválido' });

  const { rows } = await pool.query(
    `UPDATE revendas r SET status = 'cancelada'
       FROM compras c
      WHERE r.id_compra = c.id_compra AND r.id_revenda = $1
        AND c.id_cliente = $2 AND r.status = 'disponivel'
      RETURNING r.id_revenda`,
    [idRevenda, req.idCliente]
  );
  if (!rows[0]) {
    return res.status(404).json({ erro: 'Revenda não encontrada, não é sua, ou já não está disponível' });
  }
  res.status(204).send();
}

// Comprar um ingresso anunciado por outro cliente (transfere a compra de dono)
async function comprarRevenda(req, res) {
  const idRevenda = idValido(req.params.id);
  if (!idRevenda) return res.status(400).json({ erro: 'ID de revenda inválido' });

  try {
    const novaCompra = await emTransacao(async (client) => {
      const { rows } = await client.query(
        `SELECT r.id_revenda, r.preco_unitario, r.status,
                c.id_compra, c.id_cliente AS id_cliente_vendedor, c.id_evento, c.quantidade
           FROM revendas r
           JOIN compras c ON c.id_compra = r.id_compra
          WHERE r.id_revenda = $1
          FOR UPDATE`,
        [idRevenda]
      );
      const revenda = rows[0];
      if (!revenda || revenda.status !== 'disponivel') {
        const erro = new Error('Revenda não encontrada ou indisponível');
        erro.status = 404;
        throw erro;
      }
      if (revenda.id_cliente_vendedor === req.idCliente) {
        const erro = new Error('Você não pode comprar o seu próprio anúncio de revenda');
        erro.status = 400;
        throw erro;
      }

      const valorTotal = Math.round(revenda.preco_unitario * revenda.quantidade * 100) / 100;
      const { rows: compraRows } = await client.query(
        `INSERT INTO compras (id_cliente, id_evento, quantidade, valor_unitario, valor_total)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id_compra, id_evento, quantidade, valor_unitario, valor_total, status, criado_em`,
        [req.idCliente, revenda.id_evento, revenda.quantidade, revenda.preco_unitario, valorTotal]
      );
      await client.query(`UPDATE compras SET status = 'revendida' WHERE id_compra = $1`, [revenda.id_compra]);
      await client.query(`UPDATE revendas SET status = 'vendida' WHERE id_revenda = $1`, [idRevenda]);
      return compraRows[0];
    });

    await registrarLog(req.usuario.id, 'revenda_comprada', `revenda #${idRevenda} -> compra #${novaCompra.id_compra}`);
    res.status(201).json(novaCompra);
  } catch (erro) {
    if (erro.status) return res.status(erro.status).json({ erro: erro.message });
    throw erro;
  }
}

module.exports = {
  comprarIngresso, listarMeusIngressos, listarMinhasRevendas,
  criarRevenda, cancelarRevenda, comprarRevenda,
};
