/* Monta o site a partir do config.js. Normalmente não é preciso mexer aqui. */
(function () {
  const S = window.SITE;
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);
  const el = (tag, cls, txt) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  };

  const raiz = document.documentElement.style;

  // ---------- Fontes ----------
  if (S.fontes) {
    if (S.fontes.link) {
      const l = el("link"); l.rel = "stylesheet"; l.href = S.fontes.link;
      document.head.append(l);
    }
    if (S.fontes.titulo) raiz.setProperty("--fonte-titulo", `"${S.fontes.titulo}", Georgia, serif`);
    if (S.fontes.texto) raiz.setProperty("--fonte-texto", `"${S.fontes.texto}", system-ui, sans-serif`);
  }

  // ---------- Cores ----------
  const mapaCores = { fundo: "--fundo", superficie: "--superficie", texto: "--texto", textoSuave: "--texto-suave", brilho: "--brilho", detalhe: "--detalhe" };
  for (const k in mapaCores) if (S.cores[k]) raiz.setProperty(mapaCores[k], S.cores[k]);

  // ---------- Links ----------
  const whats = `https://wa.me/${S.contato.whatsapp}?text=${encodeURIComponent(S.contato.mensagemWhatsapp)}`;
  const rota = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(S.endereco.buscaMapa)}`;
  const agenda = S.contato.agendamentoUrl || whats;
  const links = { whatsapp: whats, rota: rota, agendamento: agenda };
  $$("[data-link]").forEach((a) => {
    a.href = links[a.dataset.link];
    if (a.dataset.link === "agendamento") {
      a.textContent = S.contato.agendamentoTexto;
      a.target = "_blank";
      a.rel = "noopener";
    }
  });

  // ---------- Textos simples ----------
  S.equipe = S.equipe || {};
  S.avaliacao = S.avaliacao || {};
  S.depoimentos = S.depoimentos || [];
  S.galeria = S.galeria || [];
  const campos = {
    nome: S.nome,
    marca: S.marca || S.nome,
    slogan: S.slogan,
    local: `${S.bairro}, ${S.cidade}`,
    "equipe-titulo": S.equipe.titulo,
    "equipe-texto": S.equipe.texto
  };
  $$("[data-campo]").forEach((n) => (n.textContent = campos[n.dataset.campo] || ""));

  // ---------- Logo do topo (ou o texto de "marca", se não houver logo) ----------
  const marca = $('[data-bloco="marca"]');
  marca.setAttribute("aria-label", `${S.nome}, voltar ao início`);
  if (S.logo && S.logo.topo) {
    const img = el("img", "topo-logo");
    img.src = S.logo.topo; img.alt = ""; img.width = 48; img.height = 48;
    marca.append(img);
  } else marca.textContent = S.marca || S.nome;

  // ---------- Fotos ----------
  const fotos = { principal: S.fotoPrincipal, equipe: S.equipe.foto };
  if (!S.fotoPrincipal || !S.fotoPrincipal.src) $(".espelho").remove();
  $$("[data-foto]").forEach((img) => {
    const f = fotos[img.dataset.foto];
    if (f) { img.src = f.src; img.alt = f.alt; }
  });

  // ---------- Avaliação ----------
  const nota = $('[data-bloco="avaliacao"]');
  if (S.avaliacao.nota) {
    nota.href = S.avaliacao.link;
    nota.innerHTML = `<span class="estrelas" aria-hidden="true">★★★★★</span> <strong>${S.avaliacao.nota}</strong> no Google, ${S.avaliacao.total} avaliações`;
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
    const hora = fmt(dias[diaAbre][0] && faixa(dias[diaAbre][0])[0]);
    const quando = diaAbre === agora.getDay() ? "hoje" : diaAbre === (agora.getDay() + 1) % 7 ? "amanhã" : dias[diaAbre][1].toLowerCase();
    return { aberto: false, texto: `Fechado agora, abre ${quando} às ${hora}` };
  }
  const st = $('[data-bloco="status"]');
  const pintarStatus = () => { const s = status(); st.textContent = s.texto; st.classList.toggle("aberto", s.aberto); };
  pintarStatus();
  setInterval(pintarStatus, 60000);

  const tabela = $('[data-bloco="horarios"]');
  const hoje = agoraNaLoja().getDay();
  [1, 2, 3, 4, 5, 6, 0].forEach((i) => {
    const [chave, nomeDia] = dias[i];
    const h = faixa(chave);
    const tr = el("tr");
    if (i === hoje) { tr.className = "hoje"; tr.setAttribute("aria-current", "date"); }
    tr.append(el("th", null, nomeDia + (i === hoje ? " (hoje)" : "")));
    tr.append(el("td", null, Array.isArray(h) ? `${fmt(h[0])} ${h[1] === "00:00" ? "à" : "às"} ${fmt(h[1])}` : "Fechado"));
    tr.firstChild.scope = "row";
    tabela.append(tr);
  });

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
    if (S.contato.agendamentoUrl) {
      const a = el("a", "botao botao-principal", P.botao);
      a.href = S.contato.agendamentoUrl; a.target = "_blank"; a.rel = "noopener";
      planos.append(a);
    }
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
    if (S.avaliacao.link && S.avaliacao.total) {
      const a = el("a", "link-avaliacoes", `Ler as ${S.avaliacao.total} avaliações no Google`);
      a.href = S.avaliacao.link; a.target = "_blank"; a.rel = "noopener";
      blocoDep.append(a);
    }
  }

  // ---------- Galeria + ampliar foto ----------
  const galeria = $('[data-bloco="galeria"]');
  const dlg = $('[data-bloco="ampliar"]');
  if (!S.galeria.length) galeria.closest("section").remove();
  S.galeria.forEach((f) => {
    const b = el("button", "galeria-item");
    b.type = "button";
    b.setAttribute("aria-label", `Ampliar foto: ${f.alt}`);
    const img = el("img");
    img.src = f.src; img.alt = f.alt; img.loading = "lazy"; img.decoding = "async";
    b.append(img);
    b.addEventListener("click", () => {
      const big = dlg.querySelector("img");
      big.src = f.src; big.alt = f.alt;
      dlg.showModal();
    });
    galeria.append(b);
  });
  dlg.querySelector(".ampliar-fechar").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });

  // ---------- Endereço e mapa ----------
  const E = S.endereco;
  $('[data-bloco="endereco"]').innerHTML =
    `${E.rua}<br>${E.bairro}, ${E.cidade} - ${E.uf}<br>CEP ${E.cep}`;
  const mapa = $('[data-bloco="mapa"]');
  const iframe = el("iframe");
  iframe.title = `Mapa: ${S.nome}`;
  iframe.loading = "lazy";
  iframe.referrerPolicy = "no-referrer-when-downgrade";
  iframe.src = `https://www.google.com/maps?q=${encodeURIComponent(E.buscaMapa)}&output=embed`;
  mapa.append(iframe);

  // ---------- Rodapé ----------
  const rod = $('[data-bloco="rodape"]');
  const ig = S.contato.instagram;
  rod.innerHTML = `
    ${S.logo && S.logo.src ? `<img class="rodape-logo" src="${S.logo.src}" alt="${S.logo.alt}" width="120" height="120" loading="lazy">` : ""}
    <p class="rodape-nome">${S.nome}</p>
    <ul class="rodape-links">
      ${ig ? `<li><a href="https://instagram.com/${ig}" target="_blank" rel="noopener">Instagram @${ig}</a></li>` : ""}
      <li><a href="${whats}" target="_blank" rel="noopener">WhatsApp ${S.contato.telefoneExibicao}</a></li>
      ${S.contato.agendamentoUrl ? `<li><a href="${S.contato.agendamentoUrl}" target="_blank" rel="noopener">Agendamento online</a></li>` : ""}
    </ul>
    <p class="rodape-end">${E.rua}, ${E.bairro}, ${E.cidade} - ${E.uf}</p>`;

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

  // ---------- Dados para o Google (busca local) ----------
  const codDia = { domingo: "Sunday", segunda: "Monday", terca: "Tuesday", quarta: "Wednesday", quinta: "Thursday", sexta: "Friday", sabado: "Saturday" };
  const ld = {
    "@context": "https://schema.org",
    "@type": "BarberShop",
    name: S.nome,
    slogan: S.slogan,
    image: new URL(S.fotoPrincipal.src, location.href).href,
    telephone: "+" + S.contato.whatsapp,
    url: location.href.split("#")[0],
    address: { "@type": "PostalAddress", streetAddress: E.rua, addressLocality: E.cidade, addressRegion: E.uf, postalCode: E.cep, addressCountry: "BR" },
    geo: { "@type": "GeoCoordinates", latitude: E.latitude, longitude: E.longitude },
    openingHoursSpecification: Object.keys(S.horarios).filter((d) => Array.isArray(S.horarios[d])).map((d) => ({
      "@type": "OpeningHoursSpecification", dayOfWeek: codDia[d], opens: S.horarios[d][0], closes: S.horarios[d][1] === "00:00" ? "23:59" : S.horarios[d][1]
    })),
    sameAs: ig ? ["https://instagram.com/" + ig] : []
  };
  if (S.avaliacao.nota) ld.aggregateRating = { "@type": "AggregateRating", ratingValue: S.avaliacao.nota.replace(",", "."), reviewCount: S.avaliacao.total };
  const sc = el("script"); sc.type = "application/ld+json"; sc.textContent = JSON.stringify(ld);
  document.head.append(sc);
})();
