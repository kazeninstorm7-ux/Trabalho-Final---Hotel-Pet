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




    // Etapa 2: buscas nas tabelas.
    // As pesquisas funcionam com os dados que ja estao na pagina.

    function normalizarTexto(texto) {
        return texto.toLowerCase().trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    // Busca reservas pelo nome do pet e pelo status.
    var formularioReservas = document.querySelector('#reservas form');
    var buscaNome = document.getElementById("busca_nome");
    var filtroStatus = document.getElementById("filtro_status");
    var tabelaReservas = document.querySelector("#reservas table tbody");

    if (formularioReservas && buscaNome && filtroStatus && tabelaReservas) {
        formularioReservas.addEventListener("submit", function (evento) {
            evento.preventDefault();

            var nome = normalizarTexto(buscaNome.value);
            var status = normalizarTexto(filtroStatus.value);
            var linhas = tabelaReservas.querySelectorAll("tr");
            var encontradas = 0;

            for (var i = 0; i < linhas.length; i++) {
                var nomePet = normalizarTexto(linhas[i].cells[1].textContent);
                var statusReserva = normalizarTexto(linhas[i].cells[4].textContent);
                var combinaNome = nomePet.indexOf(nome) !== -1;
                var combinaStatus = status === "" ||
                    statusReserva.indexOf(status) !== -1;

                if (combinaNome && combinaStatus) {
                    linhas[i].style.display = "";
                    encontradas++;
                } else {
                    linhas[i].style.display = "none";
                }
            }

            if (mensagem !== null) {
                mensagem.textContent = encontradas + " reserva(s) encontrada(s).";
            }
        });
    }

    // Filtra os pets pelo tipo, pela raca e pelo porte.
    var formularioPets = document.querySelector('#pets form');
    var filtroTipo = document.getElementById("f_tipo");
    var filtroRaca = document.getElementById("f_raca");
    var filtroPorte = document.getElementById("f_porte");
    var tabelaPets = document.querySelector("#pets table tbody");

    if (formularioPets && filtroTipo && filtroRaca && filtroPorte && tabelaPets) {
        formularioPets.addEventListener("submit", function (evento) {
            evento.preventDefault();

            var tipo = normalizarTexto(filtroTipo.value);
            var raca = normalizarTexto(filtroRaca.value);
            var porte = normalizarTexto(filtroPorte.value);
            var linhas = tabelaPets.querySelectorAll("tr");
            var encontradas = 0;

            for (var i = 0; i < linhas.length; i++) {
                var especiePet = normalizarTexto(linhas[i].cells[2].textContent);
                var racaPet = normalizarTexto(linhas[i].cells[3].textContent);
                var portePet = normalizarTexto(linhas[i].cells[4].textContent);
                var combinaTipo = especiePet.indexOf(tipo) !== -1;
                var combinaRaca = racaPet.indexOf(raca) !== -1;
                var combinaPorte = porte === "" ||
                    portePet.indexOf(porte) !== -1;

                if (combinaTipo && combinaRaca && combinaPorte) {
                    linhas[i].style.display = "";
                    encontradas++;
                } else {
                    linhas[i].style.display = "none";
                }
            }

            if (mensagem !== null) {
                mensagem.textContent = encontradas + " pet(s) encontrado(s).";
            }
        });
    }

    // Pesquisa usuarios pelo nome/e-mail, funcao e status.
    var formularioUsuarios = document.querySelector('#usuarios form');
    var buscaUsuario = document.getElementById("busca_usuario");
    var filtroFuncao = document.getElementById("filtro_funcao");
    var filtroUsuarioStatus = document.getElementById("filtro_usuario_status");
    var tabelaUsuarios = document.querySelector("#usuarios table tbody");

    if (formularioUsuarios && buscaUsuario && filtroFuncao &&
        filtroUsuarioStatus && tabelaUsuarios) {
        formularioUsuarios.addEventListener("submit", function (evento) {
            evento.preventDefault();

            var busca = normalizarTexto(buscaUsuario.value);
            var funcao = normalizarTexto(filtroFuncao.value);
            var status = normalizarTexto(filtroUsuarioStatus.value);
            var linhas = tabelaUsuarios.querySelectorAll("tr");
            var encontradas = 0;

            for (var i = 0; i < linhas.length; i++) {
                var nomeUsuario = normalizarTexto(linhas[i].cells[0].textContent);
                var emailUsuario = normalizarTexto(linhas[i].cells[1].textContent);
                var funcaoUsuario = normalizarTexto(linhas[i].cells[2].textContent);
                var statusUsuario = normalizarTexto(linhas[i].cells[3].textContent);
                var combinaBusca = nomeUsuario.indexOf(busca) !== -1 ||
                    emailUsuario.indexOf(busca) !== -1;
                var combinaFuncao = funcao === "" ||
                    funcaoUsuario.indexOf(funcao) !== -1;
                var combinaStatus = status === "" ||
                    statusUsuario.indexOf(status) !== -1;

                if (combinaBusca && combinaFuncao && combinaStatus) {
                    linhas[i].style.display = "";
                    encontradas++;
                } else {
                    linhas[i].style.display = "none";
                }
            }

            if (mensagem !== null) {
                mensagem.textContent = encontradas + " usuário(s) encontrado(s).";
            }
        });
    }

});
