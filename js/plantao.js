document.addEventListener("DOMContentLoaded", () => {
    carregarRascunho();

    // Auto-salvamento a cada alteração em qualquer input/textarea
    document.querySelectorAll("input, textarea, select").forEach(campo => {
        campo.addEventListener("input", salvarRascunhoAutomatico);
    });
});

function obterDadosFormulario() {
    return {
        data: document.getElementById("dataPlantao").value,
        saindo: document.getElementById("porteiroSaindo").value,
        assumindo: document.getElementById("porteiroAssumindo").value,
        ocorrencias: document.getElementById("ocorrencias").value,
        prestador: {
            nome: document.getElementById("prestNome").value,
            empresa: document.getElementById("prestEmpresa").value,
            servico: document.getElementById("prestServico").value,
            horario: document.getElementById("prestHorario").value
        },
        envelopes: {
            apto: document.getElementById("envApto").value,
            nome: document.getElementById("envNome").value,
            qtd: document.getElementById("envQtd").value
        },
        pendentes: {
            apto: document.getElementById("pendApto").value,
            nome: document.getElementById("pendNome").value,
            qtd: document.getElementById("pendQtd").value
        },
        recolher: {
            apto: document.getElementById("recolhApto").value,
            nome: document.getElementById("recolhNome").value,
            qtd: document.getElementById("recolhQtd").value,
            por: document.getElementById("recolhPor").value
        },
        chaves: {
            apto: document.getElementById("chaveApto").value,
            nome: document.getElementById("chaveNome").value,
            qtd: document.getElementById("chaveQtd").value
        }
    };
}

function salvarRascunhoAutomatico() {
    const dados = obterDadosFormulario();
    localStorage.setItem("rascunhoPlantao", JSON.stringify(dados));
}

function salvarRascunhoManual() {
    salvarRascunhoAutomatico();
    alert("Rascunho do Plantão salvo com sucesso!");
}

function carregarRascunho() {
    const rascunho = localStorage.getItem("rascunhoPlantao");
    if (!rascunho) return;

    const d = JSON.parse(rascunho);
    document.getElementById("dataPlantao").value = d.data || "";
    document.getElementById("porteiroSaindo").value = d.saindo || "";
    document.getElementById("porteiroAssumindo").value = d.assumindo || "";
    document.getElementById("ocorrencias").value = d.ocorrencias || "";

    if (d.prestador) {
        document.getElementById("prestNome").value = d.prestador.nome || "";
        document.getElementById("prestEmpresa").value = d.prestador.empresa || "";
        document.getElementById("prestServico").value = d.prestador.servico || "";
        document.getElementById("prestHorario").value = d.prestador.horario || "";
    }
    if (d.envelopes) {
        document.getElementById("envApto").value = d.envelopes.apto || "";
        document.getElementById("envNome").value = d.envelopes.nome || "";
        document.getElementById("envQtd").value = d.envelopes.qtd || "";
    }
    if (d.pendentes) {
        document.getElementById("pendApto").value = d.pendentes.apto || "";
        document.getElementById("pendNome").value = d.pendentes.nome || "";
        document.getElementById("pendQtd").value = d.pendentes.qtd || "";
    }
    if (d.recolher) {
        document.getElementById("recolhApto").value = d.recolher.apto || "";
        document.getElementById("recolhNome").value = d.recolher.nome || "";
        document.getElementById("recolhQtd").value = d.recolher.qtd || "";
        document.getElementById("recolhPor").value = d.recolher.por || "";
    }
    if (d.chaves) {
        document.getElementById("chaveApto").value = d.chaves.apto || "";
        document.getElementById("chaveNome").value = d.chaves.nome || "";
        document.getElementById("chaveQtd").value = d.chaves.qtd || "";
    }
}

function enviarWhatsappPlantao() {
    const d = obterDadosFormulario();

    let msg = `📋 *RELATÓRIO DE PASSAGEM DE PLANTÃO*\n`;
    msg += `🏢 *Edifício Laguna Hall*\n\n`;
    msg += `📅 *Data:* ${d.data ? d.data.split('-').reverse().join('/') : 'Não informada'}\n`;
    msg += `👤 *Porteiro Saindo:* ${d.saindo || '-'}\n`;
    msg += `👤 *Porteiro Assumindo:* ${d.assumindo || '-'}\n\n`;

    msg += `📝 *OCORRÊNCIAS:*\n${d.ocorrencias || 'Nenhuma ocorrência registrada.'}\n\n`;

    msg += `🔍 *OBSERVAÇÕES E CONTROLES:*\n`;
    msg += `• *Prestador de Serviço:* ${d.prestador.nome ? `${d.prestador.nome} (${d.prestador.empresa}) - ${d.prestador.servico} [${d.prestador.horario}]` : 'Nenhum'}\n`;
    msg += `• *Envelopes/Cartas:* ${d.envelopes.apto ? `Apto ${d.envelopes.apto} - ${d.envelopes.nome} (${d.envelopes.qtd} un)` : 'Nenhum'}\n`;
    msg += `• *Entregas Pendentes:* ${d.pendentes.apto ? `Apto ${d.pendentes.apto} - ${d.pendentes.nome} (${d.pendentes.qtd} un)` : 'Nenhuma'}\n`;
    msg += `• *Entregas a Recolher:* ${d.recolher.apto ? `Apto ${d.recolher.apto} - ${d.recolher.nome} (${d.recolher.qtd} un) - Recolher por: ${d.recolher.por}` : 'Nenhuma'}\n`;
    msg += `• *Chaves na Portaria:* ${d.chaves.apto ? `Apto ${d.chaves.apto} - ${d.chaves.nome} (${d.chaves.qtd} chave/s)` : 'Nenhuma'}\n`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
}