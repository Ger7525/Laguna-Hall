// ================================================
// INICIALIZAÇÃO E SESSÃO
// ================================================
document.addEventListener('DOMContentLoaded', () => {
    carregarUsuario();
    definirDataAtual();
    carregarDadosSalvos();
    configurarAutoSave();
});

function carregarUsuario() {
    const usuarioLogado = localStorage.getItem('usuarioLogado') || 'Germano Santos';
    
    document.getElementById('usuarioAtual').innerText = usuarioLogado;
    document.getElementById('usuarioAtualTexto').innerText = usuarioLogado;
    document.getElementById('porteiroSaindo').value = usuarioLogado;
}

function definirDataAtual() {
    const inputData = document.getElementById('dataPlantao');
    if (!inputData.value) {
        const hoje = new Date().toISOString().split('T')[0];
        inputData.value = hoje;
    }
}

// ================================================
// GERADORES DE LINHAS DINÂMICAS COM SUPORTE A DADOS SALVOS
// ================================================
function criarBotaoRemover() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'remove-btn';
    btn.innerText = '✕';
    btn.onclick = function() {
        this.parentElement.remove();
        salvarDadosLocais();
    };
    return btn;
}

function addPrestador(val = {}) {
    const container = document.getElementById('prestadoresContainer');
    const row = document.createElement('div');
    row.className = 'dynamic-row';
    row.innerHTML = `
        <input type="text" placeholder="Nome / Empresa" style="width:30%;" value="${val.nome || ''}">
        <input type="text" placeholder="Serviço Realizado" style="width:35%;" value="${val.servico || ''}">
        <input type="time" title="Horário de Entrada" style="width:15%;" value="${val.entrada || ''}">
        <input type="time" title="Horário de Saída" style="width:15%;" value="${val.saida || ''}">
    `;
    row.appendChild(criarBotaoRemover());
    container.appendChild(row);
}

function addEntrega(val = {}) {
    const container = document.getElementById('entregasContainer');
    const row = document.createElement('div');
    row.className = 'dynamic-row';
    row.innerHTML = `
        <input type="text" placeholder="Apto" style="width:20%;" value="${val.apto || ''}">
        <input type="text" placeholder="Nome" style="width:50%;" value="${val.nome || ''}">
        <input type="number" placeholder="Qtd" style="width:20%;" value="${val.qtd || ''}">
    `;
    row.appendChild(criarBotaoRemover());
    container.appendChild(row);
}

function addCarta(val = {}) {
    const container = document.getElementById('cartasContainer');
    const row = document.createElement('div');
    row.className = 'dynamic-row';
    const tipoVal = val.tipo || 'Geral';
    row.innerHTML = `
        <input type="text" placeholder="Apto" style="width:18%;" value="${val.apto || ''}">
        <input type="text" placeholder="Nome" style="width:32%;" value="${val.nome || ''}">
        <input type="number" placeholder="Qtd" style="width:15%;" value="${val.qtd || ''}">
        <select style="width:25%;">
            <option value="Geral" ${tipoVal === 'Geral' ? 'selected' : ''}>Outros</option>
            <option value="Boleto Condomínio" ${tipoVal === 'Boleto Condomínio' ? 'selected' : ''}>Boleto Condomínio</option>
            <option value="Conta de Energia" ${tipoVal === 'Conta de Energia' ? 'selected' : ''}>Conta de Energia</option>
        </select>
    `;
    row.appendChild(criarBotaoRemover());
    container.appendChild(row);
}

function addChave(val = {}) {
    const container = document.getElementById('chavesContainer');
    const row = document.createElement('div');
    row.className = 'dynamic-row';
    row.innerHTML = `
        <input type="text" placeholder="Apto" style="width:20%;" value="${val.apto || ''}">
        <input type="text" placeholder="Nome / Identificação" style="width:50%;" value="${val.nome || ''}">
        <input type="number" placeholder="Qtd" style="width:20%;" value="${val.qtd || ''}">
    `;
    row.appendChild(criarBotaoRemover());
    container.appendChild(row);
}

function addRecolher(val = {}) {
    const container = document.getElementById('recolherContainer');
    const row = document.createElement('div');
    row.className = 'dynamic-row';
    row.innerHTML = `
        <input type="text" placeholder="Apto" style="width:18%;" value="${val.apto || ''}">
        <input type="text" placeholder="Nome" style="width:27%;" value="${val.nome || ''}">
        <input type="number" placeholder="Qtd" style="width:15%;" value="${val.qtd || ''}">
        <input type="text" placeholder="Quem vai recolher" style="width:30%;" value="${val.retira || ''}">
    `;
    row.appendChild(criarBotaoRemover());
    container.appendChild(row);
}

// ================================================
// PERSISTÊNCIA CONTINUA (SALVA ATÉ SAIR)
// ================================================
function configurarAutoSave() {
    document.getElementById('plantaoForm').addEventListener('input', () => {
        salvarDadosLocais();
    });
    document.getElementById('plantaoForm').addEventListener('change', () => {
        salvarDadosLocais();
    });
}

function extrairLinhas(containerId) {
    const rows = document.querySelectorAll(`#${containerId} .dynamic-row`);
    const lista = [];
    rows.forEach(row => {
        const inputs = row.querySelectorAll('input, select');
        const valores = Array.from(inputs).map(i => i.value);
        lista.push(valores);
    });
    return lista;
}

