const STORAGE_KEY_PLANTAO_ESTADO = "estado_plantao_laguna";

document.addEventListener("DOMContentLoaded", () => {
    // 1. Data padrão de hoje (se ainda não houver data salva)
    const elData = document.getElementById('dataPlantao');
    if (elData && !elData.value) {
        elData.value = new Date().toISOString().split('T')[0];
    }

    // 2. Restaura todos os dados salvos previamente
    carregarEstadoSalvo();

    // 3. Adiciona ouvintes para salvar inputs e textareas em tempo real enquanto digita
    const seletoresCampos = [
        '#dataPlantao', 
        '#porteiroSaindo', 
        '#porteiroAssumindo',
        '#enc-titulo', 
        '#enc-texto',
        '#prest-titulo', 
        '#prest-texto',
        '#outros-titulo', 
        '#outros-texto'
    ];

    seletoresCampos.forEach(seletor => {
        const campo = document.querySelector(seletor);
        if (campo) {
            campo.addEventListener('input', salvarEstadoAtual);
            campo.addEventListener('change', salvarEstadoAtual);
        }
    });
});

// Atualiza o contador de caracteres e salva o estado
function atualizarContador(textareaId, countId) {
    const textarea = document.getElementById(textareaId);
    const countDisplay = document.getElementById(countId);
    if (textarea && countDisplay) {
        countDisplay.textContent = `${textarea.value.length} / 1000 caracteres`;
    }
    salvarEstadoAtual();
}

// Salva todo o formulário (campos e listas) no localStorage
function salvarEstadoAtual() {
    const estado = {
        dataPlantao: document.getElementById('dataPlantao')?.value || '',
        porteiroSaindo: document.getElementById('porteiroSaindo')?.value || '',
        porteiroAssumindo: document.getElementById('porteiroAssumindo')?.value || '',
        
        // Rascunhos dos campos de entrada
        encTitulo: document.getElementById('enc-titulo')?.value || '',
        encTexto: document.getElementById('enc-texto')?.value || '',
        prestTitulo: document.getElementById('prest-titulo')?.value || '',
        prestTexto: document.getElementById('prest-texto')?.value || '',
        outrosTitulo: document.getElementById('outros-titulo')?.value || '',
        outrosTexto: document.getElementById('outros-texto')?.value || '',

        // Listas de registros adicionados
        encomendas: extrairDadosLista('lista-encomendas'),
        prestadores: extrairDadosLista('lista-prestadores'),
        outros: extrairDadosLista('lista-outros')
    };

    localStorage.setItem(STORAGE_KEY_PLANTAO_ESTADO, JSON.stringify(estado));
}

// Carrega os dados persistidos de volta para a tela
function carregarEstadoSalvo() {
    const dadosSalvos = localStorage.getItem(STORAGE_KEY_PLANTAO_ESTADO);
    if (!dadosSalvos) return;

    try {
        const estado = JSON.parse(dadosSalvos);

        if (estado.dataPlantao) document.getElementById('dataPlantao').value = estado.dataPlantao;
        if (estado.porteiroSaindo) document.getElementById('porteiroSaindo').value = estado.porteiroSaindo;
        if (estado.porteiroAssumindo) document.getElementById('porteiroAssumindo').value = estado.porteiroAssumindo;

        // Preenche rascunhos de texto
        if (estado.encTitulo) document.getElementById('enc-titulo').value = estado.encTitulo;
        if (estado.encTexto) document.getElementById('enc-texto').value = estado.encTexto;
        if (estado.prestTitulo) document.getElementById('prest-titulo').value = estado.prestTitulo;
        if (estado.prestTexto) document.getElementById('prest-texto').value = estado.prestTexto;
        if (estado.outrosTitulo) document.getElementById('outros-titulo').value = estado.outrosTitulo;
        if (estado.outrosTexto) document.getElementById('outros-texto').value = estado.outrosTexto;

        // Atualiza contadores
        atualizarContadorVisual('enc-texto', 'enc-count');
        atualizarContadorVisual('prest-texto', 'prest-count');
        atualizarContadorVisual('outros-texto', 'outros-count');

        // Reconstrução das listas adicionadas
        reconstruirLista('lista-encomendas', estado.encomendas);
        reconstruirLista('lista-prestadores', estado.prestadores);
        reconstruirLista('lista-outros', estado.outros);

    } catch (e) {
        console.error("Erro ao carregar estado do plantão:", e);
    }
}

// Auxiliar para extrair dados das listas <ul>
function extrairDadosLista(ulId) {
    const itens = [];
    const elementosLi = document.querySelectorAll(`#${ulId} li`);
    
    elementosLi.forEach(li => {
        const span = li.querySelector('.item-conteudo');
        if (span) {
            const forte = span.querySelector('strong');
            const titulo = forte ? forte.innerText.replace(':', '').trim() : '';
            
            // Remove o texto do <strong> para capturar apenas a descrição
            let texto = span.innerText;
            if (forte) {
                texto = texto.replace(forte.innerText, '').trim();
            }
            
            itens.push({ titulo, texto });
        }
    });
    return itens;
}

