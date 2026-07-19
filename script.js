// Aguarda todo o HTML da página carregar antes de executar os scripts.
document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       1. MENU MOBILE (HAMBÚRGUER)
       =========================================
       Controla a abertura e fechamento do menu em celulares.
    */
    const menuToggle = document.getElementById("menu-toggle");
    const mainNav = document.getElementById("main-nav");

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            // Alterna a classe que mostra/esconde o menu no CSS
            mainNav.classList.toggle("nav--open");
            
            // Atualiza os atributos de acessibilidade para leitores de tela
            const isOpen = mainNav.classList.contains("nav--open");
            menuToggle.setAttribute("aria-expanded", isOpen);
        });

        // Fecha o menu automaticamente quando o usuário clicar em algum link
        const navLinks = mainNav.querySelectorAll(".nav__link");
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                mainNav.classList.remove("nav--open");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }


    /* =========================================
       2. ACESSIBILIDADE: ALTERAÇÃO DO TAMANHO DO TEXTO
       =========================================
       Aumenta ou diminui a fonte do site de forma proporcional usando 'rem'.
    */
    const btnIncreaseText = document.getElementById("btn-increase-text");
    const btnDecreaseText = document.getElementById("btn-decrease-text");
    let currentFontSize = 100; // Representa 100% do tamanho padrão (16px)

    if (btnIncreaseText && btnDecreaseText) {
        btnIncreaseText.addEventListener("click", () => {
            if (currentFontSize < 130) { // Limite máximo para não quebrar o layout
                currentFontSize += 10;
                document.documentElement.style.fontSize = `${currentFontSize}%`;
            }
        });

        btnDecreaseText.addEventListener("click", () => {
            if (currentFontSize > 80) { // Limite mínimo de legibilidade
                currentFontSize -= 10;
                document.documentElement.style.fontSize = `${currentFontSize}%`;
            }
        });
    }


    /* =========================================
       3. ACESSIBILIDADE: ALTO CONTRASTE
       =========================================
       Ativa um modo de cor focado em pessoas com baixa visão.
    */
    const btnContrast = document.getElementById("btn-contrast");
    if (btnContrast) {
        btnContrast.addEventListener("click", () => {
            // Adiciona ou remove a classe no <body>. O CSS se encarrega do resto.
            document.body.classList.toggle("high-contrast");
        });
    }


    /* =========================================
       4. ACESSIBILIDADE: LEITURA DE TEXTO (TTS)
       =========================================
       Usa a API nativa do navegador para ler os textos da página em voz alta.
    */
    const btnTts = document.getElementById("btn-tts");
    let isSpeaking = false;

    if (btnTts) {
        btnTts.addEventListener("click", () => {
            if (!isSpeaking) {
                // Captura todo o texto visível dentro da tag <main>
                const textToRead = document.querySelector(".main-content").innerText;
                const utterance = new SpeechSynthesisUtterance(textToRead);
                utterance.lang = "pt-BR";

                // Evento executado quando a leitura termina
                utterance.onend = () => {
                    isSpeaking = false;
                    btnTts.innerHTML = '<i class="fa-solid fa-volume-high"></i> Ouvir Texto';
                };

                window.speechSynthesis.speak(utterance);
                isSpeaking = true;
                btnTts.innerHTML = '<i class="fa-solid fa-stop"></i> Parar Leitura';
            } else {
                // Se já estiver lendo, o clique para a voz imediatamente
                window.speechSynthesis.cancel();
                isSpeaking = false;
                btnTts.innerHTML = '<i class="fa-solid fa-volume-high"></i> Ouvir Texto';
            }
        });
    }


    /* =========================================
       5. ANIMAÇÃO AO ROLAR A TELA (SCROLL REVEAL)
       =========================================
       Faz as seções e cards surgirem com um efeito suave conforme aparecem na tela.
    */
    const sectionsToReveal = document.querySelectorAll("section, .card, .project-box, .event-row");
    
    // Adiciona a classe base de animação em todos os elementos selecionados
    sectionsToReveal.forEach(el => el.classList.add("reveal"));

    const checkScroll = () => {
        const triggerBottom = window.innerHeight * 0.85; // Ponto de ativação (85% da tela)

        sectionsToReveal.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;

            if (sectionTop < triggerBottom) {
                section.classList.add("reveal--active");
            }
        });
    };

    // Executa uma vez ao carregar e monitora a rolagem do usuário
    window.addEventListener("scroll", checkScroll);
    checkScroll();


    /* =========================================
       6. BOTÃO VOLTAR AO TOPO
       =========================================
       Mostra o botão flutuante apenas se o usuário descer a página além de 400px.
    */
    const btnBackToTop = document.getElementById("btn-back-to-top");

    if (btnBackToTop) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 400) {
                btnBackToTop.style.display = "flex";
            } else {
                btnBackToTop.style.display = "none";
            }
        });

        btnBackToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }


    /* =========================================
       7. GALERIA DE FOTOS COM LIGHTBOX
       =========================================
       Abre a imagem clicada em tela cheia com setas de navegação.
    */
    const galleryImages = document.querySelectorAll(".gallery-grid__img");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const lightboxClose = document.getElementById("lightbox-close");
    const lightboxPrev = document.getElementById("lightbox-prev");
    const lightboxNext = document.getElementById("lightbox-next");
    let currentImgIndex = 0;

    if (lightbox && galleryImages.length > 0) {
        
        // Função interna para carregar a imagem no lightbox com base no índice
        const showImage = (index) => {
            currentImgIndex = index;
            const imgElement = galleryImages[currentImgIndex];
            lightboxImg.src = imgElement.src;
            lightboxCaption.textContent = imgElement.alt;
        };

        // Escuta o clique em cada imagem da galeria
        galleryImages.forEach((img, index) => {
            img.addEventListener("click", () => {
                lightbox.style.display = "flex";
                lightbox.setAttribute("aria-hidden", "false");
                showImage(index);
            });
        });

        // Fechar o Lightbox
        const closeLightbox = () => {
            lightbox.style.display = "none";
            lightbox.setAttribute("aria-hidden", "true");
        };
        lightboxClose.addEventListener("click", closeLightbox);

        // Navegar para a Imagem Anterior
        lightboxPrev.addEventListener("click", (e) => {
            e.stopPropagation(); // Evita fechar o modal por clicar no fundo
            let newIndex = currentImgIndex - 1;
            if (newIndex < 0) newIndex = galleryImages.length - 1; // Volta para a última
            showImage(newIndex);
        });

        // Navegar para a Próxima Imagem
        lightboxNext.addEventListener("click", (e) => {
            e.stopPropagation();
            let newIndex = currentImgIndex + 1;
            if (newIndex >= galleryImages.length) newIndex = 0; // Volta para a primeira
            showImage(newIndex);
        });

        // Fecha se o usuário clicar fora da imagem (no fundo escuro)
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }


    /* =========================================
       8. VALIDAÇÃO DO FORMULÁRIO DE CONTATO
       =========================================
       Verifica se os campos estão certos antes de simular o envio.
    */
    const contactForm = document.getElementById("contact-form");
    const successMsg = document.getElementById("form-success-msg");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault(); // Impede o recarregamento automático da página
            
            let isFormValid = true;
            const inputs = contactForm.querySelectorAll("input[required], textarea[required]");

            inputs.forEach(input => {
                const formGroup = input.parentElement;
                
                // Validação simples de campo vazio ou e-mail inválido
                if (!input.value.trim() || (input.type === "email" && !input.value.includes("@"))) {
                    formGroup.classList.add("form__group--invalid");
                    isFormValid = false;
                } else {
                    formGroup.classList.remove("form__group--invalid");
                }
            });

            // Se tudo estiver correto, exibe mensagem de sucesso e limpa os campos
            if (isFormValid) {
                successMsg.style.display = "block";
                contactForm.reset();
                
                // Esconde o aviso de sucesso após 5 segundos
                setTimeout(() => {
                    successMsg.style.display = "none";
                }, 5000);
            }
        });
    }


    /* =========================================
       9. INTERFACE DO CHATBOT (PROTÓTIPO)
       =========================================
       Controla a janela flutuante e simula respostas automáticas.
    */
    const chatbotToggle = document.getElementById("chatbot-toggle");
    const chatbotBox = document.getElementById("chatbot-box");
    const chatbotClose = document.getElementById("chatbot-close");
    const chatbotForm = document.getElementById("chatbot-form");
    const chatbotInput = document.getElementById("chatbot-input");
    const chatbotMessages = document.getElementById("chatbot-messages");

    if (chatbotToggle && chatbotBox) {
        // Abre/Fecha a janela ao clicar no botão redondo
        chatbotToggle.addEventListener("click", () => {
            const isHidden = chatbotBox.style.display === "none" || chatbotBox.style.display === "";
            chatbotBox.style.display = isHidden ? "flex" : "none";
            chatbotBox.setAttribute("aria-hidden", !isHidden);
        });

        chatbotClose.addEventListener("click", () => {
            chatbotBox.style.display = "none";
            chatbotBox.setAttribute("aria-hidden", "true");
        });

        // Envio de mensagens na janela
        chatbotForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const userText = chatbotInput.value.trim();
            if (!userText) return;

            // 1. Renderiza a mensagem do usuário na tela
            const userDiv = document.createElement("div");
            userDiv.className = "chatbot__msg chatbot__msg--user";
            userDiv.textContent = userText;
            chatbotMessages.appendChild(userDiv);
            
            chatbotInput.value = ""; // Limpa o campo
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Rola para o final

            // 2. Resposta Simulada do Sistema (Mock)
            setTimeout(() => {
                const botDiv = document.createElement("div");
                botDiv.className = "chatbot__msg chatbot__msg--bot";
                botDiv.textContent = "Obrigado pelo contato! Para informações sobre matrículas e transferências, por favor envie uma mensagem através do formulário de contato localizado nesta página.";
                chatbotMessages.appendChild(botDiv);
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }, 1000);

            /* =========================================
               COMENTÁRIO OBRIGATÓRIO - INTEGRAÇÃO DIALOGFLOW
               =========================================
               Para integrar o Dialogflow aqui no futuro, você deve substituir o 'setTimeout' acima por:
               
               fetch('URL_DA_SUA_CLOUD_FUNCTION_OU_WEBHOOK', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({ message: userText })
               })
               .then(response => response.json())
               .then(data => {
                   // Aqui você pegaria 'data.fulfillmentText' vindo da API do Dialogflow
                   // e colocaria dentro do textContent do botDiv.
               });
               
               Isso fará com que a inteligência artificial do Google processe a intenção do aluno de verdade.
            */
        });
    }

});