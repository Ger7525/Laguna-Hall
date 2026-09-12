// Configuração de permissões por colaborador
const USUARIOS_PERMISSOES = {
    "Germano Santos": { role: "porteiro", defaultPage: "plantao.html" },
    "Jonas Paulo": { role: "porteiro", defaultPage: "plantao.html" },
    "Alexandre Florêncio": { role: "porteiro", defaultPage: "plantao.html" },
    "Luiz Carlos": { role: "porteiro", defaultPage: "plantao.html" },
    "Cícero": { role: "zelador", defaultPage: "materiais.html" }
};

function iniciarSessao(event) {
    if (event) event.preventDefault();
    const select = document.getElementById("selectUsuarioLogin");
    const nome = select ? select.value : "";

    if (!nome || !USUARIOS_PERMISSOES[nome]) {
        alert("Por favor, selecione um colaborador!");
        return;
    }

    const usuario = USUARIOS_PERMISSOES[nome];
    localStorage.setItem("usuarioLogado", nome);
    localStorage.setItem("usuarioRole", usuario.role);

    window.location.href = usuario.defaultPage;
}

function fazerLogout() {
    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("usuarioRole");
    window.location.href = "index.html";
}

function validarPermissaoPagina() {
    const nome = localStorage.getItem("usuarioLogado");
    const role = localStorage.getItem("usuarioRole");
    const paginaAtual = window.location.pathname.split("/").pop();

    if (paginaAtual === "index.html" || paginaAtual === "") return;

    if (!nome || !role) {
        window.location.href = "index.html";
        return;
    }

    // Exibe o nome do operador no cabeçalho
    const elemOperador = document.getElementById("nomeOperador");
    if (elemOperador) elemOperador.innerText = `${nome}`;

    // Monta o menu de navegação e valida acessos
    const navMenu = document.getElementById("menuNavegacao");
    if (navMenu) {
        if (role === "porteiro") {
            navMenu.innerHTML = `
                <a href="plantao.html" class="${paginaAtual === 'plantao.html' ? 'active' : ''}">📋 Plantão</a>
                <a href="encomendas.html" class="${paginaAtual === 'encomendas.html' ? 'active' : ''}">📦 Encomendas</a>
            `;
            // Bloqueio se porteiro tentar acessar materiais
            if (paginaAtual === "materiais.html") {
                alert("Acesso restrito ao Zelador!");
                window.location.href = "plantao.html";
            }
        } else if (role === "zelador") {
            navMenu.innerHTML = `
                <a href="materiais.html" class="${paginaAtual === 'materiais.html' ? 'active' : ''}">🧹 Materiais</a>
            `;
            // Bloqueio se zelador tentar acessar plantão ou encomendas
            if (paginaAtual === "plantao.html" || paginaAtual === "encomendas.html") {
                alert("Acesso restrito à Zeladoria!");
                window.location.href = "materiais.html";
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", validarPermissaoPagina);