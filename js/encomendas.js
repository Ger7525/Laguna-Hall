// Dicionário com os 47 apartamentos, nomes dos moradores e telefones
// Substitua os números de exemplo pelos telefones reais dos moradores (com DDD, sem traços nem espaços)
const APARTAMENTOS_LAGUNA = {
    "101": [
        { nome: "Kleber Buarque", telefone: "81997942579" },
        { nome: "Marcia Buarque", telefone: "81981330816" },
    ],
    "102": [
        { nome: "Reginaldo", telefone: "81988835898" },
        { nome: "Mauriceia", telefone: "81988835827" },
        { nome: "Artur", telefone: "81986216540" }
    ],
    "103": [
        { nome: "Silvio", telefone: "81983001991" },
        { nome: "Eudenice (Nice)", telefone: "81988124715" },
    ],
    "104": [
        { nome: "José Armando", telefone: "81991044523" },
        { nome: "Ana Cláudia", telefone: " 81973029325" },
    ],
    "201": [
        { nome: "Morador 1 (Apto 201)", telefone: "81992336350" },
    ],
    "202": [
        { nome: "Danilo", telefone: "81998048515" },
        { nome: "Nathalia", telefone: "81998699877" },
    ],
    "203": [
        { nome: "David", telefone: "81999546754" },
        { nome: "Gerson", telefone: "81997211054" },
        { nome: "Davison", telefone: "81992996837" }
    ],
    "204": [
        { nome: "Wilker", telefone: " 81996154986" },
    ],
    "301": [
        { nome: "Clecio ", telefone: "81995474759" },
    ],
    "302": [
        { nome: "Dayana", telefone: "81998384045" },
        { nome: "José", telefone: "81993772000" },
    ],
    "303": [
        { nome: "Priscila Cristyne", telefone: "81993058994" },
        { nome: "Anderson", telefone: "81996388485" },
        { nome: "Thiago", telefone: "81999892689" },
        { nome: "Priscila Coutinho", telefone: "8196199296" }
    ],
    "304": [
        { nome: "Saulo", telefone: "81984130142" },
    ],
    "401": [
        { nome: "Viviane", telefone: "81997065031" },
    ],
    "402": [
        { nome: "José Arnaldo", telefone: " 81979056826" },
    ],
    "403": [
        { nome: "Gustavo", telefone: "81999540122" },
    ],
    "404": [
        { nome: "Viviane", telefone: "81992864065" },
    ],
    "501": [
        { nome: "Mauricio", telefone: "81998929442" },
        { nome: "Larissa", telefone: "81999470639" },
    ],
    "502": [
        { nome: "Edna", telefone: " 81988040802" },
        { nome: "Rosali", telefone: "81988048020" },
    ],
    "503": [
        { nome: "Alexandre", telefone: " 81998842852" },
        { nome: "Gabriela", telefone: "81994071630" },
    ],
    "504": [
        { nome: "Thales", telefone: "81981036318" },
        { nome: "Rafaela", telefone: " 81999790107"},
    ],
    "601": [
        { nome: "Amanda ", telefone: "81981077486"},
        { nome: "Gabriel", telefone: "81982088900"},
    ],
    "602": [
        { nome: "Arlan", telefone: "81986956775"},
        { nome: "Suhelen", telefone: "81985768399"},
    ],
    "603": [
        { nome: "Raissa", telefone: "81999064865"},
    ],
    "604": [
        { nome: "Marcilia", telefone: "81997161145"},
    ],
    "701": [
        { nome: "Emanuel", telefone: "81992785516" },
        { nome: "Shirlene", telefone: "81988541669" },
    ],
    "702": [
        { nome: "Danilo Brun", telefone: " 81979139104"},
        { nome: "Daniel Brun", telefone: "81981033340"},
        { nome: "Eudenice (Nice)", telefone: "81981156868"}
    ],
    "703": [
        { nome: "Josy", telefone: "81997622478" },
    ],
    "704": [
        { nome: "Ana Flora", telefone: "81988669091" },
        { nome: "Jailson", telefone: "81998024248" },
        { nome: "José Henrique", telefone: "81987582555"}
    ],
    "801": [
        { nome: "Antonio", telefone: "81999763416" },
        { nome: "Dadiane", telefone: "81987737326" },
        { nome: "Darliane (Ananda)", telefone: "81997029579" }
    ],
    "802": [
        { nome: "Edvaldo", telefone: "8199386681" },
    ],
    "803": [
        { nome: "Bruno", telefone: "81992184733" },
        { nome: "Flávia", telefone: "81992741443" },
    ],
    "804": [
        { nome: "Romulo", telefone: "81973224994" },
        { nome: "Amanda", telefone: "81988884836" },
    ],
    "901": [
        { nome: "Ademir", telefone: "81984127959" },
        { nome: "Caroline", telefone: "81984472474"},
    ],
    "902": [
        { nome: "Gianina", telefone: "81988261549" },
        { nome: "Gabriel", telefone: "81997669050" },
        { nome: "Alice", telefone: "81994181840" }
    ],
    "903": [
        { nome: "Ladjane", telefone: "8196166139" },
    ],
    "904": [
        { nome: "Luiz Fernando", telefone: "81982372905" },
        { nome: "Joanna", telefone: "81981214381" },
    ],
    "1001": [
        { nome: "Gabriel", telefone: " 81992767111" },
        { nome: "Karla", telefone: "81992761357"},
    ],
    "1003": [
        { nome: "Joel", telefone: "81999606066" },
        { nome: "Nathalia", telefone: "81998752222" },
    ],
    "1004": [
        { nome: "MIlena", telefone: " 81988396485" },
        { nome: "Enio", telefone: " 81988435707" },
    ],
    "1101": [
        { nome: "Geofred", telefone: "81988141245" },
        { nome: "Tatiana", telefone: "81987950231" },
    ],
    "1102": [
        { nome: "Etiene", telefone: " 81991206752" },
    ],
    "1103": [
        { nome: "Debora", telefone: "81997757073"},
        { nome: "Antonio", telefone: "81987627340"},
    ],
    "1104": [
        { nome: "Juliana Carla", telefone: "81984464368" },
    ],
    "1201": [
        { nome: "Andre", telefone: " 81991916975" },
        { nome: "Juliana", telefone: "81996836112" },
    ],
    "1202": [
        { nome: "Rodrigo Brito", telefone: "81994213383" },
        { nome: "Luize", telefone: "81989507868" },
    ],
    "1203": [
        { nome: "Gleybson", telefone: "81991003252" },
        { nome: "Jeane", telefone: "81992776477" },
    ],
    "1204": [
        { nome: "Janser", telefone: "81999597414"},
        { nome: "Shirley", telefone: "81987297966"},
        { nome: "Lucas", telefone: "81981849254" },
        { nome: "Taina", telefone: " 81981847295"}
    ]
};

