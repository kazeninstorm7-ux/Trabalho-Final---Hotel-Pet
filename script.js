
 // Hotel Pet - Programacao Web II
// Etapa 1: navegacao entre as telas

document.addEventListener("DOMContentLoaded", function () {

    var secoes = document.querySelectorAll("main > section");
    var links = document.querySelectorAll('a[href^="#"]');
    var mensagem = document.getElementById("mensagem-navegacao");

    // Funcao para encontrar a secao onde o elemento esta.
    function encontrarSecao(elemento) {
        while (elemento && elemento.tagName !== "MAIN") {
            if (elemento.tagName === "SECTION" &&
                elemento.parentElement.tagName === "MAIN") {
                return elemento;
            }

            elemento = elemento.parentElement;
        }

        return null;
    }

    // Funcao para abrir uma tela e esconder as outras.
    function abrirTela(id, historico) {
        var destino = document.getElementById(id);

        if (destino === null) {
            return;
        }

        var secaoAtual = encontrarSecao(destino);

        for (var i = 0; i < secoes.length; i++) {
            if (secoes[i] === secaoAtual) {
                secoes[i].classList.remove("tela-oculta");
            } else {
                secoes[i].classList.add("tela-oculta");
            }
        }

        // Marca a opcao selecionada no menu.
        var linksMenu = document.querySelectorAll("nav a");

        for (var j = 0; j < linksMenu.length; j++) {
            var idMenu = linksMenu[j].getAttribute("href").substring(1);
            var elementoMenu = document.getElementById(idMenu);
            var secaoMenu = encontrarSecao(elementoMenu);

            if (idMenu === id ||
                (secaoAtual !== null && secaoMenu === secaoAtual)) {
                linksMenu[j].classList.add("ativo");
            } else {
                linksMenu[j].classList.remove("ativo");
            }
        }

        // Atualiza a mensagem da tela.
        if (mensagem !== null) {
            var titulo = destino.querySelector("h2, h3");

            if (titulo !== null) {
                mensagem.textContent = "Tela atual: " + titulo.textContent;
            } else {
                mensagem.textContent = "Tela atual do Hotel Pet";
            }
        }

        // Guarda a tela no historico do navegador.
        if (historico) {
            window.history.pushState(null, "", "#" + id);
        }

        destino.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    // Abre a tela quando um link do menu e clicado.
    for (var k = 0; k < links.length; k++) {
        links[k].addEventListener("click", function (evento) {
            var id = this.getAttribute("href").substring(1);

            if (document.getElementById(id) !== null) {
                evento.preventDefault();
                abrirTela(id, true);
            }
        });
    }

    // Permite usar os botoes voltar e avancar do navegador.
    window.addEventListener("popstate", function () {
        var id = window.location.hash.substring(1);

        if (id !== "" && document.getElementById(id) !== null) {
            abrirTela(id, false);
        } else {
            abrirTela("login", false);
        }
    });

    // Abre a tela indicada no endereco ou inicia pelo login.
    var telaInicial = window.location.hash.substring(1);

    if (telaInicial !== "" &&
        document.getElementById(telaInicial) !== null) {
        abrirTela(telaInicial, false);
    } else {
        abrirTela("login", false);
    }

    // Nesta etapa, os formularios ainda nao salvam dados.
    var formularios = document.querySelectorAll("form");

    for (var m = 0; m < formularios.length; m++) {
        formularios[m].addEventListener("submit", function (evento) {
            evento.preventDefault();

            if (mensagem !== null) {
                mensagem.textContent =
                    "Navegacao funcionando. As funcoes dos formularios serao feitas nas proximas etapas.";
            }
        });
    }

});
