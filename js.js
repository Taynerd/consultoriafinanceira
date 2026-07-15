document.addEventListener("DOMContentLoaded", () => {
  /* ANIMAÇÃO DOS ELEMENTOS */

  const elementosReveal = document.querySelectorAll(
    ".card, .problem-card, .testimonial, .reveal",
  );

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("show");
          entrada.target.style.opacity = "1";
          entrada.target.style.transform = "translateY(0)";

          observer.unobserve(entrada.target);
        }
      });
    },
    {
      threshold: 0.1,
    },
  );

  elementosReveal.forEach((elemento) => {
    observer.observe(elemento);
  });

  /* FORMULÁRIO */

const URL_APPS_SCRIPT =
  "https://script.google.com/macros/s/AKfycbxH-_PwOFFVnGwiG5mTd9Nf70t1tl9dckPSD2n0zmUvRNozRuTR-iIUBecXjePtQ0lp/exec".trim();

  const formulario = document.getElementById("leadForm");
  const mensagem = document.getElementById("formStatus");

  if (!formulario) {
    console.error('O formulário com id="leadForm" não foi encontrado.');
    return;
  }

  if (!mensagem) {
    console.error('O elemento com id="formStatus" não foi encontrado.');
    return;
  }

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    console.log("Envio do formulário iniciado.");

    mensagem.className = "form-status";
    mensagem.textContent = "";

    if (!formulario.checkValidity()) {
      mensagem.textContent =
        "Preencha todos os campos obrigatórios antes de continuar.";

      mensagem.className = "form-status error";
      formulario.reportValidity();

      return;
    }

const urlAppsScriptLimpa = URL_APPS_SCRIPT.trim();

if (
  !urlAppsScriptLimpa ||
  urlAppsScriptLimpa.includes("https://script.google.com/macros/s/AKfycbxJ1qr7OlqWDR8NQmo04kyk0mYIjZw_2ucfXjqdq4rfmGIykWgFJ00vniI8SYBptRc/exec") ||
  !urlAppsScriptLimpa.includes("script.google.com/macros/s/")
) {
  mensagem.textContent =
    "O endereço de envio do formulário ainda não foi configurado.";

  mensagem.className = "form-status error";

  console.error(
    "URL do Apps Script inválida:",
    JSON.stringify(URL_APPS_SCRIPT)
  );

  return;
}

    const botao = formulario.querySelector(".form-submit");
    const dadosFormulario = new FormData(formulario);

    const dados = {
      nome: String(dadosFormulario.get("nome") || "").trim(),
      whatsapp: String(dadosFormulario.get("whatsapp") || "").trim(),
      renda: String(dadosFormulario.get("renda") || ""),
      dificuldade: String(dadosFormulario.get("dificuldade") || ""),
      dividas: String(dadosFormulario.get("dividas") || ""),
      objetivo: String(dadosFormulario.get("objetivo") || "").trim(),
      investimento: String(dadosFormulario.get("investimento") || ""),
      momento: String(dadosFormulario.get("momento") || ""),
      site: String(dadosFormulario.get("site") || ""),
      origem: "Landing Page — Disciplina Financeira",
    };

    console.log("Dados que serão enviados:", dados);

    if (dados.site) {
      mensagem.textContent = "Respostas enviadas com sucesso.";
      mensagem.className = "form-status success";
      formulario.reset();

      return;
    }

    const whatsappNumerico = dados.whatsapp.replace(/\D/g, "");

    if (
      whatsappNumerico.length < 10 ||
      whatsappNumerico.length > 13
    ) {
      mensagem.textContent =
        "Digite um número de WhatsApp válido, incluindo o DDD.";

      mensagem.className = "form-status error";

      document.getElementById("whatsapp").focus();
      return;
    }

    if (dados.objetivo.length < 5) {
      mensagem.textContent =
        "Conte um pouco mais sobre o que deseja conquistar.";

      mensagem.className = "form-status error";

      document.getElementById("objetivo").focus();
      return;
    }

    const pontuacao = calcularPontuacao(dados);

    try {
      botao.disabled = true;
      botao.textContent = "ENVIANDO...";
      botao.style.opacity = "0.65";
      botao.style.cursor = "not-allowed";

      mensagem.textContent = "Enviando suas respostas...";
      mensagem.className = "form-status";

      const corpo = new URLSearchParams();

      Object.entries(dados).forEach(([campo, valor]) => {
        corpo.append(campo, valor);
      });

await fetch(urlAppsScriptLimpa, {
  method: "POST",
  mode: "no-cors",
  body: corpo,
});

      console.log("Requisição enviada ao Apps Script.");

      mensagem.textContent =
        pontuacao >= 8
          ? "Respostas enviadas! Seu perfil será analisado e você receberá as próximas orientações."
          : "Respostas enviadas com sucesso. Obrigada por compartilhar seu momento financeiro.";

      mensagem.className = "form-status success";

      formulario.reset();

      mensagem.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } catch (erro) {
      console.error("Erro durante o envio:", erro);

      mensagem.textContent =
        "Não foi possível enviar suas respostas. Verifique sua conexão e tente novamente.";

      mensagem.className = "form-status error";
    } finally {
      botao.disabled = false;
      botao.textContent = "ENVIAR MINHA ANÁLISE";
      botao.style.opacity = "1";
      botao.style.cursor = "pointer";
    }
  });

  function calcularPontuacao(dados) {
    const pontosRenda = {
      "ate-1000": 0,
      "1000-1500": 1,
      "1500-2000": 2,
      "2000-3000": 3,
      "3000-5000": 4,
      "acima-5000": 5,
    };

    const pontosDividas = {
      sim: 1,
      nao: 2,
    };

    const pontosInvestimento = {
      sim: 3,
      depende: 2,
      gratuito: 1,
    };

    const pontosMomento = {
      "esta-semana": 3,
      "este-mes": 2,
      "proximos-meses": 1,
      pesquisando: 0,
    };

    return (
      (pontosRenda[dados.renda] ?? 0) +
      (pontosDividas[dados.dividas] ?? 0) +
      (pontosInvestimento[dados.investimento] ?? 0) +
      (pontosMomento[dados.momento] ?? 0)
    );
  }
});