# Modelo de site para comércio local

Site de uma página: só HTML, CSS e JavaScript, sem instalar nada.
Primeiro cliente: **MF Barbearia** (Jundiaí).

## Como ver o site no seu computador

1. Clique com o botão direito em `servidor.ps1` e escolha **Executar com o PowerShell**.
2. Abra `http://localhost:8080` no navegador.
3. Para ver como fica no celular: aperte `F12` no Chrome e clique no ícone de celular.

## Como criar o site de um cliente novo (uns 15 minutos)

1. **Copie a pasta inteira** e dê o nome do cliente (ex.: `site-salao-da-ana`).
2. **Fotos:** coloque as fotos do cliente na pasta `img/`.
   - Use fotos tiradas pelo próprio cliente ou com autorização dele.
   - Não coloque fotos com crianças sem autorização dos pais.
   - Fotos com até 1200 px de largura deixam o site rápido.
   - Logo: `img/logo-topo.png` (quadrado, 128 x 128, usado no topo e na aba do navegador) e `img/logo-mf.jpg` (rodapé).
3. **Abra o `config.js`** e troque tudo: nome, slogan, cores, WhatsApp, endereço, horários, serviços, textos e fotos.
   - Mantenha as aspas `" "` e as vírgulas.
   - Para esconder uma seção, siga as dicas dos comentários (por ex.: `depoimentos: []`).
4. **Abra o `index.html`** e troque só as linhas entre `<!-- TROCAR -->` e `<!-- /TROCAR -->`. São o título e a descrição que aparecem no Google e na prévia do WhatsApp.
5. Rode o `servidor.ps1` e confira tudo no navegador, principalmente no tamanho de celular.

## Pastas

| Arquivo | Para que serve | Precisa mexer? |
|---|---|---|
| `config.js` | Todos os dados do cliente | **Sim, sempre** |
| `index.html` | Estrutura da página | Só as linhas TROCAR |
| `css/style.css` | Visual (espaços, tamanhos, efeitos) | Raramente |
| `js/main.js` | Monta a página a partir do config | Não |
| `img/` | Fotos publicadas no site | Sim |
| `originais/` | Cópia das fotos originais (não vai para o site) | Não |
| `servidor.ps1` | Ver o site no seu computador | Não |

## Antes de entregar ao cliente

- [ ] Links do WhatsApp, agendamento e rota abrem certo no celular
- [ ] Horários e preços conferidos com o cliente
- [ ] Endereço confere com o Google Maps
- [ ] Linha `og:image` do `index.html` com o endereço completo da foto (depois de publicar)
- [ ] Testar o link no WhatsApp para ver a prévia
