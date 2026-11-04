# Roadmap — Vídeo de apresentação "Homeopatia — um gabinete de curiosidades"

Registro do processo de criação do vídeo de apresentação da página **homeopatia.vercel.app**, do pedido inicial à versão final com link clicável.

- **Projeto:** site educativo sobre homeopatia (repositório `fipatual/homeopatia`, deploy na Vercel)
- **Período:** 3 e 4 de novembro de 2026
- **Resultado:** vídeo de 1min37s, 1920×1080, 30 fps, com narração, curadora animada e página com link clicável

---

## 1. Objetivo

Criar um vídeo de **1 a 2 minutos** que:

1. apresente a página e suas três abas (História, Ciência, Consulta);
2. convide as pessoas a aprender sobre a homeopatia e a mandar **críticas e sugestões** sobre a evolução dessa terapia;
3. anuncie o que vem pela frente na plataforma:
   - contribuições para melhorar o conteúdo;
   - relatos de experiências pessoais;
   - cadastro de profissionais, com divulgação do contato profissional.

---

## 2. Linha do tempo do processo

| Etapa | O que foi feito | Resultado |
| --- | --- | --- |
| 1. Primeira versão | Roteiro em 9 cenas, gravação da própria página, cartões de texto, música original | `homeopatia_apresentacao.mp4` (sem narração) |
| 2. Texto da locução | Texto em 9 blocos, com o tempo de cada cena e um guia de gravação | Documento "Locução — vídeo de apresentação Homeopatia" |
| 3. Vídeo-guia | Vídeo com "prepare-se / FALE AGORA", o texto do bloco e uma contagem regressiva | `guia_locucao.mp4` |
| 4. Narração própria | Gravação do usuário (.m4a), limpa e encaixada cena a cena | `homeopatia_apresentacao_locucao.mp4` (descartada) |
| 5. Voz sintética | Nova narração gerada no TTSMaker (.mp3), encaixada cena a cena | `homeopatia_apresentacao_voz_nova.mp4` |
| 6. Curadora animada | Personagem original desenhada no estilo do site, com a boca sincronizada à voz | `homeopatia_apresentacao_avatar.mp4`, `curadora_avatar.png` |
| 7. Olhar dirigido | A curadora vira a cabeça e o olhar para o que está sendo narrado | `homeopatia_apresentacao_curadora.mp4` |
| 8. Versão final | Sem as caixas de texto nas telas do site, mais uma página com o link clicável | `homeopatia_apresentacao_final.mp4` + página do vídeo |

---

## 3. Estrutura do vídeo (versão final)

| # | Cena | Início | Duração | Conteúdo |
| --- | --- | --- | --- | --- |
| 1 | Abertura | 0:00 | 7,5 s | Título "Homeopatia" e o subtítulo |
| 2 | Origem | 0:07 | 9,5 s | 1796, Hahnemann, *similia similibus curentur*, ilustração da quina |
| 3 | História | 0:17 | 12,5 s | A linha do tempo da página, rolando |
| 4 | Ciência | 0:29 | 12 s | A "escada das diluições" subindo, de 0C a 9C |
| 5 | Revisões | 0:41 | 9,5 s | Grandes revisões, contrapontos, Brasil e SUS |
| 6 | Consulta | 0:51 | 12,5 s | O exemplo "Bati o joelho e ficou roxo" e a prancha ilustrada |
| 7 | Convite | 1:03 | 11 s | "Aprenda. Questione. Contribua." e o pedido de críticas e sugestões |
| 8 | Em breve | 1:14 | 14 s | Os três cartões: Contribuições, Relatos pessoais, Profissionais |
| 9 | Encerramento | 1:28 | 9 s | homeopatia.vercel.app (clicável na página do vídeo) |

---

## 4. Como foi feito (parte técnica)

### 4.1 Gravação da página
- O site foi servido a partir do repositório, porque o endereço de produção não era acessível do ambiente de trabalho.
- As cenas foram gravadas com **Playwright** (Chromium) a 1440×810 com escala 4/3, o que dá 1920×1080. Cada quadro é um JPEG enviado direto ao `ffmpeg`.
- Um **relógio virtual** congela as animações CSS e as avança quadro a quadro. Assim o movimento fica igual ao do site, por mais lenta que seja a captura.
- A rolagem e os cliques (escada das diluições, exemplo da Consulta) são feitos por script em momentos fixos.
- **Fontes:** as originais (IM Fell English, Spectral) não puderam ser baixadas. No lugar delas entraram GFS Baskerville e Lora, de visual parecido.
- Cada cena vira um arquivo de vídeo separado. Os arquivos são juntados sem recodificar (`concat`).

### 4.2 Cartões de texto
- As cenas de abertura, origem, convite, em breve e encerramento são uma página HTML própria (`cards.html`). Ela usa o CSS e as ilustrações (`art.js`) do próprio site.

### 4.3 Música
- Composta por código (`music.py`): acordes de fundo e uma melodia de caixinha de música. É original, então não há questão de direitos autorais.

