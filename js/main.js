/* Monta o site a partir do config.js. Normalmente não é preciso mexer aqui.
   Segurança: todo texto do config entra na página como TEXTO (textContent),
   nunca como HTML, e só links https:// são aceitos. */
(function () {
  "use strict";
  const S = window.SITE;
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);
  const el = (tag, cls, txt) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  };
  // Só aceita endereços https:// (bloqueia "javascript:" e afins)
  const urlSegura = (u) => {
    try { const x = new URL(u, location.href); return x.protocol === "https:" ? x.href : ""; }
    catch (e) { return ""; }
  };
  // Só aceita imagens do próprio site (pasta img/)
  const imgSegura = (u) => (typeof u === "string" && /^img\/[\w.\-]+$/.test(u) ? u : "");
  const linkExterno = (href, cls, txt) => {
    const a = el("a", cls, txt);
    a.href = href; a.target = "_blank"; a.rel = "noopener noreferrer";
    return a;
  };
  const novaImg = (f, cls, extra) => {
    const src = f && imgSegura(f.src);
    if (!src) return null;
    const img = el("img", cls);
    img.src = src; img.alt = f.alt || "";
    Object.assign(img, extra || {});
    return img;
  };

  S.equipe = S.equipe || {};
  S.avaliacao = S.avaliacao || {};
  S.depoimentos = S.depoimentos || [];
  S.galeria = S.galeria || [];
  S.logo = S.logo || {};

  const raiz = document.documentElement.style;

  // ---------- Fontes (os arquivos ficam na pasta fontes/) ----------
  if (S.fontes) {
    if (S.fontes.titulo) raiz.setProperty("--fonte-titulo", `"${S.fontes.titulo}", Georgia, serif`);
    if (S.fontes.texto) raiz.setProperty("--fonte-texto", `"${S.fontes.texto}", system-ui, sans-serif`);
  }

  // ---------- Cores ----------
  const mapaCores = { fundo: "--fundo", superficie: "--superficie", texto: "--texto", textoSuave: "--texto-suave", brilho: "--brilho", detalhe: "--detalhe" };
  for (const k in mapaCores) {
    const c = S.cores && S.cores[k];
    if (c && /^#[0-9a-fA-F]{3,8}$/.test(c)) raiz.setProperty(mapaCores[k], c);
  }

  // ---------- Links ----------
  const fone = String(S.contato.whatsapp || "").replace(/\D/g, "");
  const whats = `https://wa.me/${fone}?text=${encodeURIComponent(S.contato.mensagemWhatsapp || "")}`;
  const rota = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(S.endereco.buscaMapa)}`;
  const agendaUrl = urlSegura(S.contato.agendamentoUrl);
  const links = { whatsapp: whats, rota: rota, agendamento: agendaUrl || whats };
  $$("[data-link]").forEach((a) => {
    a.href = links[a.dataset.link];
    if (a.dataset.link === "agendamento") a.textContent = S.contato.agendamentoTexto;
  });

  // ---------- Textos simples ----------
  const campos = {
    nome: S.nome,
    slogan: S.slogan,
    local: `${S.bairro}, ${S.cidade}`,
    "equipe-titulo": S.equipe.titulo,
    "equipe-texto": S.equipe.texto
  };
  $$("[data-campo]").forEach((n) => (n.textContent = campos[n.dataset.campo] || ""));

  // ---------- Logo do topo (ou o texto de "marca", se não houver logo) ----------
  const marca = $('[data-bloco="marca"]');
  marca.setAttribute("aria-label", `${S.nome}, voltar ao início`);
  const logoTopo = novaImg({ src: S.logo.topo, alt: "" }, "topo-logo", { width: 48, height: 48 });
  if (logoTopo) marca.append(logoTopo);
  else marca.textContent = S.marca || S.nome;

  // ---------- Fotos ----------
  const espelho = $('[data-foto="principal"]');
  const fotoTopo = novaImg(S.fotoPrincipal, null, { fetchPriority: "high", width: 900, height: 1200 });
  if (fotoTopo) espelho.append(fotoTopo); else espelho.remove();

  const fotoEquipe = novaImg(S.equipe.foto, "equipe-foto", { loading: "lazy", decoding: "async", width: 1200, height: 1600 });
  if (fotoEquipe) $('[data-foto="equipe"]').append(fotoEquipe);

  // ---------- Avaliação ----------
  const nota = $('[data-bloco="avaliacao"]');
  const linkNota = urlSegura(S.avaliacao.link);
  if (S.avaliacao.nota) {
    if (linkNota) nota.href = linkNota; else nota.removeAttribute("href");
    const estrelas = el("span", "estrelas", "★★★★★");
    estrelas.setAttribute("aria-hidden", "true");
    nota.append(estrelas, " ", el("strong", null, S.avaliacao.nota), ` no Google, ${S.avaliacao.total} avaliações`);
  } else nota.remove();

  // ---------- Horários e "aberto agora" ----------
  const dias = [
    ["domingo", "Domingo"], ["segunda", "Segunda"], ["terca", "Terça"], ["quarta", "Quarta"],
    ["quinta", "Quinta"], ["sexta", "Sexta"], ["sabado", "Sábado"]
  ];
  const min = (h) => { const [a, b] = h.split(":").map(Number); return a * 60 + b; };
  const fmt = (h) => (h === "00:00" ? "meia-noite" : h.replace(":00", "h").replace(":", "h"));
  const faixa = (d) => S.horarios[d];
  // hora local da barbearia (não a do celular de quem visita)
  const agoraNaLoja = () => {
    try { return new Date(new Date().toLocaleString("en-US", { timeZone: S.fusoHorario || "America/Sao_Paulo" })); }
    catch (e) { return new Date(); }
  };

  // Intervalos em minutos a partir do início da semana (fechamento <= abertura vira dia seguinte)
  const intervalos = [];
  dias.forEach(([chave], i) => {
    const h = faixa(chave);
    if (!Array.isArray(h)) return;
    const ini = i * 1440 + min(h[0]);
    let fim = i * 1440 + min(h[1]);
    if (fim <= ini) fim += 1440;
    intervalos.push({ ini, fim, fecha: h[1] });
  });

  function status() {
    const agora = agoraNaLoja();
    const t = agora.getDay() * 1440 + agora.getHours() * 60 + agora.getMinutes();
    for (const iv of intervalos) {
      for (const desl of [0, -10080]) {
        if (t >= iv.ini + desl && t < iv.fim + desl) return { aberto: true, texto: `Aberto agora, fecha ${iv.fecha === "00:00" ? "à" : "às"} ${fmt(iv.fecha)}` };
      }
    }
    // próximo horário de abertura
    let melhor = null;
    for (const iv of intervalos) {
      let delta = iv.ini - t;
      if (delta < 0) delta += 10080;
      if (!melhor || delta < melhor.delta) melhor = { delta, iv };
    }
    if (!melhor) return { aberto: false, texto: "Fechado" };
    const diaAbre = Math.floor((melhor.iv.ini % 10080) / 1440);
    const hora = fmt(faixa(dias[diaAbre][0])[0]);
    const quando = diaAbre === agora.getDay() ? "hoje" : diaAbre === (agora.getDay() + 1) % 7 ? "amanhã" : dias[diaAbre][1].toLowerCase();
    return { aberto: false, texto: `Fechado agora, abre ${quando} às ${hora}` };
  }
  const st = $('[data-bloco="status"]');
  const pintarStatus = () => { const s = status(); st.textContent = s.texto; st.classList.toggle("aberto", s.aberto); };
  pintarStatus();
  setInterval(pintarStatus, 60000);

  const tabela = $('[data-bloco="horarios"]');
  const tbody = el("tbody");
  const hoje = agoraNaLoja().getDay();
  [1, 2, 3, 4, 5, 6, 0].forEach((i) => {
    const [chave, nomeDia] = dias[i];
    const h = faixa(chave);
    const tr = el("tr");
    if (i === hoje) { tr.className = "hoje"; tr.setAttribute("aria-current", "date"); }
    const th = el("th", null, nomeDia + (i === hoje ? " (hoje)" : ""));
    th.scope = "row";
    tr.append(th, el("td", null, Array.isArray(h) ? `${fmt(h[0])} ${h[1] === "00:00" ? "à" : "às"} ${fmt(h[1])}` : "Fechado"));
    tbody.append(tr);
  });
  tabela.append(tbody);

  // ---------- Serviços ----------
  const caixaServicos = $('[data-bloco="servicos"]');
  // aceita lista simples ou lista separada em grupos
  const grupos = S.servicos.length && S.servicos[0].itens ? S.servicos : [{ grupo: "", itens: S.servicos }];
  grupos.forEach((g) => {
    const bloco = el("div", "servicos-grupo");
    if (g.grupo) bloco.append(el("h3", null, g.grupo));
    const ul = el("ul", "servicos");
    g.itens.forEach((s) => {
      const li = el("li");
      const linha = el("div", "servico-linha");
      linha.append(el("span", "servico-nome", s.nome), el("span", "servico-preco", s.preco));
      li.append(linha);
      if (s.descricao) li.append(el("p", "servico-desc", s.descricao));
      ul.append(li);
    });
    bloco.append(ul);
    caixaServicos.append(bloco);
  });
  if (S.precosDeExemplo) $('[data-bloco="aviso-precos"]').hidden = false;

  const planos = $('[data-bloco="planos"]');
  const P = S.planos;
  if (P && P.lista && P.lista.length) {
    planos.append(el("h3", null, P.titulo), el("p", "planos-texto", P.texto));
    const ul = el("ul", "planos-lista");
    P.lista.forEach((p) => {
      const li = el("li", p.destaque ? "plano plano-destaque" : "plano");
      const topo = el("div", "plano-linha");
      const preco = el("span", "plano-preco", p.preco);
      if (p.periodo) preco.append(el("small", null, p.periodo));
      topo.append(el("span", "plano-nome", p.nome), preco);
      li.append(topo);
      if (p.destaque) li.append(el("p", "plano-nota", p.destaque));
      ul.append(li);
    });
    planos.append(ul);
    if (agendaUrl) planos.append(linkExterno(agendaUrl, "botao botao-principal", P.botao));
  } else planos.remove();

  // ---------- Equipe ----------
  if (!S.equipe.titulo) $('[data-bloco="equipe"]').remove();

  // ---------- Depoimentos ----------
  const blocoDep = $('[data-bloco="depoimentos"]');
  if (!S.depoimentos.length) blocoDep.remove();
  else {
    const caixa = $('[data-bloco="lista-depoimentos"]');
    S.depoimentos.forEach((d) => {
      const fig = el("figure", "depoimento");
      const bq = el("blockquote");
      bq.append(el("p", null, d.texto));
      fig.append(bq, el("figcaption", null, `${d.autor}, pelo Google`));
      caixa.append(fig);
    });
    if (linkNota && S.avaliacao.total) {
      blocoDep.append(linkExterno(linkNota, "link-avaliacoes", `Ler as ${S.avaliacao.total} avaliações no Google`));
    }
  }

  // ---------- Galeria + ampliar foto ----------
  const galeria = $('[data-bloco="galeria"]');
  const dlg = $('[data-bloco="ampliar"]');
  const fotoGrande = el("img");
  dlg.prepend(fotoGrande);
  const fotosGaleria = S.galeria.filter((f) => imgSegura(f.src));
  if (!fotosGaleria.length) galeria.closest("section").remove();
  fotosGaleria.forEach((f) => {
    const b = el("button", "galeria-item");
    b.type = "button";
    b.setAttribute("aria-label", `Ampliar foto: ${f.alt}`);
    b.append(novaImg(f, null, { loading: "lazy", decoding: "async" }));
    b.addEventListener("click", () => {
      fotoGrande.src = imgSegura(f.src); fotoGrande.alt = f.alt || "";
      dlg.showModal();
    });
    galeria.append(b);
  });
  dlg.querySelector(".ampliar-fechar").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });

  // ---------- Endereço e mapa ----------
  const E = S.endereco;
  $('[data-bloco="endereco"]').append(
    E.rua, el("br"), `${E.bairro}, ${E.cidade} - ${E.uf}`, el("br"), `CEP ${E.cep}`
  );
  const mapa = $('[data-bloco="mapa"]');
  const iframe = el("iframe");
  iframe.title = `Mapa: ${S.nome}`;
  iframe.loading = "lazy";
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  // o mapa roda isolado: não consegue mexer na página nem navegar por ela
  iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox");
  iframe.src = `https://www.google.com/maps?q=${encodeURIComponent(E.buscaMapa)}&output=embed`;
  mapa.append(iframe);

  // ---------- Rodapé ----------
  const rod = $('[data-bloco="rodape"]');
  const ig = String(S.contato.instagram || "").replace(/[^\w.]/g, "");
  const logoRod = novaImg({ src: S.logo.src, alt: S.logo.alt }, "rodape-logo", { width: 120, height: 120, loading: "lazy" });
  if (logoRod) rod.append(logoRod);
  rod.append(el("p", "rodape-nome", S.nome));
  const ul = el("ul", "rodape-links");
  const item = (a) => { const li = el("li"); li.append(a); ul.append(li); };
  if (ig) item(linkExterno(`https://instagram.com/${ig}`, null, `Instagram @${ig}`));
  item(linkExterno(whats, null, `WhatsApp ${S.contato.telefoneExibicao}`));
  if (agendaUrl) item(linkExterno(agendaUrl, null, "Agendamento online"));
  rod.append(ul, el("p", "rodape-end", `${E.rua}, ${E.bairro}, ${E.cidade} - ${E.uf}`));

  // ---------- Botão flutuante: aparece depois que os botões do topo saem da tela ----------
  const flutuante = $(".whats-flutuante");
  const acoes = $(".acoes");
  if ("IntersectionObserver" in window && acoes) {
    flutuante.classList.add("escondido");
    new IntersectionObserver(([e]) => {
      const esconder = e.isIntersecting || e.boundingClientRect.top > 0;
      flutuante.classList.toggle("escondido", esconder);
      flutuante.tabIndex = esconder ? -1 : 0;
    }).observe(acoes);
  }

})();
