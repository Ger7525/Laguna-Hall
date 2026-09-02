// ================================================
// SISTEMA DE PASSAGEM DE PLANTÃO - LÓGICA PRINCIPAL
// ================================================

document.addEventListener('DOMContentLoaded', () => {
    // Define a data atual por padrão no campo de data (YYYY-MM-DD)
    const hoje = new Date().toISOString().split('T')[0];
    const inputData = document.getElementById('dataPlantao');
    if (inputData && !inputData.value) {
        inputData.value = hoje;
    }

    // Verifica se já existe uma sessão ativa
    verificarSessao();
});

// Lógica de Autenticação / Login Local
function iniciarSessao() {
    const select = document.getElementById('selectPorteiroLogin');
    const nome = select ? select.value : '';

    if (!nome) {
        alert('Por favor, selecione seu nome para continuar.');
        return;
    }

    // Salva na memória do navegador
    sessionStorage.setItem('operadorAtivo', nome);
    carregarInterface(nome);
}

function verificarSessao() {
    const operador = sessionStorage.getItem('operadorAtivo');
    if (operador) {
        carregarInterface(operador);
    }
}

function carregarInterface(nome) {
    // Esconde o Login e Exibe o Sistema
    const modalLogin = document.getElementById('modalLogin');
    const conteudoSistema = document.getElementById('conteudoSistema');
    
    if (modalLogin) modalLogin.classList.add('hidden');
    if (conteudoSistema) conteudoSistema.classList.remove('hidden');

    // Preenche a identificação do operador no topo
    const elNomeOperador = document.getElementById('nomeOperador');
    if (elNomeOperador) elNomeOperador.innerText = nome;

    // Preenche e deixa O CAMPO EDITÁVEL para alterações
    const inputAssumindo = document.getElementById('porteiroAssumindo');
    if (inputAssumindo) {
        inputAssumindo.value = nome;
        inputAssumindo.removeAttribute('disabled');
        inputAssumindo.removeAttribute('readonly');
    }

    // Carrega rascunho anterior se houver
    carregarRascunho();
}

function trocarOperador() {
    if (confirm('Deseja encerrar a sessão do operador atual?')) {
        sessionStorage.removeItem('operadorAtivo');
        location.reload();
    }
}

// Funções para adicionar linhas dinâmicas
function criarLinhaRemovivel(htmlConteudo) {
    const div = document.createElement('div');
    div.className = 'dynamic-row';
    div.innerHTML = `${htmlConteudo} <button type="button" class="remove-btn" onclick="this.parentElement.remove()">✕</button>`;
    return div;
}

function adicionarPrestador() {
    const html = `
        <input type="text" placeholder="Nome do Prestador / Empresa" style="flex: 2;">
        <input type="text" placeholder="Serviço Realizado" style="flex: 2;">
        <input type="time" title="Entrada" style="flex: 1;">
        <input type="time" title="Saída" style="flex: 1;">
    `;
    document.getElementById('prestadoresContainer').appendChild(criarLinhaRemovivel(html));
}

function adicionarEntrega() {
    const html = `
        <input type="text" placeholder="Apto/Bloco" style="flex: 1;">
        <input type="text" placeholder="Descrição (Ex: Amazon/Mercado Livre)" style="flex: 3;">
        <input type="number" placeholder="Qtd" value="1" style="flex: 1;">
    `;
    document.getElementById('entregasContainer').appendChild(criarLinhaRemovivel(html));
}

function adicionarCarta() {
    const html = `
        <input type="text" placeholder="Apto/Bloco" style="flex: 1;">
        <input type="text" placeholder="Destinatário / Descrição" style="flex: 3;">
        <input type="number" placeholder="Qtd" value="1" style="flex: 1;">
        <select style="flex: 1.5;">
            <option value="Simples">Simples</option>
            <option value="Registrada">Registrada</option>
        </select>
    `;
    document.getElementById('cartasContainer').appendChild(criarLinhaRemovivel(html));
}

function adicionarChave() {
    const html = `
        <input type="text" placeholder="Apto/Ambiente" style="flex: 2;">
        <input type="text" placeholder="Identificação da Chave" style="flex: 3;">
        <input type="number" placeholder="Qtd" value="1" style="flex: 1;">
    `;
    document.getElementById('chavesContainer').appendChild(criarLinhaRemovivel(html));
}

function adicionarRecolher() {
    const html = `
        <input type="text" placeholder="Apto/Bloco" style="flex: 1;">
        <input type="text" placeholder="Item a Recolher" style="flex: 2;">
        <input type="number" placeholder="Qtd" value="1" style="flex: 1;">
        <input type="text" placeholder="Quem Retira" style="flex: 2;">
    `;
    document.getElementById('recolherContainer').appendChild(criarLinhaRemovivel(html));
}

