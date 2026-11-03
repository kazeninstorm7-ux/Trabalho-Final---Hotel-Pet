// Hotel Pet - Programacao Web II
// Etapa 1: navegacao entre as telas
// Etapa 2: buscas nas tabelas
// Etapa 3: edicao das tabelas

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

    // Abre a tela quando um link e clicado.
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

    // Nesta etapa, os formularios funcionam na propria pagina.
    var formularios = document.querySelectorAll("form");

    for (var m = 0; m < formularios.length; m++) {
        formularios[m].addEventListener("submit", function (evento) {
            evento.preventDefault();

            if (mensagem !== null) {
                mensagem.textContent =
                    "Os dados desta demonstracao sao trabalhados na propria pagina.";
            }
        });
    }

    // Funcao para deixar os textos no mesmo formato.
    function normalizarTexto(texto) {
        return texto.toLowerCase().trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    // Funcao para mostrar mensagens.
    function mostrarMensagem(texto) {
        if (mensagem !== null) {
            mensagem.textContent = texto;
        }
    }


    // ETAPA 2: BUSCAS NAS TABELAS


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

            mostrarMensagem(encontradas + " reserva(s) encontrada(s).");
        });
    }

    // Filtra os pets pelo tipo, pela raca e pelo porte.
    var formularioPetsBusca = document.querySelector('#pets form');
    var filtroTipo = document.getElementById("f_tipo");
    var filtroRaca = document.getElementById("f_raca");
    var filtroPorte = document.getElementById("f_porte");
    var tabelaPets = document.querySelector("#pets table tbody");

    if (formularioPetsBusca && filtroTipo && filtroRaca &&
        filtroPorte && tabelaPets) {

        formularioPetsBusca.addEventListener("submit", function (evento) {
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

            mostrarMensagem(encontradas + " pet(s) encontrado(s).");
        });
    }

    // Pesquisa usuarios pelo nome/e-mail, funcao e status.
    var formularioUsuariosBusca = document.querySelector('#usuarios form');
    var buscaUsuario = document.getElementById("busca_usuario");
    var filtroFuncao = document.getElementById("filtro_funcao");
    var filtroUsuarioStatus = document.getElementById("filtro_usuario_status");
    var tabelaUsuarios = document.querySelector("#usuarios table tbody");

    if (formularioUsuariosBusca && buscaUsuario && filtroFuncao &&
        filtroUsuarioStatus && tabelaUsuarios) {

        formularioUsuariosBusca.addEventListener("submit", function (evento) {
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

            mostrarMensagem(encontradas + " usuário(s) encontrado(s).");
        });
    }


    // ETAPA 3: EDICAO DAS TABELAS


    // RESERVAS

    var linhaReservaAtual = null;
    var formularioNovaReserva = document.querySelector("#nova-reserva form");
    var formularioDetalhesReserva = document.querySelector("#detalhes-reserva form");
    var proximoCodigoReserva = 102;

    // Formata a data para o padrao brasileiro.
    function formatarData(data) {
        if (data === "") {
            return "";
        }

        var partes = data.split("-");
        return partes[2] + "/" + partes[1] + "/" + partes[0];
    }

    // Abre os detalhes da reserva selecionada.
    function abrirDetalhesReserva(linha) {
        linhaReservaAtual = linha;

        var codigo = linha.cells[0].textContent;
        var pet = linha.cells[1].textContent;

        document.querySelector("#detalhes-reserva h2").textContent =
            "Acompanhamento da Reserva (" + codigo + ")";

        document.querySelector("#detalhes-reserva legend").textContent =
            "Reserva " + codigo + " - " + pet;

        var status = normalizarTexto(linha.cells[4].textContent);
        var campoStatus = document.getElementById("st_reserva");

        if (status.indexOf("andamento") !== -1) {
            campoStatus.value = "andamento";
        } else if (status.indexOf("finalizada") !== -1) {
            campoStatus.value = "finalizada";
        } else {
            campoStatus.value = "cancelada";
        }

        abrirTela("detalhes-reserva", true);
    }

    // Abre os detalhes das reservas que ja estao na tabela.
    var linksDetalhes = tabelaReservas.querySelectorAll('a[href="#detalhes-reserva"]');

    for (var i = 0; i < linksDetalhes.length; i++) {
        linksDetalhes[i].addEventListener("click", function () {
            var linha = this.parentElement.parentElement;
            abrirDetalhesReserva(linha);
        });
    }

    // Salva a alteracao do status da reserva.
    if (formularioDetalhesReserva) {
        formularioDetalhesReserva.addEventListener("submit", function (evento) {
            evento.preventDefault();

            if (linhaReservaAtual !== null) {
                var novoStatus = document.getElementById("st_reserva");
                linhaReservaAtual.cells[4].textContent =
                    novoStatus.options[novoStatus.selectedIndex].textContent;

                mostrarMensagem("Reserva atualizada com sucesso.");

                abrirTela("reservas", true);
                linhaReservaAtual = null;
            }
        });
    }

    // Cadastra uma nova reserva na tabela.
    if (formularioNovaReserva) {
        formularioNovaReserva.addEventListener("submit", function (evento) {
            evento.preventDefault();

            var petSelecionado = document.getElementById("select_pet");
            var entrada = document.getElementById("dt_entrada").value;
            var saida = document.getElementById("dt_saida").value;

            if (entrada > saida) {
                mostrarMensagem("A data de saida deve ser posterior a data de entrada.");
                return;
            }

            var textoPet = petSelecionado.options[petSelecionado.selectedIndex].textContent;
            var partesPet = textoPet.split("(Tutor: ");
            var nomePet = partesPet[0].trim();
            var tutor = "Não informado";

            if (partesPet.length > 1) {
                tutor = partesPet[1].replace(")", "").trim();
            }

            var linha = tabelaReservas.insertRow();

            linha.insertCell(0).textContent = "#" + proximoCodigoReserva;
            linha.insertCell(1).textContent = nomePet;
            linha.insertCell(2).textContent = tutor;
            linha.insertCell(3).textContent =
                formatarData(entrada) + " a " + formatarData(saida);
            linha.insertCell(4).textContent = "Em andamento";

            var celulaAcoes = linha.insertCell(5);
            var botao = document.createElement("button");

            botao.type = "button";
            botao.textContent = "Ver detalhes";

            botao.addEventListener("click", function () {
                abrirDetalhesReserva(linha);
            });

            celulaAcoes.appendChild(botao);

            proximoCodigoReserva++;

            formularioNovaReserva.reset();

            mostrarMensagem("Nova reserva cadastrada com sucesso.");
            abrirTela("reservas", true);
        });
    }


    // PETS

    var formularioPet = document.querySelector("#novo-pet form");
    var petAtual = null;

    // Cria os botoes de acoes dos pets.
    function criarAcoesPet(linha) {
        var celula = linha.cells[6];
        celula.textContent = "";

        var visualizar = document.createElement("button");
        visualizar.type = "button";
        visualizar.textContent = "Visualizar";

        visualizar.addEventListener("click", function () {
            preencherVisualizacaoPet(linha);
            abrirTela("visualizar-pet", true);
        });

        var editar = document.createElement("button");
        editar.type = "button";
        editar.textContent = "Editar";

        editar.addEventListener("click", function () {
            editarPet(linha);
            abrirTela("novo-pet", true);
        });

        var excluir = document.createElement("button");
        excluir.type = "button";
        excluir.textContent = "Excluir";

        excluir.addEventListener("click", function () {
            if (confirm("Deseja realmente excluir este pet?")) {
                tabelaPets.removeChild(linha);
                mostrarMensagem("Pet excluido com sucesso.");
            }
        });

        celula.appendChild(visualizar);
        celula.appendChild(editar);
        celula.appendChild(excluir);
    }

    // Preenche os dados para visualizar o pet.
    function preencherVisualizacaoPet(linha) {
        var dados = document.querySelectorAll("#visualizar-pet fieldset p");

        dados[1].lastChild.textContent = " " + linha.cells[1].textContent;
        dados[2].lastChild.textContent = " " + linha.cells[2].textContent;
        dados[3].lastChild.textContent = " " + linha.cells[3].textContent;
        dados[4].lastChild.textContent = " " + linha.cells[4].textContent;
        dados[5].lastChild.textContent = " " + linha.cells[5].textContent;

        var fotoTabela = linha.cells[0].querySelector("img");
        var fotoVisualizacao = dados[0].querySelector("img");

        if (fotoTabela && fotoVisualizacao) {
            fotoVisualizacao.src = fotoTabela.src;
        }
    }

    // Preenche o formulario para editar um pet.
    function editarPet(linha) {
        petAtual = linha;

        document.getElementById("pet_nome").value = linha.cells[1].textContent;
        document.getElementById("pet_especie").value = linha.cells[2].textContent;
        document.getElementById("pet_raca").value = linha.cells[3].textContent;
        document.getElementById("pet_porte").value =
            normalizarTexto(linha.cells[4].textContent);

        var tutor = linha.cells[5].textContent;
        var campoTutor = document.getElementById("select_tutor");

        for (var i = 0; i < campoTutor.options.length; i++) {
            if (campoTutor.options[i].textContent === tutor) {
                campoTutor.selectedIndex = i;
            }
        }
    }

    // Prepara os botoes da tabela de pets que ja existem.
    if (tabelaPets) {
        var linhasPets = tabelaPets.querySelectorAll("tr");

        for (var i = 0; i < linhasPets.length; i++) {
            criarAcoesPet(linhasPets[i]);
        }
    }

    // Limpa o formulario quando for cadastrar um novo pet.
    var linkNovoPet = document.querySelector('#pets > p a[href="#novo-pet"]');

    if (linkNovoPet) {
        linkNovoPet.addEventListener("click", function () {
            petAtual = null;
            formularioPet.reset();
        });
    }

    // Salva um novo pet ou atualiza um pet existente.
    if (formularioPet) {
        formularioPet.addEventListener("submit", function (evento) {
            evento.preventDefault();

            var tutor = document.getElementById("select_tutor");
            var nome = document.getElementById("pet_nome").value;
            var especie = document.getElementById("pet_especie").value;
            var raca = document.getElementById("pet_raca").value;
            var porte = document.getElementById("pet_porte");

            var nomeTutor = tutor.options[tutor.selectedIndex].textContent;
            var textoPorte = porte.options[porte.selectedIndex].textContent;

            var linha;

            if (petAtual !== null) {
                linha = petAtual;

                linha.cells[1].textContent = nome;
                linha.cells[2].textContent = especie;
                linha.cells[3].textContent = raca;
                linha.cells[4].textContent = textoPorte;
                linha.cells[5].textContent = nomeTutor;

                mostrarMensagem("Dados do pet atualizados com sucesso.");
            } else {
                linha = tabelaPets.insertRow();

                var foto = linha.insertCell(0);
                foto.textContent = "Sem foto";

                linha.insertCell(1).textContent = nome;
                linha.insertCell(2).textContent = especie;
                linha.insertCell(3).textContent = raca;
                linha.insertCell(4).textContent = textoPorte;
                linha.insertCell(5).textContent = nomeTutor;
                linha.insertCell(6);

                criarAcoesPet(linha);

                mostrarMensagem("Pet cadastrado com sucesso.");
            }

            petAtual = null;
            formularioPet.reset();

            abrirTela("pets", true);
        });
    }


    // USUARIOS

    var formularioNovoUsuario = document.querySelector("#novo-usuario form");
    var formularioEditarUsuario = document.querySelector("#editar-usuario form");
    var usuarioAtual = null;

    // Cria os botoes de acoes dos usuarios.
    function criarAcoesUsuario(linha) {
        var celula = linha.cells[4];
        celula.textContent = "";

        var visualizar = document.createElement("button");
        visualizar.type = "button";
        visualizar.textContent = "Visualizar";

        visualizar.addEventListener("click", function () {
            preencherVisualizacaoUsuario(linha);
            abrirTela("visualizar-usuario", true);
        });

        var editar = document.createElement("button");
        editar.type = "button";
        editar.textContent = "Editar";

        editar.addEventListener("click", function () {
            preencherEdicaoUsuario(linha);
            abrirTela("editar-usuario", true);
        });

        var excluir = document.createElement("button");
        excluir.type = "button";
        excluir.textContent = "Remover";

        excluir.addEventListener("click", function () {
            if (confirm("Deseja realmente remover este usuario?")) {
                tabelaUsuarios.removeChild(linha);
                mostrarMensagem("Usuario removido com sucesso.");
            }
        });

        celula.appendChild(visualizar);
        celula.appendChild(editar);
        celula.appendChild(excluir);
    }

    // Mostra os dados do usuario selecionado.
    function preencherVisualizacaoUsuario(linha) {
        var dados = document.querySelectorAll("#visualizar-usuario fieldset p");

        dados[0].lastChild.textContent = " " + linha.cells[0].textContent;
        dados[1].lastChild.textContent = " " + linha.cells[1].textContent;
        dados[2].lastChild.textContent =
            " " + (linha.getAttribute("data-telefone") || "Não informado");
        dados[3].lastChild.textContent = " " + linha.cells[2].textContent;
        dados[4].lastChild.textContent = " " + linha.cells[3].textContent;
    }

    // Preenche os campos para editar um usuario.
    function preencherEdicaoUsuario(linha) {
        usuarioAtual = linha;

        document.getElementById("editar_nome_usuario").value =
            linha.cells[0].textContent;

        document.getElementById("editar_email_usuario").value =
            linha.cells[1].textContent;

        document.getElementById("editar_telefone_usuario").value =
            linha.getAttribute("data-telefone") || "";

        document.getElementById("novo_cargo").value =
            normalizarTexto(linha.cells[2].textContent);

        document.getElementById("editar_status_usuario").value =
            normalizarTexto(linha.cells[3].textContent);
    }

    // Guarda os telefones dos usuarios que ja estao cadastrados.
    if (tabelaUsuarios.rows.length > 0) {
        tabelaUsuarios.rows[0].setAttribute("data-telefone", "(77) 99999-9999");
        tabelaUsuarios.rows[1].setAttribute("data-telefone", "");
    }

    // Prepara os botoes dos usuarios que ja estao na tabela.
    for (var i = 0; i < tabelaUsuarios.rows.length; i++) {
        criarAcoesUsuario(tabelaUsuarios.rows[i]);
    }

    // Cadastra um novo usuario.
    if (formularioNovoUsuario) {
        formularioNovoUsuario.addEventListener("submit", function (evento) {
            evento.preventDefault();

            var nome = document.getElementById("novo_usuario_nome").value;
            var email = document.getElementById("novo_usuario_email").value;
            var telefone = document.getElementById("novo_usuario_telefone").value;

            var funcao = document.getElementById("novo_usuario_funcao");
            var status = document.getElementById("novo_usuario_status");

            var linha = tabelaUsuarios.insertRow();

            linha.insertCell(0).textContent = nome;
            linha.insertCell(1).textContent = email;
            linha.insertCell(2).textContent =
                funcao.options[funcao.selectedIndex].textContent;
            linha.insertCell(3).textContent =
                status.options[status.selectedIndex].textContent;
            linha.insertCell(4);

            linha.setAttribute("data-telefone", telefone);

            criarAcoesUsuario(linha);

            formularioNovoUsuario.reset();

            mostrarMensagem("Usuario cadastrado com sucesso.");
            abrirTela("usuarios", true);
        });
    }

    // Atualiza os dados de um usuario.
    if (formularioEditarUsuario) {
        formularioEditarUsuario.addEventListener("submit", function (evento) {
            evento.preventDefault();

            if (usuarioAtual !== null) {
                var nome = document.getElementById("editar_nome_usuario").value;
                var email = document.getElementById("editar_email_usuario").value;
                var telefone = document.getElementById("editar_telefone_usuario").value;

                var funcao = document.getElementById("novo_cargo");
                var status = document.getElementById("editar_status_usuario");

                usuarioAtual.cells[0].textContent = nome;
                usuarioAtual.cells[1].textContent = email;

                usuarioAtual.cells[2].textContent =
                    funcao.options[funcao.selectedIndex].textContent;

                usuarioAtual.cells[3].textContent =
                    status.options[status.selectedIndex].textContent;

                usuarioAtual.setAttribute("data-telefone", telefone);

                usuarioAtual = null;

                mostrarMensagem("Dados do usuario atualizados com sucesso.");
                abrirTela("usuarios", true);
            }
        });
    }

});
