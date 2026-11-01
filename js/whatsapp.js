/* Monta as mensagens e abre o WhatsApp. */
const Whats = (function () {
   "use strict";


   function abrir(telefone, texto) {
      const numero = String(telefone || "").replace(/\D/g, "");
      const base = numero ? "https://wa.me/" + numero : "https://wa.me/";
      window.open(base + "?text=" + encodeURIComponent(texto), "_blank", "noopener");
   }

   function formatarData(iso) {
      if (!iso) return "—";
      const p = iso.split("-");
      return p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0] : iso;
   }

   function nomePorteiro(valor) {
      const p = DADOS.porteiros.find(function (x) { return x.valor === valor; });
      return p ? p.nome : "—";
   }

   /* ---------- Aviso de entrega (para o morador) ---------- */
   function mensagemEntrega(item, operador) {
      const qtd = item.qtd || 1;
      const quando = item.data ? formatarData(item.data) + " às " + item.hora : item.hora;

      let msg = `*AVISO DE ENTREGA*\n`;
      msg += `*${DADOS.condominio}*\n\n`;
      msg += `Olá, *${item.nome}* (Apto ${item.apto})!\n`;
      msg += `Informamos que chegou uma entrega para você na portaria:\n\n`;
      msg += `*Tipo:* ${item.tipo}\n`;
      msg += `*Quantidade:* ${qtd} unidade(s)\n`;
      if (item.descricao) msg += `*Detalhes:* ${item.descricao}\n`;
      msg += `*Registrado por:* ${item.porteiro || operador.nome}\n`;
      msg += `*Data/Hora:* ${quando}\n\n`;
      msg += `Por favor, retire na portaria assim que possível. Tenha um ótimo dia!`;
      return msg;
   }

   /* ---------- Passagem de plantão (relatório completo) ---------- */
   function secao(titulo, itens, formatar) {
      let msg = `\n*${titulo} (${itens.length})*\n`;
      if (!itens.length) return msg + `Nenhum registro.\n`;
      itens.forEach(function (item, i) {
         msg += `${i + 1}. ${item.hora} – ${formatar(item)}\n`;
      });
      return msg;
   }

   function mensagemPlantao(p, operador) {
      let msg = `*PASSAGEM DE PLANTÃO*\n`;
      msg += `*${DADOS.condominio}*\n\n`;
      msg += `*Data:* ${formatarData(p.data)}\n`;
      msg += `*Operador:* ${operador.nome}\n`;
      msg += `*Porteiro saindo:* ${nomePorteiro(p.saindo)}\n`;
      msg += `*Porteiro entrando:* ${nomePorteiro(p.entrando)}\n`;

      msg += secao("ENTREGAS", p.entregas, function (e) {
         return `*Apto ${e.apto}* – ${e.nome} – ${e.tipo} (${e.qtd || 1} un.)` +
            (e.descricao ? ` – ${e.descricao}` : "");
      });
      msg += secao("OCORRÊNCIAS", p.ocorrencias, function (o) {
         return `*${o.tipo}:* ${o.descricao}`;
      });
      msg += secao("OBSERVAÇÕES", p.observacoes, function (o) {
         return `*${o.titulo}:* ${o.descricao}`;
      });
      msg += secao("PRESTADORES DE SERVIÇO", p.prestadores, function (s) {
         return `*${s.empresa}* – ${s.nome} – ${s.servico}`;
      });
      msg += secao("AVISOS", p.avisos || [], function (a) {
         return `*${a.assunto}* (para: ${a.destino}): ${a.descricao}`;
      });

      msg += `\nBom plantão a todos!`;
      return msg;
   }

   return { abrir, formatarData, nomePorteiro, mensagemEntrega, mensagemPlantao };
})();
