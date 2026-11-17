/* Monta as mensagens e abre o WhatsApp.
   Todas seguem a mesma organização: cabeçalho, blocos com título em negrito
   e rodapé separados por uma linha. */
const Whats = (function () {
   "use strict";

   const LINHA = "--------------------------------";

   /* Emoji discreto no título de cada tipo de mensagem.
      Para desligar, use usarEmojis: false em dados.js. */
   const EMOJIS = {
      entrega: "📦", retirada: "✅", correspondencia: "✉️", boleto: "🧾", aviso: "📢",
      prestador: "🔧", saida: "🚪", ocorrencia: "📝", plantao: "📋"
   };
   function rotulo(tipo, titulo) {
      return (DADOS.usarEmojis !== false && EMOJIS[tipo] ? EMOJIS[tipo] + " " : "") + titulo;
   }

   function abrir(telefone, texto) {
      const numero = String(telefone || "").replace(/\D/g, "");
      const base = numero ? "https://wa.me/" + numero : "https://wa.me/";
      window.open(base + "?text=" + encodeURIComponent(texto), "_blank", "noopener");
   }

   /* O link do WhatsApp tem limite de tamanho. Mede o texto já codificado. */
   function cabe(texto) {
      return encodeURIComponent(texto).length <= (DADOS.limiteWhatsapp || 4000);
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

   function quando(item) {
      return item.data ? formatarData(item.data) + " às " + item.hora : item.hora;
   }

   /* ---------- Saudação e despedida conforme o horário do envio ---------- */
   function periodo() {
      const h = new Date().getHours();
      return h < 12 ? "manha" : (h < 18 ? "tarde" : "noite");
   }
   function saudacao() {
      return { manha: "Bom dia", tarde: "Boa tarde", noite: "Boa noite" }[periodo()];
   }
   function despedida() {
      return { manha: "Tenha um ótimo dia!", tarde: "Tenha uma ótima tarde!", noite: "Tenha uma ótima noite!" }[periodo()];
   }

   /* "1 unidade" / "3 unidades" */
   function quantidade(n, unidade) {
      n = Number(n) || 1;
      return n + " " + (n === 1 ? unidade.s : unidade.p);
   }
   const UN_ENTREGA = { s: "unidade", p: "unidades" };

   /* ---------- Peças das mensagens ---------- */
   function cabecalho(titulo) {
      return "*" + DADOS.condominio.toUpperCase() + "*\n" + titulo + "\n" + LINHA + "\n\n";
   }
   function bloco(titulo, linhas) {
      return "*" + titulo + "*\n" + linhas.filter(Boolean).join("\n") + "\n\n";
   }
   function rodape(texto) { return LINHA + "\n" + texto; }

   /* Rodapé das mensagens de retirada na portaria: horário e lembrete (dados.js) */
   function rodapeRetirada(fecho) {
      let t = fecho;
      if (DADOS.horarioRetirada) t += "\nHorário de retirada: " + DADOS.horarioRetirada;
      if (DADOS.lembreteRetirada) t += "\n" + DADOS.lembreteRetirada;
      return rodape(t + "\n" + despedida());
   }

   function blocoRegistro(item, operador) {
      return bloco("REGISTRO", [
         "Registrado por: " + (item.porteiro || operador.nome),
         "Data/Hora: " + quando(item)
      ]);
   }

   /* ---------- Aviso de entrega (para o morador) ---------- */
   function mensagemEntrega(item, operador) {
      let msg = cabecalho(rotulo("entrega", "Aviso de entrega"));
      msg += saudacao() + ", *" + item.nome + "* (Apto " + item.apto + ").\n";
      msg += "Informamos que chegou uma entrega para você na portaria.\n\n";
      msg += bloco("DETALHES", [
         "Tipo: " + item.tipo,
         "Quantidade: " + quantidade(item.qtd, UN_ENTREGA),
         item.descricao ? "Descrição: " + item.descricao : ""
      ]);
      msg += blocoRegistro(item, operador);
      msg += rodapeRetirada("Por favor, retire na portaria assim que possível.");
      return msg;
   }

   /* ---------- Entrega retirada (para o morador) ----------
      Confirma ao morador quem retirou e quando. */
   function mensagemRetirada(item, operador) {
      let msg = cabecalho(rotulo("retirada", "Entrega retirada"));
      msg += saudacao() + ", *" + item.nome + "* (Apto " + item.apto + ").\n";
      msg += "Informamos que a sua entrega foi retirada na portaria.\n\n";
      msg += bloco("DETALHES", [
         "Tipo: " + item.tipo,
         "Quantidade: " + quantidade(item.qtd, UN_ENTREGA),
         item.descricao ? "Descrição: " + item.descricao : ""
      ]);
      msg += bloco("RETIRADA", [
         "Retirado por: " + item.retiradoPor,
         "Data/Hora: " + formatarData(item.dataRetirada) + " às " + item.horaRetirada,
         "Registrado por: " + operador.nome
      ]);
      msg += rodape("Se você não reconhece esta retirada, procure a portaria ou a administração. " + despedida());
      return msg;
   }

   /* ---------- Correspondências e avisos (para o morador) ----------
      Cada tipo tem a sua mensagem. Os nomes das chaves precisam ser
      iguais aos de tiposCorrespondencia em dados.js. */
   const MODELOS_CORRESPONDENCIA = {
      "Carta": {
         emoji: "correspondencia",
         titulo: "Aviso de correspondência",
         texto: "Informamos que chegou uma carta em seu nome na portaria.",
         unidade: { s: "carta", p: "cartas" },
         fecho: "Por favor, retire na portaria assim que possível."
      },
      "Boleto do condomínio": {
         emoji: "boleto",
         titulo: "Boleto do condomínio",
         texto: "Informamos que o boleto do condomínio está disponível na portaria para retirada.",
         unidade: { s: "boleto", p: "boletos" },
         fecho: "Confira o valor e a data de vencimento no próprio boleto. Em caso de dúvidas, procure a administração."
      },
      "Boleto do gás": {
         emoji: "boleto",
         titulo: "Boleto do gás",
         texto: "Informamos que chegou na portaria o boleto do gás referente à sua unidade.",
         unidade: { s: "boleto", p: "boletos" },
         fecho: "Por favor, retire na portaria e confira o valor e o vencimento no próprio boleto."
      },
      "Boleto Neoenergia": {
         emoji: "boleto",
         titulo: "Boleto Neoenergia",
         texto: "Informamos que chegou na portaria a fatura de energia elétrica (Neoenergia) em seu nome.",
         unidade: { s: "fatura", p: "faturas" },
         fecho: "Por favor, retire na portaria e confira o valor e o vencimento no próprio boleto."
      },
      "Aviso do condomínio": {
         emoji: "aviso",
         titulo: "Aviso do condomínio",
         texto: "Informamos que há um aviso do condomínio para você.",
         aviso: true,
         fecho: "Em caso de dúvidas, procure a administração."
      }
   };

   const MODELO_PADRAO = {
      emoji: "correspondencia",
      titulo: "Aviso de correspondência",
      texto: "Informamos que chegou uma correspondência para você na portaria.",
      unidade: { s: "item", p: "itens" },
      fecho: "Por favor, retire na portaria assim que possível."
   };

   function mensagemCorrespondencia(item, operador) {
      const modelo = MODELOS_CORRESPONDENCIA[item.tipo] || MODELO_PADRAO;
      let msg = cabecalho(rotulo(modelo.emoji, modelo.titulo));
      msg += saudacao() + ", *" + item.nome + "* (Apto " + item.apto + ").\n" + modelo.texto + "\n\n";
      if (modelo.aviso) {
         msg += bloco("AVISO", [item.descricao]);
      } else {
         msg += bloco("DETALHES", [
            "Tipo: " + item.tipo,
            "Quantidade: " + quantidade(item.qtd, modelo.unidade),
            item.descricao ? "Descrição: " + item.descricao : ""
         ]);
      }
      msg += blocoRegistro(item, operador);
      msg += modelo.aviso
         ? rodape(modelo.fecho + "\n" + despedida())
         : rodapeRetirada(modelo.fecho);
      return msg;
   }

   /* ---------- Prestador de serviço: chegada e saída ---------- */
   function blocoPrestador(r) {
      return bloco("PRESTADOR", [
         "Empresa: " + r.empresa,
         "Nome: " + r.nome,
         "Serviço: " + r.servico,
         r.apto ? "Apartamento: " + r.apto : ""
      ]);
   }

   function mensagemPrestador(r, operador) {
      let msg = cabecalho(rotulo("prestador", "Aviso de prestador de serviço"));
      msg += "Informamos que há um prestador de serviço no condomínio" +
         (r.apto ? ", para atendimento no *Apto " + r.apto + "*" : "") + ".\n\n";
      msg += blocoPrestador(r);
      msg += bloco("REGISTRO", [
         "Registrado por: " + (r.porteiro || operador.nome),
         "Chegada: " + quando(r)
      ]);
      msg += rodape("Comunicado enviado pela portaria. " + despedida());
      return msg;
   }

   function mensagemPrestadorSaida(r, operador) {
      let msg = cabecalho(rotulo("saida", "Saída de prestador de serviço"));
      msg += "Informamos que o prestador de serviço abaixo deixou o condomínio.\n\n";
      msg += blocoPrestador(r);
      msg += bloco("REGISTRO", [
         "Registrado por: " + (r.porteiro || operador.nome),
         "Chegada: " + quando(r),
         "Saída: " + (r.horaSaida || "—")
      ]);
      msg += rodape("Comunicado enviado pela portaria. " + despedida());
      return msg;
   }

   /* ---------- Ocorrência de morador (para a administração) ---------- */
   function mensagemOcorrenciaMorador(r, operador) {
      let msg = cabecalho(rotulo("ocorrencia", "Ocorrência de morador"));
      msg += bloco("MORADOR", ["Apartamento: " + r.apto, "Nome: " + r.nome]);
      msg += bloco("OCORRÊNCIA", [r.descricao]);
      msg += blocoRegistro(r, operador);
      msg += rodape("Assinatura do morador colhida na portaria.");
      return msg;
   }

   /* ---------- Ordem e agrupamento por apartamento ---------- */
   function posicaoPrioridade(apto) {
      return (DADOS.prioridadeApartamentos || []).map(String).indexOf(String(apto));
   }

   function compararApto(a, b) {
      const pa = posicaoPrioridade(a), pb = posicaoPrioridade(b);
      if (pa >= 0 || pb >= 0) {
         if (pa < 0) return 1;
         if (pb < 0) return -1;
         return pa - pb;
      }
      return String(a).localeCompare(String(b), "pt-BR", { numeric: true });
   }

   /* Junta os registros do mesmo apartamento e ordena os apartamentos.
      Dentro de cada apartamento, mantém a ordem em que foram registrados. */
   function agruparPorApto(itens) {
      const mapa = new Map();
      itens.forEach(function (r) {
         const apto = String(r.apto).trim();
         const chave = apto.toLowerCase();
         if (!mapa.has(chave)) mapa.set(chave, { apto: apto, itens: [] });
         mapa.get(chave).itens.push(r);
      });
      return Array.from(mapa.values()).sort(function (x, y) { return compararApto(x.apto, y.apto); });
   }

   /* ---------- Passagem de plantão ----------
      estruturaPlantao() também alimenta o PDF do plantão. */
   function estruturaPlantao(p) {
      const un = function (r) { return (r.qtd || 1) + " un."; };
      const tipoQtd = function (r) { return r.tipo + " (" + un(r) + ")"; };
      const pacote = function (r) { return [[r.nome], [tipoQtd(r), r.descricao]]; };
      /* [título, lista, como montar cada item, agrupar por apartamento?] */
      const defs = [
         ["ENTREGAS AGUARDANDO RETIRADA", p.entregas, pacote, true],
         ["ENTREGAS RETIRADAS", p.entregues, function (r) {
            return [[r.nome], [tipoQtd(r), r.descricao, "Retirado por: " + r.retiradoPor + " às " + r.horaRetirada]];
         }, true],
         ["ENTREGAS E ENCOMENDAS A RECOLHER", p.recolhimentos, pacote, true],
         ["CORRESPONDÊNCIAS E AVISOS", p.correspondencias, function (r) {
            const aviso = r.tipo === "Aviso do condomínio";
            return [[r.nome], [aviso ? r.tipo : tipoQtd(r), r.descricao]];
         }, true],
         ["OCORRÊNCIAS DE MORADORES", p.ocorrenciasMoradores, function (r) { return [[r.nome], [r.descricao]]; }, true],
         ["OCORRÊNCIAS", p.ocorrencias, function (r) { return [[r.tipo], [r.descricao]]; }, false],
         ["OBSERVAÇÕES", p.observacoes, function (r) { return [[r.titulo], [r.descricao]]; }, false],
         ["PRESTADORES DE SERVIÇO", p.prestadores, function (r) {
            return [[r.empresa, r.nome], [r.servico, r.apto ? "Apto " + r.apto : "", r.horaSaida ? "Saída: " + r.horaSaida : ""]];
         }, false],
         ["AVISOS", p.avisos, function (r) { return [[r.assunto], ["Para: " + r.destino, r.descricao]]; }, false]
      ];
      return defs.map(function (d) {
         const lista = d[1] || [];
         const montar = function (r) {
            const partes = d[2](r);
            return { hora: r.hora, partes: partes[0], detalhes: partes[1].filter(Boolean), assinatura: r.assinatura || "" };
         };
         const grupos = d[3]
            ? agruparPorApto(lista).map(function (g) { return { rotulo: "Apto " + g.apto, itens: g.itens.map(montar) }; })
            : [{ rotulo: "", itens: lista.map(montar) }];
         return { titulo: d[0], total: lista.length, grupos: grupos };
      });
   }

   /* Nomes curtos para o resumo (mesma ordem de estruturaPlantao) */
   const NOMES_CURTOS = [
      "Entregas aguardando retirada", "Entregas retiradas", "Entregas a recolher",
      "Correspondências e avisos", "Ocorrências de moradores", "Ocorrências",
      "Observações", "Prestadores de serviço", "Avisos"
   ];

   /* resumido = true: só o resumo, para quando o texto completo não cabe no link do WhatsApp */
   function mensagemPlantao(p, operador, resumido) {
      let msg = cabecalho(rotulo("plantao", "Passagem de plantão"));
      msg += bloco("DADOS DO PLANTÃO", [
         "Data: " + formatarData(p.data),
         "Operador: " + operador.nome,
         "Porteiro saindo: " + nomePorteiro(p.saindo),
         "Porteiro entrando: " + nomePorteiro(p.entrando)
      ]);

      const secoes = estruturaPlantao(p);
      const comRegistro = secoes.map(function (s, i) { return s.total ? NOMES_CURTOS[i] + ": " + s.total : ""; }).filter(Boolean);
      msg += bloco("RESUMO", comRegistro.length ? comRegistro : ["Nenhum registro neste plantão."]);

      if (resumido) {
         msg += "_O relatório detalhado segue em PDF._\n\n";
      } else {
         let n = 0;
         secoes.forEach(function (s) {
            if (!s.total) return;
            const linhas = [];
            s.grupos.forEach(function (g) {
               if (g.rotulo) linhas.push("*" + g.rotulo + "* (" + g.itens.length + ")");
               const recuo = g.rotulo ? "   " : "";
               g.itens.forEach(function (it, k) {
                  const topo = recuo + (k + 1) + ") " + [it.hora].concat(it.partes).join(" | ");
                  linhas.push([topo].concat(it.detalhes.map(function (d) { return recuo + "    " + d; })).join("\n"));
               });
            });
            msg += bloco((++n) + ". " + s.titulo + " (" + s.total + ")", linhas);
         });
         const vazias = secoes.map(function (s, i) { return s.total ? "" : NOMES_CURTOS[i]; }).filter(Boolean);
         if (vazias.length && vazias.length < secoes.length) msg += bloco("SEM REGISTROS", [vazias.join(", ")]);
      }
      msg += rodape("Bom plantão a todos!");
      return msg;
   }

   return {
      abrir, cabe, formatarData, nomePorteiro, agruparPorApto, estruturaPlantao,
      mensagemEntrega, mensagemRetirada, mensagemCorrespondencia, mensagemPrestador,
      mensagemPrestadorSaida, mensagemOcorrenciaMorador, mensagemPlantao
   };
})();