// Auxiliar para re-inserir os itens salvos nas listas do HTML
function reconstruirLista(ulId, listaItens) {
    const ul = document.getElementById(ulId);
    if (!ul || !Array.isArray(listaItens)) return;

    ul.innerHTML = '';
    listaItens.forEach(item => {
        const li = document.createElement('li');
        const rotulo = item.titulo ? `<strong>${item.titulo}:</strong> ` : '';
        li.innerHTML = `<span class="item-conteudo">${rotulo}${item.texto}</span>`;

        const btnRemover = document.createElement('button');
        btnRemover.textContent = '✕';
        btnRemover.className = 'btn-del';
        btnRemover.onclick = () => {
            li.remove();
            salvarEstadoAtual();
        };

        li.appendChild(btnRemover);
        ul.appendChild(li);
    });
}

// Função de adicionar registros das seções
function adicionarRegistro(inputId, textareaId, ulId) {
    const input = document.getElementById(inputId);
    const textarea = document.getElementById(textareaId);
    const ul = document.getElementById(ulId);

    const titulo = input.value.trim();
    const texto = textarea.value.trim();

    if (texto === '' && titulo === '') {
        alert('Preencha ao menos um campo para adicionar!');
        return;
    }

    const li = document.createElement('li');
    const rotulo = titulo ? `<strong>${titulo}:</strong> ` : '';
    li.innerHTML = `<span class="item-conteudo">${rotulo}${texto}</span>`;

    const btnRemover = document.createElement('button');
    btnRemover.textContent = '✕';
    btnRemover.className = 'btn-del';
    btnRemover.onclick = () => {
        li.remove();
        salvarEstadoAtual();
    };

    li.appendChild(btnRemover);
    ul.appendChild(li);

    input.value = '';
    textarea.value = '';

    const countId = textareaId === 'enc-texto' ? 'enc-count' : textareaId === 'prest-texto' ? 'prest-count' : 'outros-count';
    atualizarContadorVisual(textareaId, countId);

    // Salva o novo estado atualizado
    salvarEstadoAtual();
}

// Auxiliar apenas visual para contador de caracteres
function atualizarContadorVisual(textareaId, countId) {
    const textarea = document.getElementById(textareaId);
    const countDisplay = document.getElementById(countId);
    if (textarea && countDisplay) {
        countDisplay.textContent = `${textarea.value.length} / 1000 caracteres`;
    }
}

// Limpa completamente o formulário e apaga do localStorage
function limparFormulario() {
    if (confirm("Tem certeza que deseja limpar todos os campos e registros do plantão?")) {
        document.getElementById('porteiroSaindo').value = '';
        document.getElementById('porteiroAssumindo').value = '';

        ['enc-titulo', 'enc-texto', 'prest-titulo', 'prest-texto', 'outros-titulo', 'outros-texto'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });

        ['enc-count', 'prest-count', 'outros-count'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = '0 / 1000 caracteres';
        });

        document.getElementById('lista-encomendas').innerHTML = '';
        document.getElementById('lista-prestadores').innerHTML = '';
        document.getElementById('lista-outros').innerHTML = '';

        // Limpa a chave do localStorage
        localStorage.removeItem(STORAGE_KEY_PLANTAO_ESTADO);
    }
}

// Monta a mensagem e abre o WhatsApp
function enviarWhatsAppPlantao() {
    const rawData = document.getElementById('dataPlantao').value;
    let dataFormatada = rawData;
    if (rawData) {
        const partes = rawData.split('-');
        if (partes.length === 3) dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    const saindo = document.getElementById('porteiroSaindo').value || 'Não informado';
    const assumindo = document.getElementById('porteiroAssumindo').value || 'Não informado';

    let msg = `📋 *PASSAGEM DE PLANTÃO*\n`;
    msg += `🏢 *Edifício Laguna Hall*\n`;
    msg += `📅 *Data:* ${dataFormatada}\n`;
    msg += `👤 *Saindo:* ${saindo}\n`;
    msg += `👤 *Assumindo:* ${assumindo}\n\n`;

    const obterItensLista = (ulId) => {
        const itens = [];
        const lis = document.querySelectorAll(`#${ulId} li .item-conteudo`);
        lis.forEach(li => {
            itens.push(li.innerText.replace(/\n/g, ' '));
        });
        return itens;
    };

    const encomendas = obterItensLista('lista-encomendas');
    const prestadores = obterItensLista('lista-prestadores');
    const outros = obterItensLista('lista-outros');

    msg += `📦 *1. ENCOMENDAS*\n`;
    if (encomendas.length > 0) {
        encomendas.forEach(i => msg += `• ${i}\n`);
    } else {
        msg += `• Nenhuma alteração/registro.\n`;
    }
    msg += `\n`;

    msg += `🛠️ *2. PRESTADORES DE SERVIÇO*\n`;
    if (prestadores.length > 0) {
        prestadores.forEach(i => msg += `• ${i}\n`);
    } else {
        msg += `• Nenhum prestador registrado.\n`;
    }
    msg += `\n`;

    msg += `📝 *3. DEMAIS OCORRÊNCIAS / OBSERVAÇÕES*\n`;
    if (outros.length > 0) {
        outros.forEach(i => msg += `• ${i}\n`);
    } else {
        msg += `• Sem alterações no plantão.\n`;
    }

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
}