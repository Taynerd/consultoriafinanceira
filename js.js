// Scroll fade
window.addEventListener("scroll", () => {
  const elements = document.querySelectorAll(".card, .problem-card, .testimonial");
  elements.forEach(el => {
    const position = el.getBoundingClientRect().top;
    if(position < window.innerHeight - 100){
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }
  });
});

const URL_APPS_SCRIPT =
"https://script.google.com/macros/s/AKfycbxH-_PwOFFVnGwiG5mTd9Nf70t1tl9dckPSD2n0zmUvRNozRuTR-iIUBecXjePtQ0lp/exec";

const formularioLead = document.getElementById("leadForm");
const mensagemFormulario = document.getElementById("formStatus");

if (formularioLead) {
formularioLead.addEventListener("submit", async (evento) => {
evento.preventDefault();

const botaoEnviar =
  formularioLead.querySelector(".form-submit");

if (!formularioLead.checkValidity()) {
  formularioLead.reportValidity();
  return;
}

const dadosFormulario = new FormData(formularioLead);

const dados = {
  nome: dadosFormulario.get("nome"),
  whatsapp: dadosFormulario.get("whatsapp"),
  renda: dadosFormulario.get("renda"),
  dificuldade: dadosFormulario.get("dificuldade"),
  dividas: dadosFormulario.get("dividas"),
  objetivo: dadosFormulario.get("objetivo"),
  investimento: dadosFormulario.get("investimento"),
  momento: dadosFormulario.get("momento"),
  site: dadosFormulario.get("site"),
  origem: "Landing page — Disciplina Financeira"
};

// O cálculo no navegador serve para controlar a experiência visual.
// O Apps Script calcula novamente antes de registrar na planilha.
const pontuacao = calcularPontuacaoLead(dados);

try {
  alterarEstadoDoBotao(botaoEnviar, true);

  mensagemFormulario.textContent =
    "Enviando suas respostas...";
  mensagemFormulario.className = "form-status";

  const corpo = new URLSearchParams();

  Object.entries(dados).forEach(([campo, valor]) => {
    corpo.append(campo, valor || "");
  });

  /*
   * O modo no-cors é usado porque o Google Apps Script pode fazer
   * redirecionamentos durante a resposta do Web App.
   *
   * Nesse modo, o navegador envia os dados, mas não permite ler
   * diretamente o JSON retornado pelo servidor.
   */
  await fetch(URL_APPS_SCRIPT, {
    method: "POST",
    mode: "no-cors",
    body: corpo
  });

  mensagemFormulario.textContent =
    criarMensagemDeConclusao(pontuacao);

  mensagemFormulario.className =
    "form-status success";

  formularioLead.reset();

  mensagemFormulario.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
} catch (erro) {
  console.error("Erro ao enviar formulário:", erro);

  mensagemFormulario.textContent =
    "Não foi possível enviar suas respostas. Verifique sua conexão e tente novamente.";

  mensagemFormulario.className =
    "form-status error";
} finally {
  alterarEstadoDoBotao(botaoEnviar, false);
}

});
}

function calcularPontuacaoLead(dados) {
const pontosRenda = {
"ate-1000": 0,
"1000-1500": 1,
"1500-2000": 2,
"2000-3000": 3,
"3000-5000": 4,
"acima-5000": 5
};

const pontosDividas = {
sim: 1,
nao: 2
};

const pontosInvestimento = {
sim: 3,
depende: 2,
gratuito: 1
};

const pontosMomento = {
"esta-semana": 3,
"este-mes": 2,
"proximos-meses": 1,
pesquisando: 0
};

return (
(pontosRenda[dados.renda] ?? 0) +
(pontosDividas[dados.dividas] ?? 0) +
(pontosInvestimento[dados.investimento] ?? 0) +
(pontosMomento[dados.momento] ?? 0)
);
}

function criarMensagemDeConclusao(pontuacao) {
if (pontuacao >= 8) {
return "Respostas enviadas! Seu perfil será analisado e você receberá as próximas orientações.";
}

return "Respostas enviadas com sucesso. Obrigada por compartilhar seu momento financeiro.";
}

function alterarEstadoDoBotao(botao, enviando) {
if (!botao) return;

botao.disabled = enviando;
botao.textContent = enviando
? "ENVIANDO..."
: "ENVIAR MINHA ANÁLISE";

botao.style.opacity = enviando ? "0.65" : "1";
botao.style.cursor = enviando
? "not-allowed"
: "pointer";
}
