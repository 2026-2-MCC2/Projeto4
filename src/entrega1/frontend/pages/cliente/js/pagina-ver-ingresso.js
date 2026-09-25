// pagina-ver-ingresso.js
// Responsabilidade única: o seletor de quantidade em ver-ingresso.html.

const blocoPreco = document.querySelector(".cliente-compra-card__preco");
const valorQuantidade = document.getElementById("quantidade-valor");
const btnDiminuir = document.getElementById("btn-diminuir");
const btnAumentar = document.getElementById("btn-aumentar");
const precoTotalEl = document.getElementById("preco-total");
const rotuloPreco = document.getElementById("rotulo-preco");

const QUANTIDADE_MAXIMA = 8;
let quantidade = 1;

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function atualizar() {
  const precoUnitario = parseFloat(blocoPreco.dataset.precoUnitario);
  valorQuantidade.textContent = quantidade;
  precoTotalEl.textContent = formatarPreco(precoUnitario * quantidade);
  rotuloPreco.textContent = quantidade > 1 ? `Total (${quantidade} ingressos)` : "Total";

  btnDiminuir.disabled = quantidade <= 1;
  btnAumentar.disabled = quantidade >= QUANTIDADE_MAXIMA;
}

if (btnDiminuir && btnAumentar) {
  btnDiminuir.addEventListener("click", () => {
    if (quantidade > 1) {
      quantidade--;
      atualizar();
    }
  });

  btnAumentar.addEventListener("click", () => {
    if (quantidade < QUANTIDADE_MAXIMA) {
      quantidade++;
      atualizar();
    }
  });

  atualizar();
}
