/* ==========================================================
   SISTEMA LAGUNA HALL
   LOGIN + PLANTÃO + SALVAMENTO AUTOMÁTICO
========================================================== */


/* ==========================================================
   CONFIGURAÇÕES
========================================================== */

const LH_USER_KEY = "lagunaHall_usuario";

const LH_DATA_PREFIX = "lagunaHall_plantao_";


/* ==========================================================
   FUNÇÕES AUXILIARES
========================================================== */

function normalizarNome(nome) {

    return nome
        .trim()
        .replace(/\s+/g, " ");

}


function usuarioAtual() {

    return localStorage.getItem(LH_USER_KEY) || "";

}


function chaveUsuario(nome) {

    return LH_DATA_PREFIX +
        normalizarNome(nome).toLowerCase();

}


/* ==========================================================
   CONTAINERS DINÂMICOS
========================================================== */

const CONTAINERS_DINAMICOS = [

    "prestadoresContainer",
    "salaoContainer",
    "churrasqueiraContainer",
    "mudancaContainer",
    "entregasContainer",
    "cartasContainer",
    "chavesContainer",
    "recolherContainer"

];


/* ==========================================================
   INICIALIZAÇÃO
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const loginForm =
            document.getElementById("loginForm");

        if (loginForm) {

            iniciarLogin(loginForm);

        }


        const plantaoForm =
            document.getElementById("plantaoForm");

        if (plantaoForm) {

            iniciarPlantao(plantaoForm);

        }

    }
);


/* ==========================================================
   LOGIN
========================================================== */

function iniciarLogin(form) {

    const nomeInput =
        document.getElementById("nomeUsuario");

    const erro =
        document.getElementById("erroLogin");


    const nomeAnterior =
        localStorage.getItem(LH_USER_KEY);


    if (nomeAnterior && nomeInput) {

        nomeInput.value = nomeAnterior;

    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const nome =
                normalizarNome(nomeInput.value);


            if (!nome) {

                if (erro) {

                    erro.style.display = "block";

                }

                nomeInput.focus();

                return;

            }


            if (erro) {

                erro.style.display = "none";

            }


            /*
            ==============================================
            SALVA O USUÁRIO
            ==============================================
            */

            localStorage.setItem(
                LH_USER_KEY,
                nome
            );


            /*
            ==============================================
            NÃO APAGA O PLANTÃO EXISTENTE
            ==============================================
            */

            window.location.href =
                "plantao.html";

        }
    );

}


/* ==========================================================
   INICIAR PLANTÃO
========================================================== */

function iniciarPlantao(form) {

    const nome = usuarioAtual();


    if (!nome) {

        window.location.href = "index.html";

        return;

    }


    /*
    ==============================================
    MOSTRA O NOME
    ==============================================
    */

    const usuario =
        document.getElementById("usuarioAtual");

    if (usuario) {

        usuario.textContent = nome;

    }


    const usuarioTexto =
        document.getElementById("usuarioAtualTexto");

    if (usuarioTexto) {

        usuarioTexto.textContent = nome;

    }


    /*
    ==============================================
    RECUPERA O PLANTÃO
    ==============================================
    */

    restaurarPlantao();


    /*
    ==============================================
    PORTEIRO QUE ESTÁ SAINDO
    ==============================================
    */

    const porteiroSaindo =
        document.getElementById("porteiroSaindo");

    if (porteiroSaindo) {

        porteiroSaindo.value = nome;

    }


    /*
    ==============================================
    DATA AUTOMÁTICA
    ==============================================
    */

    const data =
        document.getElementById("dataPlantao");

    if (data && !data.value) {

        data.value =
            new Date()
                .toISOString()
                .slice(0, 10);

    }


    /*
    ==============================================
    SALVAMENTO AUTOMÁTICO
    ==============================================
    */

    form.addEventListener(
        "input",
        salvarPlantao
    );


    form.addEventListener(
        "change",
        salvarPlantao
    );


    /*
    ==============================================
    OBSERVA ALTERAÇÕES NAS LINHAS
    ==============================================
    */

    observarContainersDinamicos();

}


/* ==========================================================
   OBSERVAR CONTAINERS DINÂMICOS
========================================================== */

function observarContainersDinamicos() {

    CONTAINERS_DINAMICOS.forEach(
        function (id) {

            const container =
                document.getElementById(id);

            if (!container) {

                return;

            }


            const observer =
                new MutationObserver(
                    function () {

                        salvarPlantao();

                    }
                );


            observer.observe(
                container,
                {
                    childList: true,
                    subtree: true
                }
            );

        }
    );

}