### 4.4 Narração
- **Texto:** 9 blocos, um por cena, com números por extenso para facilitar a leitura.
- **Voz final:** gerada no **TTSMaker**, que permite uso comercial gratuito.
- **Divisão em blocos:** a voz sintética veio sem pausas longas. Os blocos foram separados pelas pausas naturais da fala e conferidos pelo tamanho de cada texto.
- **Encaixe:** cada bloco começa logo que a sua cena aparece. Só o bloco 4 ficou 5% mais rápido, sem mudar o tom da voz.
- **Mixagem:** o volume da voz foi padronizado, e a música abaixa sozinha quando há fala.

### 4.5 Curadora animada
- **Personagem original** desenhada em SVG: coque, óculos redondos, gola rendada, broche de camafeu e medalhão dourado.
- **Camadas:** fundo, corpo, cabeça, coque, rosto, olhos (com 12 direções de olhar), boca (7 formas) e óculos.
- **Sincronia labial:** a forma da boca, quadro a quadro, sai do volume e do timbre da voz. A boca se adianta um quadro em relação ao som, como na fala real.
- **Vida:** piscadas a cada 2,6 a 5,2 s, balanço leve da cabeça e acenos nas sílabas fortes.
- **Olhar dirigido:** a cabeça gira para o assunto de cada frase, como o frasco, os cartões ou o endereço. Volta para quem assiste nas perguntas e nos convites. As viradas são suaves.
- A curadora é gravada como vídeo com transparência e colocada no canto superior direito, com 272 px.

### 4.6 Link clicável
- Um MP4 não aceita links clicáveis. Por isso foi feita uma **página com o vídeo** dentro.
- Na última tela, uma área clicável fica por cima do endereço e abre homeopatia.vercel.app.
- Um botão abaixo do vídeo abre o site a qualquer momento.

---

## 5. Arquivos entregues

| Arquivo | Para que serve |
| --- | --- |
| `homeopatia_apresentacao_final.mp4` | **Versão final**: narração, curadora, sem as caixas de texto |
| Página do vídeo (claude.ai/artifact/8VPnDoRA2mEpiYU8yDHFhx) | Vídeo com o endereço clicável no final |
| `curadora_avatar.png` | Imagem parada da curadora, com fundo transparente |
| `guia_locucao.mp4` | Vídeo-guia para gravar uma narração no tempo certo |
| Documento "Locução — vídeo de apresentação Homeopatia" | Texto da narração e guia de gravação |
| `homeopatia_apresentacao.mp4` | Versão sem narração e sem curadora (só textos e música) |

Versões intermediárias, que podem ser descartadas: `homeopatia_apresentacao_locucao.mp4`, `homeopatia_apresentacao_voz_nova.mp4`, `homeopatia_apresentacao_avatar.mp4` e `homeopatia_apresentacao_curadora.mp4`.

---

## 6. Limitações conhecidas

- **Tela cheia:** com o vídeo em tela cheia, o endereço deixa de ser clicável. O botão abaixo do vídeo continua funcionando.
- **Clique não testado tocando:** a área clicável foi posicionada pelas medidas, mas não foi testada com o vídeo rodando. Vale ir até o fim do vídeo e clicar.
- **Fontes:** o vídeo usa fontes parecidas com as do site, não as mesmas.
- **Voz sintética:** se o texto mudar, é preciso gerar a voz de novo no TTSMaker e refazer o encaixe.
- **YouTube:** para pôr um link para o seu site em cartões ou na tela final, o canal precisa fazer parte do Programa de Parcerias do YouTube.

---

## 7. Como fazer alterações no futuro

| Quero mudar… | O que fazer |
| --- | --- |
| Uma frase da narração | Gerar só aquele bloco no TTSMaker e enviar. Só esse trecho é trocado. |
| A voz inteira | Gerar o texto todo no TTSMaker, de preferência com 3 s de pausa entre os blocos. |
| A aparência da curadora (roupa, cabelo, tamanho, posição) | Pedir a mudança. A curadora é refeita sem regravar o resto. |
| Para onde a curadora olha | Dizer o momento (ex.: "aos 0:35 ela deve olhar para o frasco"). |
| O conteúdo de uma cena | Só aquela cena é regravada. As outras continuam iguais. |
| O endereço do site | Mudar o cartão final e o link da página do vídeo. |

---

## 8. Próximos passos sugeridos

- [ ] Assistir à versão final e testar o clique no endereço na página do vídeo
- [ ] Compartilhar a página do vídeo (botão **Compartilhar** no claude.ai) ou publicar o MP4 nas redes
- [ ] Decidir se a curadora vai virar a "cara" da plataforma (site, redes sociais)
- [ ] Implementar no site as funções anunciadas no vídeo:
  - [ ] formulário de críticas e sugestões
  - [ ] envio de contribuições para o conteúdo
  - [ ] espaço para relatos de experiências pessoais
  - [ ] cadastro de profissionais, com divulgação do contato profissional
- [ ] Quando essas funções estiverem no ar, atualizar a cena "Em breve" do vídeo