// ================================================
// MONTAGEM E ENVIO DO RELATÓRIO VIA WHATSAPP
// ================================================
function enviarWhatsapp() {
    // Captura os valores digitados no momento do clique
    const elSaindo = document.getElementById('porteiroSaindo');
    const elAssumindo = document.getElementById('porteiroAssumindo');
    const elData = document.getElementById('dataPlantao');

    const saindo = elSaindo ? elSaindo.value.trim() : '';
    const assumindo = elAssumindo ? elAssumindo.value.trim() : '';
    const dataInput = elData ? elData.value : '';

    // Formatação segura de Data (DD/MM/AAAA)
    let dataFormatada = '';
    if (dataInput) {
        const partes = dataInput.split('-');
        if (partes.length === 3) {
            dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
        }
    }

    if (!assumindo) {
        alert('Por favor, informe o porteiro que está assumindo.');
        return;
    }

    // Montagem do texto final
    let msg = `📋 *PASSAGEM DE PLANTÃO - LAGUNA HALL*\n`;
    msg += `📅 *Data:* ${dataFormatada || 'Não informada'}\n`;
    msg += `👤 *Saindo:* ${saindo || 'Não informado'}\n`;
    msg += `👤 *Assumindo:* ${assumindo}\n\n`;

    const ocorrencias = document.getElementById('ocorrencias').value.trim();
    if (ocorrencias) msg += `⚠️ *Ocorrências:*\n${ocorrencias}\n\n`;

    const obsGerais = document.getElementById('observacoesGenerais').value.trim();
    if (obsGerais) msg += `📝 *Observações Gerais:*\n${obsGerais}\n\n`;

    const obsPortaria = document.getElementById('observacoesPortaria').value.trim();
    if (obsPortaria) msg += `📌 *Observações Portaria:*\n${obsPortaria}\n\n`;

    const processarBloco = (containerId, titulo, formatador) => {
        const rows = document.querySelectorAll(`#${containerId} .dynamic-row`);
        let textoBloco = '';
        rows.forEach(row => {
            const inputs = row.querySelectorAll('input, select');
            const vals = Array.from(inputs).map(i => i.value.trim());
            const linhaFormatada = formatador(vals);
            if (linhaFormatada) textoBloco += ` • ${linhaFormatada}\n`;
        });
        if (textoBloco) msg += `*${titulo}:*\n${textoBloco}\n`;
    };

    processarBloco('prestadoresContainer', '🔧 Prestadores de Serviço', vals => vals[0] ? `${vals[0]} - ${vals[1]} (${vals[2] || '?'} às ${vals[3] || '?'})` : null);
    processarBloco('entregasContainer', '📬 Entregas Pendentes', vals => vals[0] ? `Apto ${vals[0]} - ${vals[1]} (${vals[2] || '1'} vol)` : null);
    processarBloco('cartasContainer', '✉️ Cartas/Envelopes', vals => vals[0] ? `Apto ${vals[0]} - ${vals[1]} (${vals[2] || '1'}x ${vals[3]})` : null);
    processarBloco('chavesContainer', '🔑 Chaves na Portaria', vals => vals[0] ? `Apto ${vals[0]} - ${vals[1]} (${vals[2] || '1'} chave(s))` : null);
    processarBloco('recolherContainer', '🚛 Encomendas a Recolher', vals => vals[0] ? `Apto ${vals[0]} - ${vals[1]} (${vals[2] || '1'} vol) -> Retira: ${vals[3] || 'Não especificado'}` : null);

    const foneNumero = "";
    const url = `https://api.whatsapp.com/send?phone=${foneNumero}&text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
}

// Persistência em Rascunho
function salvarRascunho() {
    const dados = {
        data: document.getElementById('dataPlantao').value,
        saindo: document.getElementById('porteiroSaindo').value,
        assumindo: document.getElementById('porteiroAssumindo').value,
        ocorrencias: document.getElementById('ocorrencias').value,
        obsGerais: document.getElementById('observacoesGenerais').value,
        obsPortaria: document.getElementById('observacoesPortaria').value
    };
    localStorage.setItem('rascunhoPlantao', JSON.stringify(dados));
    const badge = document.getElementById('statusSalvo');
    if (badge) {
        badge.innerText = 'Rascunho salvo!';
        setTimeout(() => badge.innerText = '', 3000);
    }
}

function carregarRascunho() {
    const salvo = localStorage.getItem('rascunhoPlantao');
    if (salvo) {
        const dados = JSON.parse(salvo);
        if (dados.data) document.getElementById('dataPlantao').value = dados.data;
        if (dados.saindo) document.getElementById('porteiroSaindo').value = dados.saindo;
        if (dados.assumindo) document.getElementById('porteiroAssumindo').value = dados.assumindo;
        if (dados.ocorrencias) document.getElementById('ocorrencias').value = dados.ocorrencias;
        if (dados.obsGerais) document.getElementById('observacoesGenerais').value = dados.obsGerais;
        if (dados.obsPortaria) document.getElementById('observacoesPortaria').value = dados.obsPortaria;
    }
}