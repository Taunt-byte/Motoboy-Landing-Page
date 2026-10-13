
/* =========================================
   ROTA EXPRESS
   Interações da Landing Page
   ========================================= */

/*
  IMPORTANTE:
  Troque o número abaixo pelo WhatsApp real.

  Formato:
  código do país + DDD + número

  Exemplo fictício:
  5511988887777

  Utilize apenas números, sem espaços,
  parênteses, hífens ou sinal de +.
*/

const WHATSAPP_NUMBER = "5511999999999";

const DEFAULT_WHATSAPP_MESSAGE =
  "Olá! Gostaria de solicitar um orçamento para uma entrega.";


// Seleciona os elementos da página.
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");
const quoteForm = document.querySelector("#quote-form");
const formError = document.querySelector("#form-error");
const whatsappFloat = document.querySelector("#whatsapp-float");


// Monta a URL do WhatsApp com uma mensagem codificada.
function createWhatsAppUrl(message) {
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}


// Configura o botão flutuante do WhatsApp.
if (whatsappFloat) {
  whatsappFloat.href = createWhatsAppUrl(
    DEFAULT_WHATSAPP_MESSAGE
  );
}


// =========================================
// MENU RESPONSIVO
// =========================================

if (menuToggle && mainNav) {

  menuToggle.addEventListener("click", () => {
    // Verifica se o menu já está aberto.
    const isOpen =
      menuToggle.getAttribute("aria-expanded") === "true";

    // Atualiza o estado de acessibilidade.
    menuToggle.setAttribute(
      "aria-expanded",
      String(!isOpen)
    );

    // Atualiza o texto acessível do botão.
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Abrir menu" : "Fechar menu"
    );

    // Mostra ou esconde o menu.
    mainNav.classList.toggle("is-open", !isOpen);
  });


  // Fecha o menu após clicar em um link.
  mainNav.querySelectorAll("a").forEach((link) => {

    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");

      mainNav.classList.remove("is-open");
    });

  });
}


// =========================================
// SELEÇÃO AUTOMÁTICA DE SERVIÇO
// =========================================

// Ao clicar em um cartão de serviço, a opção
// correspondente será selecionada no formulário.
document.querySelectorAll("[data-service]").forEach((link) => {

  link.addEventListener("click", () => {
    const select = document.querySelector("#service-type");

    if (!select) return;

    const requestedService = link.dataset.service;

    const matchingOption = [...select.options].find(
      (option) => option.value === requestedService
    );

    if (matchingOption) {
      select.value = matchingOption.value;
    }
  });

});


// =========================================
// FORMULÁRIO DE ORÇAMENTO
// =========================================

if (quoteForm) {

  quoteForm.addEventListener("submit", (event) => {

    // Impede o envio tradicional do formulário.
    event.preventDefault();

    // Esconde mensagens de erro anteriores.
    formError.hidden = true;
    formError.textContent = "";


    /*
      Evita o envio acidental para o número
      de demonstração.
    */
    if (
      !/^\d{10,15}$/.test(WHATSAPP_NUMBER) ||
      WHATSAPP_NUMBER === "5511999999999"
    ) {
      formError.textContent =
        "Configure seu número de WhatsApp no arquivo js/script.js antes de usar o formulário.";

      formError.hidden = false;
      return;
    }


    // Valida os campos obrigatórios do HTML.
    if (!quoteForm.reportValidity()) {
      return;
    }


    // Captura os dados preenchidos.
    const data = new FormData(quoteForm);

    const name = String(data.get("name") || "").trim();
    const service = String(data.get("service") || "").trim();
    const pickup = String(data.get("pickup") || "").trim();
    const destination = String(
      data.get("destination") || ""
    ).trim();

    const details = String(
      data.get("details") || ""
    ).trim();


    // Monta a mensagem que será enviada ao WhatsApp.
    const message = [
      "Olá! Gostaria de solicitar um orçamento para uma entrega.",
      "",
      `Nome: ${name}`,
      `Serviço: ${service}`,
      `Coleta: ${pickup}`,
      `Destino: ${destination}`,
      details ? `Detalhes: ${details}` : null
    ]
      .filter(Boolean)
      .join("\n");


    // Abre o WhatsApp com os dados preenchidos.
    const whatsappUrl = createWhatsAppUrl(message);

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );

  });

}


// =========================================
// ANO AUTOMÁTICO NO RODAPÉ
// =========================================

const yearElement = document.querySelector("#current-year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