/* ==========================================================
   SALVAR CAMPOS DINÂMICOS
========================================================== */

function salvarCamposDinamicos() {

    const dados = {};


    CONTAINERS_DINAMICOS.forEach(
        function (id) {

            const container =
                document.getElementById(id);

            if (!container) {

                return;

            }


            const linhas =
                container.querySelectorAll(
                    ".dynamic-row"
                );


            dados[id] = [];


            linhas.forEach(
                function (linha) {

                    const controles =
                        linha.querySelectorAll(
                            "input, textarea, select"
                        );


                    const valores = [];


                    controles.forEach(
                        function (controle) {

                            valores.push({

                                tag:
                                    controle.tagName,

                                type:
                                    controle.type || "",

                                value:
                                    controle.value,

                                checked:
                                    controle.checked

                            });

                        }
                    );


                    dados[id].push(valores);

                }
            );

        }
    );


    return dados;

}


/* ==========================================================
   RESTAURAR CAMPOS DINÂMICOS
========================================================== */

function restaurarCamposDinamicos(dinamicos) {

    if (!dinamicos) {

        return;

    }


    Object.keys(dinamicos).forEach(
        function (id) {

            const container =
                document.getElementById(id);

            if (!container) {

                return;

            }


            const linhasSalvas =
                dinamicos[id];


            if (
                !linhasSalvas ||
                linhasSalvas.length === 0
            ) {

                return;

            }


            /*
            ==============================================
            PEGA A PRIMEIRA LINHA COMO MODELO
            ==============================================
            */

            let linhasAtuais =
                Array.from(
                    container.querySelectorAll(
                        ".dynamic-row"
                    )
                );


            /*
            ==============================================
            CRIA AS LINHAS QUE ESTÃO FALTANDO
            ==============================================
            */

            while (
                linhasAtuais.length <
                linhasSalvas.length
            ) {

                const modelo =
                    linhasAtuais[0];


                if (!modelo) {

                    break;

                }


                const novaLinha =
                    modelo.cloneNode(true);


                /*
                ------------------------------------------
                LIMPA OS CAMPOS DA NOVA LINHA
                ------------------------------------------
                */

                novaLinha
                    .querySelectorAll(
                        "input, textarea"
                    )
                    .forEach(
                        function (campo) {

                            campo.value = "";

                        }
                    );


                novaLinha
                    .querySelectorAll(
                        "select"
                    )
                    .forEach(
                        function (campo) {

                            campo.selectedIndex = 0;

                        }
                    );


                /*
                ------------------------------------------
                ADICIONA BOTÃO X SE NECESSÁRIO
                ------------------------------------------
                */

                if (
                    !novaLinha.querySelector(
                        ".remove-btn"
                    )
                ) {

                    const botao =
                        document.createElement(
                            "button"
                        );


                    botao.type = "button";

                    botao.className =
                        "remove-btn";

                    botao.textContent = "X";


                    botao.onclick =
                        function () {

                            novaLinha.remove();

                            salvarPlantao();

                        };


                    novaLinha.appendChild(
                        botao
                    );

                }


                container.appendChild(
                    novaLinha
                );


                linhasAtuais =
                    Array.from(
                        container.querySelectorAll(
                            ".dynamic-row"
                        )
                    );

            }


            /*
            ==============================================
            RECUPERA OS VALORES
            ==============================================
            */

            linhasAtuais =
                Array.from(
                    container.querySelectorAll(
                        ".dynamic-row"
                    )
                );


            linhasSalvas.forEach(
                function (
                    linhaSalva,
                    indiceLinha
                ) {

                    const linha =
                        linhasAtuais[
                            indiceLinha
                        ];


                    if (!linha) {

                        return;

                    }


                    const controles =
                        linha.querySelectorAll(
                            "input, textarea, select"
                        );


                    linhaSalva.forEach(
                        function (
                            dado,
                            indiceCampo
                        ) {

                            const controle =
                                controles[
                                    indiceCampo
                                ];


                            if (!controle) {

                                return;

                            }


                            controle.value =
                                dado.value || "";


                            if (
                                controle.type ===
                                "checkbox"
                            ) {

                                controle.checked =
                                    !!dado.checked;

                            }

                        }
                    );

                }
            );

        }
    );

}


