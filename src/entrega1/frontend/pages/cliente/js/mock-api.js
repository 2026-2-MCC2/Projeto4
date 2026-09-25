// mock-api.js
// Simula uma API real: retorna Promises, tem atraso de rede e pode falhar.
// Troque esta função por um fetch("https://sua-api.com/ingressos") quando
// o back-end existir — o resto do código (pagina-ingressos.js) não muda.
// Agrupado em "MockAPI" (em vez de export/import) pra funcionar mesmo
// abrindo o arquivo direto no navegador, sem precisar de servidor local.
const MockAPI = (() => {

const INGRESSOS_MOCK = [
  {
    id: "festival-verao-2025",
    titulo: "Festival de Verão 2025",
    local: "Allianz Parque – São Paulo, SP",
    dataExibicao: "25 de Outubro, 18:00",
    dataOrdenacao: "2025-10-25",
    categoria: "show",
    preco: 280.0,
    imagem: "https://picsum.photos/seed/festival-verao-2025/160/160",
    tags: [
      { texto: "Pista Premium" },
      { texto: "Custódia", tipo: "custodia" },
      { texto: "Aceita troca", tipo: "oferta" },
    ],
  },
  {
    id: "campeonato-nacional",
    titulo: "Final do Campeonato Nacional",
    local: "Estádio do Maracanã – Rio de Janeiro, RJ",
    dataExibicao: "12 de Novembro, 21:30",
    dataOrdenacao: "2025-11-12",
    categoria: "esporte",
    preco: 350.0,
    imagem: "https://picsum.photos/seed/campeonato-nacional/160/160",
    tags: [
      { texto: "Cadeira Inferior" },
      { texto: "Custódia", tipo: "custodia" },
    ],
  },
  {
    id: "comedia-especial",
    titulo: "Noite de Comédia Especial",
    local: "Teatro Bradesco – São Paulo, SP",
    dataExibicao: "05 de Dezembro, 20:00",
    dataOrdenacao: "2025-12-05",
    categoria: "teatro",
    preco: 90.0,
    imagem: "https://picsum.photos/seed/comedia-especial/160/160",
    tags: [
      { texto: "Plateia A" },
      { texto: "Custódia", tipo: "custodia" },
      { texto: "Contraproposta", tipo: "oferta" },
    ],
  },
  {
    id: "rock-the-mountain",
    titulo: "Rock The Mountain 2025",
    local: "Petrópolis, RJ",
    dataExibicao: "18 de Março, Fim de Semana 1",
    dataOrdenacao: "2025-03-18",
    categoria: "festival",
    preco: 180.0,
    imagem: "https://picsum.photos/seed/rock-the-mountain/160/160",
    tags: [
      { texto: "Passaporte 2 dias" },
      { texto: "Custódia", tipo: "custodia" },
    ],
  },
  {
    id: "coldplay-brasil",
    titulo: "Coldplay World Tour Brasil",
    local: "Allianz Parque – São Paulo, SP",
    dataExibicao: "05 de Abril",
    dataOrdenacao: "2025-04-05",
    categoria: "show",
    preco: 620.0,
    imagem: "https://picsum.photos/seed/coldplay-brasil/160/160",
    tags: [
      { texto: "Pista Geral" },
      { texto: "Custódia", tipo: "custodia" },
      { texto: "Alta demanda", tipo: "oferta" },
    ],
  },
];

const ATRASO_MS = 900;

/**
 * Busca os ingressos disponíveis (mock assíncrono).
 * @param {Object} opcoes
 * @param {string} opcoes.categoria - "todos" ou uma categoria específica.
 * @param {string} opcoes.ordenar - "menor-preco" | "maior-preco" | "data".
 * @param {boolean} opcoes.forcarErro - usado para testar o estado de erro.
 * @returns {Promise<Array>}
 */
function buscarIngressos({ categoria = "todos", ordenar = "menor-preco", forcarErro = false } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simula uma falha de rede ocasional (também pode ser forçada via forcarErro,
      // usado no botão de teste durante o desenvolvimento).
      if (forcarErro) {
        reject(new Error("Não foi possível carregar os ingressos. Verifique sua conexão e tente novamente."));
        return;
      }

      let resultado = [...INGRESSOS_MOCK];

      if (categoria !== "todos") {
        resultado = resultado.filter((item) => item.categoria === categoria);
      }

      if (ordenar === "menor-preco") {
        resultado.sort((a, b) => a.preco - b.preco);
      } else if (ordenar === "maior-preco") {
        resultado.sort((a, b) => b.preco - a.preco);
      } else if (ordenar === "data") {
        resultado.sort((a, b) => a.dataOrdenacao.localeCompare(b.dataOrdenacao));
      }

      resolve(resultado);
    }, ATRASO_MS);
  });
}

/**
 * Busca um único ingresso pelo id (usado futuramente por ver-ingresso.html
 * para carregar o ingresso certo via ?id= na URL).
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
function buscarIngressoPorId(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const encontrado = INGRESSOS_MOCK.find((item) => item.id === id) || null;
      resolve(encontrado);
    }, ATRASO_MS);
  });
}

return { buscarIngressos, buscarIngressoPorId };

})();
