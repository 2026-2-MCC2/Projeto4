// Popula o banco com dados REAIS de demonstração (não são admins — isso é
// outro script, criar-admins.js). Cria um organizador, dois fornecedores e
// dois clientes, com eventos/itens/custos/propostas de verdade, passando
// pelas mesmas regras do app (não é um dump solto de SQL).
// Rodar: node scripts/seed-dados-reais.js
// Pode rodar mais de uma vez: pula quem já existe (mesmo e-mail).
//
// IMPORTANTE: este arquivo é commitado (vai pro GitHub, que é público aqui).
// Por isso as senhas NUNCA ficam escritas aqui — são geradas na hora e salvas
// só em scripts/seed-credenciais.local.json, que está no .gitignore.
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const pool = require('../src/config/db');

const ARQUIVO_CREDENCIAIS = path.join(__dirname, 'seed-credenciais.local.json');

function gerarSenha() {
  const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#%';
  const bytes = crypto.randomBytes(16);
  let s = '';
  for (let i = 0; i < 16; i++) s += alfabeto[bytes[i] % alfabeto.length];
  return s;
}

function carregarCredenciaisLocais() {
  if (!fs.existsSync(ARQUIVO_CREDENCIAIS)) return {};
  return JSON.parse(fs.readFileSync(ARQUIVO_CREDENCIAIS, 'utf8'));
}

function salvarCredenciaisLocais(credenciais) {
  fs.writeFileSync(ARQUIVO_CREDENCIAIS, JSON.stringify(credenciais, null, 2));
}

// Cada conta de demonstração ganha sua própria senha aleatória, gerada na
// primeira execução e reaproveitada depois (pra não trocar a cada rodada).
const credenciaisLocais = carregarCredenciaisLocais();
function senhaPara(email) {
  if (!credenciaisLocais[email]) {
    credenciaisLocais[email] = gerarSenha();
  }
  return credenciaisLocais[email];
}

async function buscarOuCriarUsuario({ nome, email, tipo, cpf, cnpj, endereco, telefone }) {
  const senha = senhaPara(email);
  const existente = await pool.query('SELECT id_usuario FROM usuarios WHERE email = $1', [email]);
  if (existente.rows[0]) {
    console.log(`– ${email} já existe, reaproveitando (senha não alterada).`);
    return existente.rows[0].id_usuario;
  }

  const hash = await bcrypt.hash(senha, 10);
  const { rows } = await pool.query(
    `INSERT INTO usuarios (nome, email, telefone, senha_hash, tipo, status_cadastro)
     VALUES ($1, $2, $3, $4, $5, 'aprovado') RETURNING id_usuario`,
    [nome, email, telefone || null, hash, tipo]
  );
  const idUsuario = rows[0].id_usuario;

  if (tipo === 'cliente') {
    await pool.query('INSERT INTO clientes (id_usuario, cpf) VALUES ($1, $2)', [idUsuario, cpf]);
  } else {
    const tabela = tipo === 'organizador' ? 'organizadores' : 'fornecedores';
    await pool.query(`INSERT INTO ${tabela} (id_usuario, cnpj, endereco) VALUES ($1, $2, $3)`, [
      idUsuario, cnpj, endereco || null,
    ]);
  }
  console.log(`✅ Usuário criado: ${nome} <${email}> (${tipo})`);
  return idUsuario;
}

async function idOrganizadorDe(idUsuario) {
  const { rows } = await pool.query('SELECT id_organizador FROM organizadores WHERE id_usuario = $1', [idUsuario]);
  return rows[0].id_organizador;
}
async function idFornecedorDe(idUsuario) {
  const { rows } = await pool.query('SELECT id_fornecedor FROM fornecedores WHERE id_usuario = $1', [idUsuario]);
  return rows[0].id_fornecedor;
}