/* ==========================================================
   SALVAR PLANTÃO COMPLETO
========================================================== */

function salvarPlantao() {

    const nome = usuarioAtual();

    const form =
        document.getElementById("plantaoForm");


    if (!nome || !form) {

        return;

    }


    const dados = {

        usuario: nome,

        dataSalvamento:
            new Date().toISOString(),

        campos: {},

        dinamicos:
            salvarCamposDinamicos()

    };


    /*
    ==============================================
    CAMPOS NORMAIS
    ==============================================
    */

    const elementos =
        form.querySelectorAll(
            "input, textarea, select"
        );


    elementos.forEach(
        function (elemento) {

            if (!elemento.id) {

                return;

            }


            dados.campos[elemento.id] = {

                value:
                    elemento.value,

                checked:
                    elemento.checked

            };

        }
    );


    /*
    ==============================================
    SALVA NO LOCALSTORAGE
    ==============================================
    */

    localStorage.setItem(

        chaveUsuario(nome),

        JSON.stringify(dados)

    );


    atualizarStatus(
        "✓ Salvo automaticamente"
    );

}


/* ==========================================================
   RESTAURAR PLANTÃO COMPLETO
========================================================== */

function restaurarPlantao() {

    const nome = usuarioAtual();


    if (!nome) {

        return;

    }


    const salvo =
        localStorage.getItem(
            chaveUsuario(nome)
        );


    if (!salvo) {

        return;

    }


    let dados;


    try {

        dados =
            JSON.parse(salvo);

    } catch (erro) {

        console.error(
            "Erro ao recuperar plantão:",
            erro
        );

        return;

    }


    /*
    ==============================================
    RESTAURA CAMPOS NORMAIS
    ==============================================
    */

    if (dados.campos) {

        Object.keys(
            dados.campos
        ).forEach(
            function (id) {

                const elemento =
                    document.getElementById(id);


                if (!elemento) {

                    return;

                }


                elemento.value =
                    dados.campos[id].value || "";


                if (
                    elemento.type ===
                    "checkbox"
                ) {

                    elemento.checked =
                        !!dados.campos[id].checked;

                }

            }
        );

    }


    /*
    ==============================================
    RESTAURA AS LINHAS DINÂMICAS
    ==============================================
    */

    restaurarCamposDinamicos(
        dados.dinamicos
    );


    atualizarStatus(
        "✓ Plantão recuperado"
    );

}


/* ==========================================================
   STATUS
========================================================== */

function atualizarStatus(texto) {

    const status =
        document.getElementById(
            "saveStatus"
        );


    if (status) {

        status.textContent =
            texto;

    }

}


/* ==========================================================
   CRIAR LINHA DINÂMICA
========================================================== */

function criarLinha(
    containerId,
    html
) {

    const container =
        document.getElementById(
            containerId
        );


    if (!container) {

        console.error(
            "Container não encontrado:",
            containerId
        );

        return;

    }


    const linha =
        document.createElement(
            "div"
        );


    linha.className =
        "dynamic-row";


    linha.innerHTML =
        html;


    container.appendChild(
        linha
    );


    salvarPlantao();

}


/* ==========================================================
   PRESTADOR
========================================================== */

function addPrestador() {

    criarLinha(

        "prestadoresContainer",

        `
        <input
            type="text"
            placeholder="Nome / Empresa"
            style="width:30%;"
        >

        <input
            type="text"
            placeholder="Serviço Realizado"
            style="width:35%;"
        >

        <input
            type="time"
            style="width:17.5%;"
        >

        <input
            type="time"
            style="width:17.5%;"
        >

        <button
            type="button"
            class="remove-btn"
            onclick="
                this.parentElement.remove();
                salvarPlantao();
            "
        >
            X
        </button>
        `

    );

}


/* ==========================================================
   SALÃO
========================================================== */

function addSalao() {

    criarLinha(

        "salaoContainer",

        `
        <input
            type="text"
            placeholder="Apto"
            style="width:25%;"
        >

        <input
            type="text"
            placeholder="Nome do Morador"
            style="width:45%;"
        >

        <input
            type="text"
            placeholder="Data / Período"
            style="width:30%;"
        >

        <button
            type="button"
            class="remove-btn"
            onclick="
                this.parentElement.remove();
                salvarPlantao();
            "
        >
            X
        </button>
        `

    );

}