const STORAGE_KEY_ENCOMENDAS = 'lista_encomendas_salva';

// Inicialização da página
document.addEventListener("DOMContentLoaded", () => {
    carregarSelectApartamentos();
    renderizarEncomendas();
});

// Preenche o select de apartamentos
function carregarSelectApartamentos() {
    const selectApto = document.getElementById("selectApto");
    if (!selectApto) return;

    selectApto.innerHTML = '<option value="">-- Selecione o Apto --</option>';
    Object.keys(APARTAMENTOS_LAGUNA).forEach(apto => {
        const option = document.createElement("option");
        option.value = apto;
        option.textContent = `Apartamento ${apto}`;
        selectApto.appendChild(option);
    });
}

// Atualiza o select de moradores com os telefones salvos
function carregarMoradoresApto() {
    const apto = document.getElementById("selectApto").value;
    const selectMorador = document.getElementById("selectMorador");
    if (!selectMorador) return;

    selectMorador.innerHTML = '<option value="">-- Selecione o Morador --</option>';

    if (!apto || !APARTAMENTOS_LAGUNA[apto]) return;

    APARTAMENTOS_LAGUNA[apto].forEach(m => {
        const option = document.createElement("option");
        option.value = m.nome;
        option.dataset.telefone = m.telefone || "";
        option.textContent = m.nome;
        selectMorador.appendChild(option);
    });
}

// Persistência em LocalStorage
function obterEncomendas() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_ENCOMENDAS)) || [];
}

function salvarEncomendas(lista) {
    localStorage.setItem(STORAGE_KEY_ENCOMENDAS, JSON.stringify(lista));
}

