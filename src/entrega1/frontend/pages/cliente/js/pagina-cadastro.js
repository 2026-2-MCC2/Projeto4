// pagina-cadastro.js
// Responsabilidade única: o formulário de cadastro.html —
// força da senha em tempo real + validação completa antes do envio.

const form = document.getElementById("form-cadastro");
const campoSenha = document.getElementById("senha");
const barraPreenchida = document.getElementById("forca-preenchida");
const textoForca = document.getElementById("forca-texto");

/* ---------- força da senha (feedback visual, não bloqueia envio) ---------- */
function calcularForca(senha) {
  if (senha.length === 0) {
    return { nivel: "vazia", texto: "Força: informe uma senha" };
  }

  let pontos = 0;
  if (senha.length >= 8) pontos++;
  if (/[A-Z]/.test(senha)) pontos++;
  if (/[0-9]/.test(senha)) pontos++;
  if (/[^A-Za-z0-9]/.test(senha)) pontos++;

  if (pontos <= 1) {
    return { nivel: "fraca", texto: "Força: Fraca (use letras maiúsculas, números e símbolos)" };
  }
  if (pontos <= 3) {
    return { nivel: "media", texto: "Força: Média (combine mais tipos de caractere)" };
  }
  return { nivel: "forte", texto: "Força: Forte (combinação de letras, números e símbolos)" };
}

if (campoSenha) {
  campoSenha.addEventListener("input", () => {
    const resultado = calcularForca(campoSenha.value);
    barraPreenchida.className = "forca-preenchida";
    if (resultado.nivel !== "vazia") {
      barraPreenchida.classList.add(`forca-preenchida--${resultado.nivel}`);
    }
    textoForca.textContent = resultado.texto;
  });
}

/* ---------- validação antes do envio ---------- */
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_TELEFONE = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;

function marcarErro(idCampo, comErro) {
  const campo = document.getElementById(idCampo);
  campo.classList.toggle("tem-erro", comErro);
  return !comErro;
}

function validarFormulario() {
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const senha = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById("confirmar-senha").value;
  const termos = document.getElementById("termos").checked;

  // Avalia todos os campos (sem "&&" de curto-circuito) para que o
  // usuário veja todos os erros de uma vez, não um por vez.
  const nomeValido = marcarErro("campo-nome", nome.length < 3);
  const emailValido = marcarErro("campo-email", !REGEX_EMAIL.test(email));
  const telefoneValido = marcarErro("campo-telefone", !REGEX_TELEFONE.test(telefone));
  const senhaValida = marcarErro("campo-senha", senha.length < 8);
  const confirmacaoValida = marcarErro("campo-confirmar-senha", confirmarSenha !== senha || senha.length === 0);
  const termosValidos = marcarErro("campo-termos", !termos);

  return nomeValido && emailValido && telefoneValido && senhaValida && confirmacaoValida && termosValidos;
}

function mostrarSucesso() {
  const area = document.getElementById("area-cadastro");
  area.innerHTML = `
    <div class="cliente-formulario-sucesso">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>
      <h2>Cadastro realizado!</h2>
      <p>Sua conta foi criada com sucesso. Agora você já pode explorar os ingressos disponíveis.</p>
      <a href="inicio.html" class="botao-cadastrar" style="display:block;text-decoration:none;">Ir para o Início</a>
    </div>`;
}

if (form) {
  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (validarFormulario()) {
      mostrarSucesso();
    } else {
      // leva o usuário até o primeiro campo com erro
      const primeiroErro = form.querySelector(".campo.tem-erro");
      if (primeiroErro) {
        primeiroErro.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  });

  // some com o erro assim que a pessoa corrige o campo
  form.querySelectorAll(".campo input").forEach((input) => {
    input.addEventListener("input", () => {
      input.closest(".campo").classList.remove("tem-erro");
    });
  });
}