/* ==========================================================
   CHURRASQUEIRA
========================================================== */

function addChurrasqueira() {

    criarLinha(

        "churrasqueiraContainer",

        `
        <input
            type="text"
            placeholder="Apto"
            style="width:25%;"
        >

        <input
            type="text"
            placeholder="Nome do Morador"
            style="width:45%;"
        >

        <input
            type="text"
            placeholder="Data / Período"
            style="width:30%;"
        >

        <button
            type="button"
            class="remove-btn"
            onclick="
                this.parentElement.remove();
                salvarPlantao();
            "
        >
            X
        </button>
        `

    );

}


/* ==========================================================
   MUDANÇA
========================================================== */

function addMudanca() {

    criarLinha(

        "mudancaContainer",

        `
        <input
            type="text"
            placeholder="Apto"
            style="width:20%;"
        >

        <input
            type="text"
            placeholder="Nome do Morador"
            style="width:35%;"
        >

        <select style="width:20%;">

            <option value="Entrada">
                Entrada
            </option>

            <option value="Saída">
                Saída
            </option>

        </select>

        <input
            type="text"
            placeholder="Data / Horário"
            style="width:25%;"
        >

        <button
            type="button"
            class="remove-btn"
            onclick="
                this.parentElement.remove();
                salvarPlantao();
            "
        >
            X
        </button>
        `

    );

}


/* ==========================================================
   ENTREGA
========================================================== */

function addEntrega() {

    criarLinha(

        "entregasContainer",

        `
        <input
            type="text"
            placeholder="Apto"
            style="width:25%;"
        >

        <input
            type="text"
            placeholder="Nome"
            style="width:50%;"
        >

        <input
            type="number"
            placeholder="Qtd"
            style="width:25%;"
        >

        <button
            type="button"
            class="remove-btn"
            onclick="
                this.parentElement.remove();
                salvarPlantao();
            "
        >
            X
        </button>
        `

    );

}


/* ==========================================================
   CARTA
========================================================== */

function addCarta() {

    criarLinha(

        "cartasContainer",

        `
        <input
            type="text"
            placeholder="Apto"
            style="width:20%;"
        >

        <input
            type="text"
            placeholder="Nome"
            style="width:35%;"
        >

        <input
            type="number"
            placeholder="Qtd"
            style="width:15%;"
        >

        <select style="width:30%;">

            <option value="Geral">
                Outros
            </option>

            <option value="Boleto Condomínio">
                Boleto Condomínio
            </option>

            <option value="Conta de Energia">
                Conta de Energia
            </option>

        </select>

        <button
            type="button"
            class="remove-btn"
            onclick="
                this.parentElement.remove();
                salvarPlantao();
            "
        >
            X
        </button>
        `

    );

}


/* ==========================================================
   CHAVE
========================================================== */

function addChave() {

    criarLinha(

        "chavesContainer",

        `
        <input
            type="text"
            placeholder="Apto"
            style="width:25%;"
        >

        <input
            type="text"
            placeholder="Nome / Identificação"
            style="width:50%;"
        >

        <input
            type="number"
            placeholder="Qtd"
            style="width:25%;"
        >

        <button
            type="button"
            class="remove-btn"
            onclick="
                this.parentElement.remove();
                salvarPlantao();
            "
        >
            X
        </button>
        `

    );

}


/* ==========================================================
   RECOLHER
========================================================== */

function addRecolher() {

    criarLinha(

        "recolherContainer",

        `
        <input
            type="text"
            placeholder="Apto"
            style="width:20%;"
        >

        <input
            type="text"
            placeholder="Nome"
            style="width:30%;"
        >

        <input
            type="number"
            placeholder="Qtd"
            style="width:15%;"
        >

        <input
            type="text"
            placeholder="Quem vai recolher"
            style="width:35%;"
        >

        <button
            type="button"
            class="remove-btn"
            onclick="
                this.parentElement.remove();
                salvarPlantao();
            "
        >
            X
        </button>
        `

    );

}


/* ==========================================================
   LIMPAR FORMULÁRIO
========================================================== */