// Registra a encomenda e já pode notificar diretamente
function adicionarEncomenda(event) {
    if (event) event.preventDefault();

    const selectApto = document.getElementById("selectApto");
    const selectMorador = document.getElementById("selectMorador");
    
    const apto = selectApto.value;
    const morador = selectMorador.value;

    if (!apto || !morador) {
        alert("Por favor, selecione o Apartamento e o Morador!");
        return;
    }

    // Pega o telefone atrelado ao morador selecionado
    const optionMorador = selectMorador.options[selectMorador.selectedIndex];
    const telefone = optionMorador ? (optionMorador.dataset.telefone || "") : "";

    const qtd = document.getElementById("qtdEncomenda") ? document.getElementById("qtdEncomenda").value : "1";
    const tipo = document.getElementById("tipoEncomenda") ? document.getElementById("tipoEncomenda").value : "Pacote";
    const porteiro = localStorage.getItem("usuarioLogado") || "Portaria";

    const novaEncomenda = {
        id: Date.now(),
        apto: apto,
        morador: morador,
        telefone: telefone,
        qtd: qtd,
        tipo: tipo,
        porteiro: porteiro,
        dataRecebimento: new Date().toLocaleString('pt-BR')
    };

    const lista = obterEncomendas();
    lista.unshift(novaEncomenda);
    salvarEncomendas(lista);

    // Reseta o formulário
    selectApto.value = "";
    selectMorador.innerHTML = '<option value="">-- Selecione o Apto primeiro --</option>';

    renderizarEncomendas();
}

// Função para enviar o aviso pelo WhatsApp
function enviarNotificacaoWhatsApp(id) {
    const lista = obterEncomendas();
    const item = lista.find(enc => enc.id === id);

    if (!item) return;

    let msg = `📦 *AVISO DE ENCOMENDA CHEGOU!*\n`;
    msg += `🏢 *Edifício Laguna Hall*\n\n`;
    msg += `Olá, *${item.morador}* (Apto ${item.apto})!\n`;
    msg += `Informamos que chegou uma entrega para você na portaria:\n\n`;
    msg += `📦 *Tipo:* ${item.tipo}\n`;
    msg += `🔢 *Quantidade:* ${item.qtd} unidade(s)\n`;
    msg += `👤 *Registrado por:* ${item.porteiro}\n`;
    msg += `🕒 *Data/Hora:* ${item.dataRecebimento}\n\n`;
    msg += `Por favor, retire na portaria assim que possível. Tenha um ótimo dia!`;

    let url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;

    if (item.telefone) {
        let numLimpo = item.telefone.replace(/\D/g, '');
        if (numLimpo.length === 10 || numLimpo.length === 11) {
            numLimpo = '55' + numLimpo;
        }
        url = `https://api.whatsapp.com/send?phone=${numLimpo}&text=${encodeURIComponent(msg)}`;
    }

    window.open(url, '_blank');
}

// Remove registro
function removerEncomenda(id) {
    if (confirm("Deseja realmente remover este registro?")) {
        let lista = obterEncomendas();
        lista = lista.filter(item => item.id !== id);
        salvarEncomendas(lista);
        renderizarEncomendas();
    }
}

// Renderiza os cards na página
function renderizarEncomendas() {
    const container = document.getElementById("lista-encomendas-container");
    if (!container) return;

    container.innerHTML = "";
    const lista = obterEncomendas();

    if (lista.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#777; margin-top:15px;">Nenhuma encomenda registrada.</p>';
        return;
    }

    lista.forEach(item => {
        const div = document.createElement("div");
        div.style.cssText = "background:#fff; border:1px solid #ddd; padding:12px; margin-bottom:10px; border-radius:6px;";

        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <strong>Apto ${item.apto} - ${item.morador}</strong>
                <small style="color:#666;">${item.dataRecebimento}</small>
            </div>
            <p style="margin-bottom:4px; font-size:14px;"><strong>Encomenda:</strong> ${item.tipo} (${item.qtd}x)</p>
            <p style="margin-bottom:4px; font-size:14px;"><strong>Telefone:</strong> ${item.telefone || 'Não cadastrado'}</p>
            <p style="margin-bottom:8px; font-size:14px;"><strong>Registrado por:</strong> ${item.porteiro}</p>
            <div style="display:flex; gap:8px; margin-top:8px;">
                <button type="button" onclick="enviarNotificacaoWhatsApp(${item.id})" style="background:#25d366; color:#fff; border:none; padding:8px 14px; border-radius:4px; cursor:pointer; font-weight:bold;">📲 Enviar WhatsApp</button>
                <button type="button" onclick="removerEncomenda(${item.id})" style="background:#dc2626; color:#fff; border:none; padding:8px 14px; border-radius:4px; cursor:pointer;">✕ Remover</button>
            </div>
        `;
        container.appendChild(div);
    });
}