async function buscarOuCriarEvento(idOrganizador, dados) {
  const existente = await pool.query(
    'SELECT id_evento FROM eventos WHERE id_organizador = $1 AND nome = $2',
    [idOrganizador, dados.nome]
  );
  if (existente.rows[0]) {
    console.log(`– evento "${dados.nome}" já existe, reaproveitando.`);
    return existente.rows[0].id_evento;
  }
  const { rows } = await pool.query(
    `INSERT INTO eventos (id_organizador, nome, data, data_fim, local, descricao,
                          publico_minimo, publico_maximo, margem_lucro, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id_evento`,
    [idOrganizador, dados.nome, dados.data, dados.data_fim || null, dados.local, dados.descricao || null,
     dados.publico_minimo || null, dados.publico_maximo || null, dados.margem_lucro || 0, dados.status]
  );
  console.log(`✅ Evento criado: ${dados.nome} (${dados.status})`);
  return rows[0].id_evento;
}

async function buscarOuCriarItem(idEvento, nome, categoria, descricao) {
  const existente = await pool.query(
    'SELECT id_item FROM itens_custo WHERE id_evento = $1 AND nome = $2', [idEvento, nome]
  );
  if (existente.rows[0]) return existente.rows[0].id_item;
  const { rows } = await pool.query(
    'INSERT INTO itens_custo (id_evento, nome, categoria, descricao) VALUES ($1,$2,$3,$4) RETURNING id_item',
    [idEvento, nome, categoria, descricao || null]
  );
  return rows[0].id_item;
}

async function buscarOuCriarCusto(idEvento, tipo, descricao, valor, porParticipante) {
  const existente = await pool.query(
    'SELECT id_custo FROM custos_evento WHERE id_evento = $1 AND descricao = $2', [idEvento, descricao]
  );
  if (existente.rows[0]) return existente.rows[0].id_custo;
  await pool.query(
    'INSERT INTO custos_evento (id_evento, tipo, descricao, valor, por_participante) VALUES ($1,$2,$3,$4,$5)',
    [idEvento, tipo, descricao, valor, porParticipante]
  );
}

async function buscarOuCriarProposta(idEvento, idItem, idFornecedor, dados) {
  const existente = await pool.query(
    'SELECT id_proposta FROM propostas WHERE id_item = $1 AND id_fornecedor = $2', [idItem, idFornecedor]
  );
  if (existente.rows[0]) {
    await pool.query('UPDATE propostas SET status = $1 WHERE id_proposta = $2', [dados.status, existente.rows[0].id_proposta]);
    return existente.rows[0].id_proposta;
  }
  const { rows } = await pool.query(
    `INSERT INTO propostas (id_evento, id_item, id_fornecedor, valor_total, descricao, validade, observacoes, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id_proposta`,
    [idEvento, idItem, idFornecedor, dados.valor_total, dados.descricao, dados.validade, dados.observacoes || null, dados.status]
  );
  return rows[0].id_proposta;
}

async function criarTicketSeNaoExiste(idUsuario, assunto, categoria, prioridade, status, mensagem) {
  const existente = await pool.query(
    'SELECT id_ticket FROM tickets_suporte WHERE id_usuario = $1 AND assunto = $2', [idUsuario, assunto]
  );
  if (existente.rows[0]) return existente.rows[0].id_ticket;
  const { rows } = await pool.query(
    `INSERT INTO tickets_suporte (id_usuario, assunto, categoria, prioridade, status)
     VALUES ($1,$2,$3,$4,$5) RETURNING id_ticket`,
    [idUsuario, assunto, categoria, prioridade, status]
  );
  await pool.query(
    'INSERT INTO ticket_mensagens (id_ticket, id_usuario, mensagem) VALUES ($1,$2,$3)',
    [rows[0].id_ticket, idUsuario, mensagem]
  );
  return rows[0].id_ticket;
}

async function log(idUsuario, acao, detalhe) {
  await pool.query('INSERT INTO logs_auditoria (id_usuario, acao, detalhe) VALUES ($1,$2,$3)', [idUsuario, acao, detalhe]);
}