function limparFormulario() {

    const nome = usuarioAtual();


    if (!nome) {

        return;

    }


    const confirmar =
        confirm(

            "Deseja realmente iniciar um novo plantão?\n\n" +
            "Os dados atuais serão apagados."

        );


    if (!confirmar) {

        return;

    }


    localStorage.removeItem(
        chaveUsuario(nome)
    );


    const form =
        document.getElementById(
            "plantaoForm"
        );


    if (form) {

        form.reset();

    }


    /*
    ==============================================
    MANTÉM O PORTEIRO
    ==============================================
    */

    const porteiro =
        document.getElementById(
            "porteiroSaindo"
        );


    if (porteiro) {

        porteiro.value = nome;

    }


    /*
    ==============================================
    DATA
    ==============================================
    */

    const data =
        document.getElementById(
            "dataPlantao"
        );


    if (data) {

        data.value =
            new Date()
                .toISOString()
                .slice(0, 10);

    }


    /*
    ==============================================
    REMOVE LINHAS EXTRAS
    ==============================================
    */

    CONTAINERS_DINAMICOS.forEach(
        function (id) {

            const container =
                document.getElementById(id);

            if (!container) {

                return;

            }


            const linhas =
                container.querySelectorAll(
                    ".dynamic-row"
                );


            linhas.forEach(
                function (
                    linha,
                    indice
                ) {

                    if (indice > 0) {

                        linha.remove();

                    }

                }
            );

        }
    );


    atualizarStatus(
        "✓ Novo plantão iniciado"
    );

}


/* ==========================================================
   NOVO PLANTÃO
========================================================== */

function novoPlantao() {

    limparFormulario();

}


/* ==========================================================
   SAIR
========================================================== */

function sairSistema() {

    const confirmar =
        confirm(

            "Deseja sair do sistema?\n\n" +
            "Os dados do plantão continuarão salvos."

        );


    if (!confirmar) {

        return;

    }


    /*
    IMPORTANTE:
    NÃO APAGA O PLANTÃO
    */

    salvarPlantao();


    window.location.href =
        "index.html";

}


/* ==========================================================
   WHATSAPP
========================================================== */