function salvarDadosLocais() {
    const dados = {
        porteiroAssumindo: document.getElementById('porteiroAssumindo').value,
        dataPlantao: document.getElementById('dataPlantao').value,
        ocorrencias: document.getElementById('ocorrencias').value,
        observacoesGenerais: document.getElementById('observacoesGenerais').value,
        observacoesPortaria: document.getElementById('observacoesPortaria').value,
        
        prestadores: extrairLinhas('prestadoresContainer'),
        entregas: extrairLinhas('entregasContainer'),
        cartas: extrairLinhas('cartasContainer'),
        chaves: extrairLinhas('chavesContainer'),
        recolher: extrairLinhas('recolherContainer')
    };
    
    localStorage.setItem('draft_plantao', JSON.stringify(dados));
    
    const status = document.getElementById('saveStatus');
    status.innerText = '💾 Salvo';
    setTimeout(() => { status.innerText = '✓ Sistema pronto'; }, 1500);
}

function carregarDadosSalvos() {
    const salvo = localStorage.getItem('draft_plantao');
    if (!salvo) return;

    const dados = JSON.parse(salvo);

    if (dados.porteiroAssumindo) document.getElementById('porteiroAssumindo').value = dados.porteiroAssumindo;
    if (dados.dataPlantao) document.getElementById('dataPlantao').value = dados.dataPlantao;
    if (dados.ocorrencias) document.getElementById('ocorrencias').value = dados.ocorrencias;
    if (dados.observacoesGenerais) document.getElementById('observacoesGenerais').value = dados.observacoesGenerais;
    if (dados.observacoesPortaria) document.getElementById('observacoesPortaria').value = dados.observacoesPortaria;

    if (dados.prestadores) {
        dados.prestadores.forEach(p => addPrestador({ nome: p[0], servico: p[1], entrada: p[2], saida: p[3] }));
    }
    if (dados.entregas) {
        dados.entregas.forEach(e => addEntrega({ apto: e[0], nome: e[1], qtd: e[2] }));
    }
    if (dados.cartas) {
        dados.cartas.forEach(c => addCarta({ apto: c[0], nome: c[1], qtd: c[2], tipo: c[3] }));
    }
    if (dados.chaves) {
        dados.chaves.forEach(k => addChave({ apto: k[0], nome: k[1], qtd: k[2] }));
    }
    if (dados.recolher) {
        dados.recolher.forEach(r => addRecolher({ apto: r[0], nome: r[1], qtd: r[2], retira: r[3] }));
    }
}

// ================================================
// ENVIO DE MENSAGEM PARA WHATSAPP
// ================================================
function enviarWhatsapp() {
    const saindo = document.getElementById('porteiroSaindo').value;
    const assumindo = document.getElementById('porteiroAssumindo').value;
    const data = document.getElementById('dataPlantao').value;

    if (!assumindo) {
        alert('Por favor, informe o porteiro que está assumindo.');
        document.getElementById('porteiroAssumindo').focus();
        return;
    }

    let msg = `📋 *PASSAGEM DE PLANTÃO - LAGUNA HALL*\n`;
    msg += `📅 *Data:* ${data}\n`;
    msg += `👤 *Saindo:* ${saindo}\n`;
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
            const linhaFormatada = formatador(Array.from(inputs).map(i => i.value));
            if (linhaFormatada) textoBloco += ` • ${linhaFormatada}\n`;
        });
        if (textoBloco) msg += `*${titulo}:*\n${textoBloco}\n`;
    };

    processarBloco('prestadoresContainer', '🔧 Prestadores de Serviço', vals => vals[0] ? `${vals[0]} - ${vals[1]} (${vals[2] || '?' } às ${vals[3] || '?'})` : null);
    processarBloco('entregasContainer', '📬 Entregas Pendentes', vals => vals[0] ? `Apto ${vals[0]} - ${vals[1]} (${vals[2]} vol)` : null);
    processarBloco('cartasContainer', '✉️ Cartas/Envelopes', vals => vals[0] ? `Apto ${vals[0]} - ${vals[1]} (${vals[2]}x ${vals[3]})` : null);
    processarBloco('chavesContainer', '🔑 Chaves na Portaria', vals => vals[0] ? `Apto ${vals[0]} - ${vals[1]} (${vals[2]} chave(s))` : null);
    processarBloco('recolherContainer', '🚛 Encomendas a Recolher', vals => vals[0] ? `Apto ${vals[0]} - ${vals[1]} (${vals[2]} vol) -> Retira: ${vals[3]}` : null);

    const foneNumero = ""; // Insira o número com DDD se desejar fixar destinatário
    const url = `https://api.whatsapp.com/send?phone=${foneNumero}&text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
}

// ================================================
// ENCERRAMENTO E LIMPEZA DE DADOS
// ================================================
function limparFormulario() {
    document.getElementById('plantaoForm').reset();
    document.querySelectorAll('.dynamic-container').forEach(container => container.innerHTML = '');
    localStorage.removeItem('draft_plantao');
    carregarUsuario();
    definirDataAtual();
}

function novoPlantao() {
    if (confirm('Deseja iniciar um novo plantão? Isso limpará os dados salvos do relatório atual.')) {
        limparFormulario();
    }
}

function sairSistema() {
    if (confirm('Deseja encerrar a sessão? Todos os dados gravados serão apagados.')) {
        limparFormulario();
        localStorage.removeItem('usuarioLogado');
        window.location.reload();
    }
}