async function seed() {
  // ===== Pessoas =====
  const carlos = await buscarOuCriarUsuario({
    nome: 'Carlos Mendes', email: 'carlos.mendes@liveprod.com.br', tipo: 'organizador',
    cnpj: '12345678000190', endereco: 'Av. Paulista, 1000 — São Paulo, SP', telefone: '(11) 91234-5678',
  });
  const fernanda = await buscarOuCriarUsuario({
    nome: 'Fernanda Lima', email: 'fernanda.lima@buffetpro.com.br', tipo: 'fornecedor',
    cnpj: '98765432000155', endereco: 'Rua Augusta, 500 — São Paulo, SP', telefone: '(11) 99876-5432',
  });
  const marcos = await buscarOuCriarUsuario({
    nome: 'Marcos Teixeira', email: 'marcos.teixeira@prolightsound.com.br', tipo: 'fornecedor',
    cnpj: '11222333000144', endereco: 'Rua Vergueiro, 200 — São Paulo, SP', telefone: '(11) 98888-1122',
  });
  const gabriel = await buscarOuCriarUsuario({
    nome: 'Gabriel Souza', email: 'gabriel.souza@email.com', tipo: 'cliente',
    cpf: '12345678901', telefone: '(11) 97777-0001',
  });
  const juliana = await buscarOuCriarUsuario({
    nome: 'Juliana Prado', email: 'juliana.prado@email.com', tipo: 'cliente',
    cpf: '98765432100', telefone: '(11) 97777-0002',
  });

  const idOrganizador = await idOrganizadorDe(carlos);
  const idFernanda = await idFornecedorDe(fernanda);
  const idMarcos = await idFornecedorDe(marcos);

  // ===== Evento 1: aberto, com propostas (o mesmo cenário do guia do RF13, pra bater com o exemplo oficial) =====
  const evento1 = await buscarOuCriarEvento(idOrganizador, {
    nome: 'Festival de Verão 2026', data: '2026-12-10', data_fim: '2026-12-10',
    local: 'Allianz Parque — São Paulo, SP',
    descricao: 'Festival de música ao ar livre com três palcos.',
    publico_minimo: 500, publico_maximo: 1000, margem_lucro: 20, status: 'aberto',
  });
  const itemBuffet = await buscarOuCriarItem(evento1, 'Buffet e catering', 'alimentacao', 'Alimentação para equipe e staff');
  const itemIluminacao = await buscarOuCriarItem(evento1, 'Iluminação e som', 'estrutura', 'Estrutura de palco, som e luz');
  const itemSeguranca = await buscarOuCriarItem(evento1, 'Segurança do evento', 'seguranca', 'Equipe de segurança credenciada');

  await buscarOuCriarCusto(evento1, 'fiscal', 'Alvará e taxas municipais', 5000, false);
  await buscarOuCriarCusto(evento1, 'operacional', 'Taxa de serviço por ingresso', 10, true);

  await buscarOuCriarProposta(evento1, itemBuffet, idFernanda, {
    valor_total: 6500, descricao: 'Buffet completo para equipe e staff (200 pessoas)',
    validade: '2026-12-01', status: 'aceita',
  });
  await buscarOuCriarProposta(evento1, itemIluminacao, idMarcos, {
    valor_total: 12000, descricao: 'Pacote completo de som e iluminação profissional',
    validade: '2026-12-01', status: 'aceita',
  });
  await buscarOuCriarProposta(evento1, itemSeguranca, idMarcos, {
    valor_total: 9000, descricao: 'Equipe de 20 seguranças credenciados',
    validade: '2026-12-01', status: 'enviada',
  });
  await buscarOuCriarProposta(evento1, itemSeguranca, idFernanda, {
    valor_total: 11000, descricao: 'Equipe de segurança terceirizada',
    validade: '2026-11-20', status: 'recusada',
  });

  // ===== Evento 2: ainda em planejamento (rascunho) =====
  const evento2 = await buscarOuCriarEvento(idOrganizador, {
    nome: 'Workshop de Inovação 2026', data: '2026-09-15',
    local: 'Centro de Convenções Frei Caneca — São Paulo, SP',
    descricao: 'Workshop corporativo de um dia sobre inovação e tecnologia.',
    status: 'rascunho',
  });
  await buscarOuCriarItem(evento2, 'Coffee break', 'alimentacao', 'Coffee break para 150 participantes');

  // ===== Evento 3: encerrado (fechado), pra mostrar histórico variado =====
  const evento3 = await buscarOuCriarEvento(idOrganizador, {
    nome: 'Summit de Tecnologia 2025', data: '2025-09-05', data_fim: '2025-09-05',
    local: 'Centro de Convenções Pro Magno — São Paulo, SP',
    descricao: 'Encontro anual de tecnologia e inovação.',
    publico_minimo: 300, publico_maximo: 500, margem_lucro: 15, status: 'fechado',
  });
  const itemCoffee3 = await buscarOuCriarItem(evento3, 'Coffee break corporativo', 'alimentacao', null);
  await buscarOuCriarCusto(evento3, 'fiscal', 'Taxas do centro de convenções', 3000, false);
  await buscarOuCriarProposta(evento3, itemCoffee3, idFernanda, {
    valor_total: 4100, descricao: 'Coffee break corporativo completo',
    validade: '2025-08-20', status: 'recusada',
  });

  // ===== Tickets de suporte (pra Logs/Monitoramento/Tickets terem dado real) =====
  await criarTicketSeNaoExiste(
    carlos, 'Dúvida sobre publicar evento', 'evento', 'media', 'resolvido',
    'Como faço pra publicar o evento assim que os itens de custo estiverem prontos?'
  );
  await criarTicketSeNaoExiste(
    fernanda, 'Proposta recusada sem explicação', 'proposta', 'alta', 'aberto',
    'Minha proposta de segurança pro Festival de Verão foi recusada, gostaria de entender o motivo.'
  );
  await criarTicketSeNaoExiste(
    gabriel, 'Erro ao tentar acessar minha conta', 'cadastro', 'baixa', 'em_andamento',
    'Não estou conseguindo ver meus dados completos no perfil.'
  );

  // ===== Alguns logs de auditoria pra história ficar coerente =====
  await log(carlos, 'cadastro_criado', 'organizador — status inicial: pendente');
  await log(carlos, 'cadastro_aprovado', 'organizador — aprovado pelo admin');
  await log(fernanda, 'cadastro_criado', 'fornecedor — status inicial: pendente');
  await log(fernanda, 'cadastro_aprovado', 'fornecedor — aprovado pelo admin');
  await log(gabriel, 'cadastro_criado', 'cliente — status inicial: aprovado');

  salvarCredenciaisLocais(credenciaisLocais);
  console.log('\nTudo pronto. Senhas salvas (só localmente) em scripts/seed-credenciais.local.json:');
  console.log('  organizador: carlos.mendes@liveprod.com.br — ' + credenciaisLocais['carlos.mendes@liveprod.com.br']);
  console.log('  fornecedor:  fernanda.lima@buffetpro.com.br — ' + credenciaisLocais['fernanda.lima@buffetpro.com.br']);
  console.log('  fornecedor:  marcos.teixeira@prolightsound.com.br — ' + credenciaisLocais['marcos.teixeira@prolightsound.com.br']);
  console.log('  cliente:     gabriel.souza@email.com — ' + credenciaisLocais['gabriel.souza@email.com']);
  console.log('  cliente:     juliana.prado@email.com — ' + credenciaisLocais['juliana.prado@email.com']);

  await pool.end();
}

seed().catch((erro) => {
  console.error('Erro ao popular dados:', erro.message);
  process.exit(1);
});