function enviarWhatsapp() {

    /*
    ==============================================
    SALVA ANTES DE MONTAR A MENSAGEM
    ==============================================
    */

    salvarPlantao();


    const saindo =
        document.getElementById(
            "porteiroSaindo"
        ).value;


    const assumindo =
        document.getElementById(
            "porteiroAssumindo"
        ).value;


    const data =
        document.getElementById(
            "dataPlantao"
        ).value;


    if (
        !saindo ||
        !assumindo ||
        !data
    ) {

        alert(
            "Preencha o porteiro que está assumindo e a data."
        );

        return;

    }


    const dataFormatada =
        data
            .split("-")
            .reverse()
            .join("/");


    const ocorrencias =
        document.getElementById(
            "ocorrencias"
        ).value ||
        "Nenhuma ocorrência registrada.";


    const observacoes =
        document.getElementById(
            "observacoesGenerais"
        ).value ||
        "Sem observações gerais.";


    const observacoesPortaria =
        document.getElementById(
            "observacoesPortaria"
        ).value ||
        "Sem observações de portaria.";


    let mensagem = "";


    mensagem +=
        "📋 *PASSAGEM DE PLANTÃO - EDIFÍCIO LAGUNA HALL*\n\n";


    mensagem +=
        "📅 *Data:* " +
        dataFormatada +
        "\n";


    mensagem +=
        "👤 *Porteiro que está saindo:* " +
        saindo +
        "\n";


    mensagem +=
        "👤 *Porteiro que está assumindo:* " +
        assumindo +
        "\n\n";


    mensagem +=
        "🚨 *OCORRÊNCIAS:*\n" +
        ocorrencias +
        "\n\n";


    mensagem +=
        "📝 *OBSERVAÇÕES GERAIS:*\n" +
        observacoes +
        "\n\n";


    mensagem +=
        "🚪 *OBSERVAÇÕES DA PORTARIA:*\n" +
        observacoesPortaria +
        "\n\n";


    /* =====================================================
       PRESTADORES
    ===================================================== */

    mensagem +=
        "🛠️ *PRESTADORES DE SERVIÇO:*\n";


    let encontrou = false;


    document
        .querySelectorAll(
            "#prestadoresContainer .dynamic-row"
        )
        .forEach(
            function (linha) {

                const campos =
                    linha.querySelectorAll(
                        "input"
                    );


                if (
                    campos[0] &&
                    campos[0].value
                ) {

                    mensagem +=
                        "• " +
                        campos[0].value +
                        " - " +
                        (campos[1].value || "") +
                        " | Entrada: " +
                        (campos[2].value || "--:--") +
                        " | Saída: " +
                        (campos[3].value || "--:--") +
                        "\n";

                    encontrou = true;

                }

            }
        );


    if (!encontrou) {

        mensagem +=
            "• Nenhum prestador registrado.\n";

    }


    /* =====================================================
       SALÃO
    ===================================================== */

    mensagem +=
        "\n🎉 *SALÃO DE FESTAS:*\n";

    encontrou = false;


    document
        .querySelectorAll(
            "#salaoContainer .dynamic-row"
        )
        .forEach(
            function (linha) {

                const campos =
                    linha.querySelectorAll(
                        "input"
                    );


                if (
                    campos[0] &&
                    campos[0].value
                ) {

                    mensagem +=
                        "• Apto " +
                        campos[0].value +
                        " - " +
                        campos[1].value +
                        " - " +
                        campos[2].value +
                        "\n";

                    encontrou = true;

                }

            }
        );


    if (!encontrou) {

        mensagem +=
            "• Nenhuma reserva registrada.\n";

    }


    /* =====================================================
       CHURRASQUEIRA
    ===================================================== */

    mensagem +=
        "\n🍖 *CHURRASQUEIRA:*\n";

    encontrou = false;


    document
        .querySelectorAll(
            "#churrasqueiraContainer .dynamic-row"
        )
        .forEach(
            function (linha) {

                const campos =
                    linha.querySelectorAll(
                        "input"
                    );


                if (
                    campos[0] &&
                    campos[0].value
                ) {

                    mensagem +=
                        "• Apto " +
                        campos[0].value +
                        " - " +
                        campos[1].value +
                        " - " +
                        campos[2].value +
                        "\n";

                    encontrou = true;

                }

            }
        );


    if (!encontrou) {

        mensagem +=
            "• Nenhuma reserva registrada.\n";

    }


    /* =====================================================
       MUDANÇAS
    ===================================================== */

    mensagem +=
        "\n🚚 *MUDANÇAS AGENDADAS:*\n";

    encontrou = false;


    document
        .querySelectorAll(
            "#mudancaContainer .dynamic-row"
        )
        .forEach(
            function (linha) {

                const campos =
                    linha.querySelectorAll(
                        "input"
                    );


                const select =
                    linha.querySelector(
                        "select"
                    );


                if (
                    campos[0] &&
                    campos[0].value
                ) {

                    mensagem +=
                        "• Apto " +
                        campos[0].value +
                        " - " +
                        campos[1].value +
                        " - " +
                        (select
                            ? select.value
                            : "") +
                        " - " +
                        campos[2].value +
                        "\n";

                    encontrou = true;

                }

            }
        );


    if (!encontrou) {

        mensagem +=
            "• Nenhuma mudança agendada.\n";

    }


    /* =====================================================
       ENTREGAS
    ===================================================== */

    mensagem +=
        "\n📦 *ENTREGAS PENDENTES:*\n";

    encontrou = false;


    document
        .querySelectorAll(
            "#entregasContainer .dynamic-row"
        )
        .forEach(
            function (linha) {

                const campos =
                    linha.querySelectorAll(
                        "input"
                    );


                if (
                    campos[0] &&
                    campos[0].value
                ) {

                    mensagem +=
                        "• Apto " +
                        campos[0].value +
                        " - " +
                        campos[1].value +
                        " - " +
                        (campos[2].value || "0") +
                        " volume(s)\n";

                    encontrou = true;

                }

            }
        );


    if (!encontrou) {

        mensagem +=
            "• Nenhuma entrega pendente.\n";

    }


    /* =====================================================
       CARTAS
    ===================================================== */

    mensagem +=
        "\n✉️ *CARTAS E ENVELOPES:*\n";

    encontrou = false;


    document
        .querySelectorAll(
            "#cartasContainer .dynamic-row"
        )
        .forEach(
            function (linha) {

                const campos =
                    linha.querySelectorAll(
                        "input"
                    );


                const select =
                    linha.querySelector(
                        "select"
                    );


                if (
                    campos[0] &&
                    campos[0].value
                ) {

                    mensagem +=
                        "• Apto " +
                        campos[0].value +
                        " - " +
                        campos[1].value +
                        " - " +
                        (campos[2].value || "0") +
                        " unidade(s) - " +
                        (select
                            ? select.value
                            : "") +
                        "\n";

                    encontrou = true;

                }

            }
        );


    if (!encontrou) {

        mensagem +=
            "• Nenhuma carta registrada.\n";

    }


    /* =====================================================
       CHAVES
    ===================================================== */

    mensagem +=
        "\n🔑 *CHAVES NA PORTARIA:*\n";

    encontrou = false;


    document
        .querySelectorAll(
            "#chavesContainer .dynamic-row"
        )
        .forEach(
            function (linha) {

                const campos =
                    linha.querySelectorAll(
                        "input"
                    );


                if (
                    campos[0] &&
                    campos[0].value
                ) {

                    mensagem +=
                        "• " +
                        campos[0].value +
                        " - " +
                        campos[1].value +
                        " - " +
                        (campos[2].value || "0") +
                        " unidade(s)\n";

                    encontrou = true;

                }

            }
        );


    if (!encontrou) {

        mensagem +=
            "• Nenhuma chave registrada.\n";

    }


    /* =====================================================
       RECOLHER
    ===================================================== */

    mensagem +=
        "\n📦 *ENCOMENDAS PARA RECOLHER:*\n";

    encontrou = false;


    document
        .querySelectorAll(
            "#recolherContainer .dynamic-row"
        )
        .forEach(
            function (linha) {

                const campos =
                    linha.querySelectorAll(
                        "input"
                    );


                if (
                    campos[0] &&
                    campos[0].value
                ) {

                    mensagem +=
                        "• Apto " +
                        campos[0].value +
                        " - " +
                        campos[1].value +
                        " - " +
                        (campos[2].value || "0") +
                        " volume(s) - " +
                        "Quem recolhe: " +
                        campos[3].value +
                        "\n";

                    encontrou = true;

                }

            }
        );


    if (!encontrou) {

        mensagem +=
            "• Nenhuma encomenda agendada.\n";

    }


    /* =====================================================
       FINAL
    ===================================================== */

    mensagem +=
        "\n✨ *Desejo um excelente plantão!*\n";


    mensagem +=
        "\nGer Santos Desenvolvimento Web";


    /*
    ==============================================
    ABRE WHATSAPP
    ==============================================
    */

    const url =
        "https://api.whatsapp.com/send?text=" +
        encodeURIComponent(mensagem);


    window.open(
        url,
        "_blank"
    );


    /*
    ==============================================
    SOMENTE DEPOIS PERGUNTA SE DESEJA FINALIZAR
    ==============================================
    */

    setTimeout(
        function () {

            const finalizar =
                confirm(

                    "O WhatsApp foi aberto.\n\n" +

                    "Depois de enviar a mensagem, " +
                    "deseja finalizar este plantão " +
                    "e apagar os dados?"

                );


            if (finalizar) {

                finalizarPlantao();

            }

        },
        1000
    );

}


