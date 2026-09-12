document.addEventListener("DOMContentLoaded", () => {
    // Carrega 3 linhas iniciais por padrão
    adicionarLinhaMaterial();
    adicionarLinhaMaterial();
    adicionarLinhaMaterial();
});

function adicionarLinhaMaterial() {
    const container = document.getElementById('listaMateriaisContainer');
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'material-row';

    div.innerHTML = `
        <input type="text" placeholder="Nome / Descrição do Item" class="item-nome" style="flex: 2;">
        <input type="text" placeholder="Qtd / Unidade (ex: 3 galões)" class="item-qtd" style="flex: 1;">
        <button type="button" class="btn btn-danger" onclick="this.parentElement.remove()" style="padding: 8px 12px;">✕</button>
    `;

    container.appendChild(div);
}

function enviarPedidoMateriais() {
    const zelador = localStorage.getItem("usuarioLogado") || "Cícero (Zelador)";
    const numeroTelefone = document.getElementById("numeroWhatsappDestino").value.replace(/\D/g, "");

    const linhas = document.querySelectorAll('#listaMateriaisContainer .material-row');
    let listaTexto = "";
    let contador = 0;

    linhas.forEach(linha => {
        const nome = linha.querySelector('.item-nome').value.trim();
        const qtd = linha.querySelector('.item-qtd').value.trim();

        if (nome !== "") {
            contador++;
            listaTexto += `• *${nome}* — Quantidade: ${qtd || '1'}\n`;
        }
    });

    if (contador === 0) {
        alert("Adicione pelo menos um material à lista!");
        return;
    }

    let msg = `🧹 *SOLICITAÇÃO DE MATERIAIS DE LIMPEZA*\n`;
    msg += `🏢 *Edifício Laguna Hall - Zeladoria*\n\n`;
    msg += `👤 *Solicitante:* ${zelador}\n`;
    msg += `📅 *Data:* ${new Date().toLocaleDateString('pt-BR')}\n\n`;
    msg += `📝 *RELAÇÃO DOS MATERIAIS:*\n${listaTexto}\n`;
    msg += `Por gentileza, providenciar a compra dos itens acima.`;

    // Se o número for especificado, envia direto para ele; senão abre o seletor do WhatsApp
    let urlWhatsapp = "";
    if (numeroTelefone.length >= 10) {
        urlWhatsapp = `https://api.whatsapp.com/send?phone=55${numeroTelefone}&text=${encodeURIComponent(msg)}`;
    } else {
        urlWhatsapp = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    }

    window.open(urlWhatsapp, '_blank');
}