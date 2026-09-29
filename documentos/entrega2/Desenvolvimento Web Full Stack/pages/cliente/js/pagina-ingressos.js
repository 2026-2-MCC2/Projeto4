const lista = document.getElementById("lista-ingressos");
const contador = document.getElementById("contador-ingressos");
const pills = document.querySelectorAll(".cliente-filtro-pill");
const selectOrdenar = document.getElementById("select-ordenar");

let categoriaAtual = "todos";

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function renderCarregando() {
  lista.innerHTML = Array.from({ length: 3 })
    .map(
      () => `
        <div class="cliente-skeleton">
          <div class="cliente-skeleton__bloco" style="width:72px;height:72px;flex-shrink:0;"></div>
          <div style="flex:1;display:flex;flex-direction:column;gap:0.5rem;">
            <div class="cliente-skeleton__bloco" style="width:60%;height:14px;"></div>
            <div class="cliente-skeleton__bloco" style="width:40%;height:12px;"></div>
          </div>
        </div>`
    )
    .join("");
  contador.textContent = "Carregando...";
}

function renderErro(mensagem) {
  lista.innerHTML = `
    <div class="cliente-estado cliente-estado--erro">
      <p>${mensagem}</p>
      <button type="button" class="cliente-btn-secundario-claro" id="btn-tentar-novamente">
        Tentar novamente
      </button>
    </div>`;
  contador.textContent = "—";

  document.getElementById("btn-tentar-novamente").addEventListener("click", carregarIngressos);
}

function renderVazio() {
  lista.innerHTML = `
    <div class="cliente-estado">
      <p>Nenhum ingresso encontrado para esse filtro.</p>
    </div>`;
  contador.textContent = "0 ingressos encontrados";
}

function renderLista(ingressos) {
  if (ingressos.length === 0) {
    renderVazio();
    return;
  }

  lista.innerHTML = ingressos
    .map(
      (item) => `
      <article class="cliente-ingresso-item">
        <img class="cliente-ingresso-item__imagem" src="${item.imagem}" alt="${item.titulo}">
        <div class="cliente-ingresso-item__info">
          <h3>${item.titulo}</h3>
          <p>${item.local} &bull; ${item.dataExibicao}</p>
          <div class="cliente-ingresso-item__tags">
            ${item.tags
              .map(
                (tag) =>
                  `<span class="cliente-tag${tag.tipo ? ` cliente-tag--${tag.tipo}` : ""}">${tag.texto}</span>`
              )
              .join("")}
          </div>
        </div>
        <div class="cliente-ingresso-item__preco">
          <strong>${formatarPreco(item.preco)}</strong>
          <small>por ingresso</small>
        </div>
        <div class="cliente-ingresso-item__acoes">
          <button type="button" class="cliente-icone-quadrado" aria-label="Salvar ingresso">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21 12 16 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
          </button>
          <a href="ver-ingresso.html?id=${item.id}" class="cliente-btn-comprar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V6l-3-4z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            Comprar
          </a>
        </div>
      </article>`
    )
    .join("");

  const plural = ingressos.length > 1 ? "s" : "";
  contador.textContent = `${ingressos.length} ingresso${plural} encontrado${plural}`;
}

async function carregarIngressos() {
  renderCarregando();
  try {
    const ordenar = selectOrdenar.value;
    const ingressos = await MockAPI.buscarIngressos({ categoria: categoriaAtual, ordenar });
    renderLista(ingressos);
  } catch (erro) {
    renderErro(erro.message);
  }
}

pills.forEach((pill) => {
  pill.addEventListener("click", () => {
    pills.forEach((p) => p.classList.remove("is-active"));
    pill.classList.add("is-active");
    categoriaAtual = pill.dataset.categoria;
    carregarIngressos();
  });
});

selectOrdenar.addEventListener("change", carregarIngressos);

carregarIngressos();