/* ==========================================================
   FINALIZAR PLANTÃO
========================================================== */

function finalizarPlantao() {

    const nome = usuarioAtual();


    if (!nome) {

        return;

    }


    /*
    ==============================================
    AGORA SIM APAGA
    ==============================================
    */

    localStorage.removeItem(
        chaveUsuario(nome)
    );


    const form =
        document.getElementById(
            "plantaoForm"
        );


    if (form) {

        form.reset();

    }


    /*
    ==============================================
    MANTÉM O PORTEIRO QUE ESTÁ SAINDO
    ==============================================
    */

    const porteiro =
        document.getElementById(
            "porteiroSaindo"
        );


    if (porteiro) {

        porteiro.value = nome;

    }


    /*
    ==============================================
    DATA ATUAL
    ==============================================
    */

    const data =
        document.getElementById(
            "dataPlantao"
        );


    if (data) {

        data.value =
            new Date()
                .toISOString()
                .slice(0, 10);

    }


    /*
    ==============================================
    REMOVE LINHAS EXTRAS
    ==============================================
    */

    CONTAINERS_DINAMICOS.forEach(
        function (id) {

            const container =
                document.getElementById(id);

            if (!container) {

                return;

            }


            const linhas =
                container.querySelectorAll(
                    ".dynamic-row"
                );


            linhas.forEach(
                function (
                    linha,
                    indice
                ) {

                    if (indice > 0) {

                        linha.remove();

                    }

                }
            );

        }
    );


    atualizarStatus(
        "✓ Plantão finalizado e zerado"
    );


    alert(

        "Plantão finalizado!\n\n" +
        "Todos os dados foram apagados."

    );

}