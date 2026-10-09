/* =====================================================================
   CONFIGURAÇÃO DO SITE
   ---------------------------------------------------------------------
   Para criar o site de um novo cliente, edite SOMENTE este arquivo
   (e troque as fotos da pasta img/). Depois confira também as linhas
   marcadas com "TROCAR" no topo do index.html.
   Dica: mantenha as aspas e as vírgulas exatamente como estão.
   ===================================================================== */

window.SITE = {
  nome: "MF Barbearia",
  marca: "MF", // versão curta do nome, usada no topo da página
  slogan: "A número 1. De líder para líder.",
  bairro: "Parque Almerinda Chaves",
  cidade: "Jundiaí",

  // Fontes (todas gratuitas em https://fonts.google.com)
  // Para trocar: escolha as fontes no site, clique em "Get embed code"
  // e cole aqui o endereço que aparece em href="...".
  fontes: {
    titulo: "Bodoni Moda",     // títulos e preços
    texto: "Instrument Sans",  // textos e botões
    link: "https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400..800&family=Instrument+Sans:wght@400;500;600&display=swap"
  },

  // Cores do site (códigos hexadecimais; teste em https://htmlcolorcodes.com)
  cores: {
    fundo: "#18191b",      // cor de fundo principal
    superficie: "#232427", // fundo das áreas destacadas
    texto: "#f2f0eb",      // texto principal
    textoSuave: "#a3a2a6", // textos secundários
    brilho: "#b3a8ff",     // cor da "luz de LED" (destaques)
    detalhe: "#c9a54a"     // cor dos pequenos detalhes (dourado do logo)
  },

  contato: {
    whatsapp: "5511964277062", // 55 + DDD + número, só dígitos
    mensagemWhatsapp: "Olá! Vim pelo site e queria marcar um horário.",
    telefoneExibicao: "(11) 96427-7062",
    instagram: "mf_barbeariia", // só o @, sem o símbolo
    agendamentoUrl: "https://cashbarber.com.br/mfbarbearia", // deixe "" se não tiver
    agendamentoTexto: "Agendar horário"
  },

  endereco: {
    rua: "Rua José Ribeiro Barbosa, 115",
    bairro: "Pq Almerinda Chaves",
    cidade: "Jundiaí",
    uf: "SP",
    cep: "13212-561",
    // Texto usado para buscar no mapa. Use só o endereço se a ficha do
    // Google do cliente estiver com o endereço errado.
    buscaMapa: "Rua José Ribeiro Barbosa, 115 - Parque Res. Almerinda Chaves, Jundiaí - SP, 13212-561",
    latitude: -23.1444919,
    longitude: -46.9947631
  },

  // Nota do Google (deixe nota: "" para esconder)
  avaliacao: {
    nota: "5,0",
    total: 31,
    link: "https://www.google.com/maps/place/MF+Barbearia/@-23.1444311,-46.9948794,17z/data=!4m6!3m5!1s0x94cf31004b9b52b3:0xbbccda4f2bebe7db!8m2!3d-23.1444311!4d-46.9948794!16s%2Fg%2F11z7bgn5wv"
  },

  // Fuso horário da loja (usado no "Aberto agora"). Brasília = "America/Sao_Paulo"
  fusoHorario: "America/Sao_Paulo",

  // Horários: use "fechado" para dias sem atendimento.
  // Fechamento "00:00" = meia-noite.
  horarios: {
    segunda: ["10:00", "23:00"],
    terca:   ["09:00", "00:00"],
    quarta:  ["09:00", "00:00"],
    quinta:  ["09:00", "00:00"],
    sexta:   ["09:00", "00:00"],
    sabado:  ["07:00", "20:00"],
    domingo: ["09:00", "16:00"]
  },

  // Logo. "topo" = versão pequena do canto superior esquerdo; "src" = versão do rodapé.
  // Deixe os dois "" se o cliente não tiver logo (aí aparece o texto de "marca").
  logo: { topo: "img/logo-topo.png", src: "img/logo-mf.jpg", alt: "Logo MF Barber, Matheus & Felipe" },

  // Foto principal (aparece dentro do "espelho" no topo)
  fotoPrincipal: { src: "img/foto-1.jpg", alt: "Bancada da MF Barbearia com espelhos redondos iluminados" },

  // true = mostra o aviso "preços de exemplo" (use enquanto não tiver os reais)
  precosDeExemplo: false,
  // Serviços separados em grupos. "descricao" é opcional.
  // Preços conferidos na CashBarber em 09/10/2026.
  servicos: [
    { grupo: "Cabelo", itens: [
      { nome: "Corte", preco: "R$ 50" },
      { nome: "Corte careca", preco: "R$ 30" },
      { nome: "Pezinho", preco: "R$ 15" },
      { nome: "Pigmentação", preco: "R$ 35" },
      { nome: "Hidratação", preco: "R$ 35" },
      { nome: "Alisamento", preco: "R$ 35" },
      { nome: "Progressiva", preco: "a partir de R$ 100" }
    ]},
    { grupo: "Barba", itens: [
      { nome: "Barba", preco: "R$ 50" },
      { nome: "Acabamento de barba", preco: "R$ 30" },
      { nome: "Bigode", preco: "R$ 15" },
      { nome: "Raspar barba na máquina", preco: "R$ 5" },
      { nome: "Pigmentação de barba", preco: "R$ 35" },
      { nome: "Hidratação de barba", preco: "R$ 35" }
    ]},
    { grupo: "Rosto", itens: [
      { nome: "Sobrancelha", preco: "R$ 15" },
      { nome: "Sobrancelha na cera", preco: "R$ 20" },
      { nome: "Limpeza de pele", preco: "R$ 50" },
      { nome: "Epilação de orelha", preco: "R$ 22" },
      { nome: "Epilação nasal", preco: "R$ 22" }
    ]}
  ],

  // Planos de assinatura (deixe a lista vazia [] para esconder)
  planos: {
    titulo: "Assinatura",
    texto: "Corta todo mês? No plano você paga um valor fixo e volta quantas vezes quiser.",
    botao: "Assinar pela CashBarber",
    lista: [
      { nome: "Corte ilimitado", preco: "R$ 89,90", periodo: "/mês", destaque: "Sai mais barato que dois cortes avulsos" },
      { nome: "Barba ilimitada", preco: "R$ 94,90", periodo: "/mês" },
      { nome: "Corte + barba ilimitados", preco: "R$ 139,90", periodo: "/mês" }
    ]
  },

  // Seção "quem atende" (deixe titulo: "" para esconder)
  equipe: {
    titulo: "Matheus & Felipe",
    texto: "Quem pega na máquina é quem cuida da casa. Matheus e Felipe atendem pessoalmente, com hora marcada, pra você chegar, sentar e sair do jeito que pediu.",
    foto: { src: "img/foto-3.jpg", alt: "Matheus e Felipe, barbeiros da MF, ao lado das cadeiras" }
  },

  // Avaliações reais de clientes (deixe a lista vazia [] para esconder)
  depoimentos: [
    { texto: "Esses caras são sinistros, não é só mudança de visual. Os caras melhoram até a autoestima.", autor: "Bruno A." },
    { texto: "Muito top o lugar, e excelentes profissionais.", autor: "Romário C." },
    { texto: "Atendimento impecável e diferenciado.", autor: "Hiago C." }
  ],

  // Galeria de fotos (a primeira aparece maior)
  galeria: [
    { src: "img/foto-6.jpg", alt: "Salão da MF com as cadeiras e a luz da bancada acesa" },
    { src: "img/foto-2.jpg", alt: "Cadeira com a capa da MF diante dos espelhos" },
    { src: "img/foto-4.jpg", alt: "Barbeiro cumprimentando um cliente no salão" }
  ]
};
