# Design System — App de Cuidados Digitais

> Documento de referência para todo o time (produto, design, dev). Cobre paleta de cores, tipografia, espaçamento, componentes, acessibilidade, movimento e tom de voz. Nome do produto ainda não definido — substitua `[Nome do App]` onde aparecer.

## Sumário

1. [Personalidade e princípios](#1-personalidade-e-princípios)
2. [Paleta de cores](#2-paleta-de-cores)
3. [Tipografia](#3-tipografia)
4. [Grid e espaçamento](#4-grid-e-espaçamento)
5. [Formas, raio e elevação](#5-formas-raio-e-elevação)
6. [Iconografia](#6-iconografia)
7. [Componentes-chave](#7-componentes-chave)
8. [Acessibilidade](#8-acessibilidade-não-negociável)
9. [Movimento e animação](#9-movimento-e-animação)
10. [Voz e microcopy](#10-voz-e-microcopy)
11. [O que evitamos e por quê](#11-o-que-evitamos-e-por-quê)
12. [Tokens para desenvolvimento](#12-tokens-para-desenvolvimento)

---

## 1. Personalidade e princípios

Este não é um app qualquer — é usado em momentos de vulnerabilidade real: alguém cuidando de um pai idoso à distância, um cuidador entrando na casa de um estranho pela primeira vez, uma dose de remédio que não pode ser esquecida. O design precisa carregar isso.

**Personalidade de marca:** acolhedor sem ser infantil · competente sem ser frio e clínico · calmo sem ser apático · direto sem ser seco.

**Cinco princípios:**

1. **Clareza antes de estética.** Se um cuidador de 60 anos ou um paciente com baixa visão não conseguir usar em 3 segundos, o componente está errado — independente de quão bonito seja.
2. **A cor carrega informação, não decoração.** Cada perfil (Cuidador / Pessoa cuidada / Responsável) tem uma cor fixa em todo o app. Isso não é estilo — é uma ferramenta funcional para famílias com múltiplos responsáveis num mesmo chat entenderem quem é quem num piscar de olhos.
3. **Nunca infantilizar quem é cuidado.** Idosos e pessoas com deficiência usam este app. Tom de voz respeitoso, sem "queridinho", sem emojis forçados, sem paleta pastel-bebê.
4. **Emergência é sagrada.** Uma única cor no sistema inteiro significa "isso é urgente" (SOS). Ela nunca é reaproveitada em outro contexto, para não gastar a atenção que ela precisa ter no momento certo.
5. **Casa, não hospital.** A referência visual é o conforto de um lar bem cuidado — não a estética clínica de hospital (azul-branco frio, excesso de espaço vazio, iconografia genérica de cruz médica).

---

## 2. Paleta de cores

### 2.1 Cores de marca

| Token | Hex | Uso |
|---|---|---|
| `petrol-500` **(Primária)** | `#1C5D52` | Cor principal da marca. Botões primários, header ativo, tab selecionada. Também é a cor fixa do perfil **Cuidador**. |
| `petrol-700` | `#123D36` | Estado pressionado/hover do primário; texto sobre `petrol-100`. |
| `petrol-100` | `#E3F1ED` | Fundos suaves, chips inativos, superfícies relacionadas ao Cuidador. |
| `amber-500` **(Secundária)** | `#D89B3C` | Acolhimento e calor humano. Cor fixa do perfil **Pessoa cuidada**. Também usada em lembretes (ver nota de acessibilidade abaixo). |
| `amber-700` | `#A9721F` | Texto/ícone sobre `amber-100`; nunca usar texto branco sobre `amber-500` (contraste insuficiente — ver seção 2.4). |
| `amber-100` | `#FBF0DC` | Fundo suave de alerta leve, superfícies relacionadas à Pessoa cuidada. |
| `vinculo-500` **(Terciária)** | `#C65B76` | Vínculo familiar, cuidado à distância. Cor fixa do perfil **Responsável**. |
| `vinculo-700` | `#A8455F` | Versão "texto-segura": usar quando precisar de texto branco em cima (botões preenchidos, banners). |
| `vinculo-100` | `#F6E4E9` | Fundos suaves relacionados ao Responsável. |

**Por que esse trio?** Ele nasce da própria função do produto: três perfis de usuário, três cores. Isso vira o elemento de assinatura visual do sistema — em qualquer chat em grupo, cartão ou notificação, a cor já diz "quem" antes mesmo do texto ser lido. Um irmão e uma irmã dividindo o cuidado da mãe, cada um como Responsável, veem instantaneamente as mensagens do cuidador (verde) separadas das da mãe (âmbar).

### 2.2 Cores semânticas (estado do sistema)

| Token | Hex | Uso |
|---|---|---|
| `success-500` | `#3F8557` | Remédio confirmado, check-in concluído, verificação aprovada. |
| `success-700` | `#2F6B45` | Texto branco sobre preenchimento verde (botões, chips sólidos). |
| `success-100` | `#E7F3EA` | Fundo de confirmação suave. |
| `warning` (= `amber-500` / `amber-700` / `amber-100`) | `#D89B3C` | Estoque baixo, lembrete pendente, ação requer atenção. |
| `error-500` **(reservada, ver princípio 4)** | `#C1432E` | Exclusivamente: botão SOS, alerta de interação medicamentosa, falha crítica. |
| `error-100` | `#FBE6E2` | Fundo de alerta crítico. |
| `info-500` | `#4472A8` | Banners informativos neutros, tooltips. Nunca em botão de ação. |
| `info-100` | `#E7EEF5` | Fundo informativo suave. |

> ⚠️ **Regra fixa:** `warning` compartilha a família de cor de `amber-500` (perfil Pessoa cuidada) de propósito — ambos comunicam "isto precisa de atenção e cuidado". Mas cor sozinha **nunca** comunica um estado crítico neste app: todo alerta vem sempre acompanhado de ícone + texto explícito. Isso segue WCAG 1.4.1 (uso de cor) e é ainda mais importante com usuários idosos ou com daltonismo.

### 2.3 Neutros (cinza quente)

Fundo levemente quente — não branco-hospital, não cinza frio de tech genérica.

| Token | Hex | Uso |
|---|---|---|
| `neutral-0` | `#FAF8F5` | Fundo padrão de tela |
| `neutral-50` | `#F3F0EB` | Fundo de seção alternada |
| `neutral-100` | `#E8E4DD` | Divisores sutis |
| `neutral-200` | `#DDD8D0` | Bordas de input e card |
| `neutral-300` | `#C7C1B7` | Ícones desabilitados |
| `neutral-500` | `#8B8880` | Placeholder, texto terciário |
| `neutral-700` | `#5C6B67` | Texto secundário (leve tom esverdeado, ecoa a marca) |
| `neutral-900` | `#26302E` | Texto primário (preto quente, nunca `#000000` puro) |
| `white` | `#FFFFFF` | Superfície de cards e modais |

### 2.4 Contraste — combinações validadas (WCAG)

Calculado por luminância relativa real, não estimado. AA normal = 4.5:1, AA grande/UI = 3:1, AAA = 7:1.

| Primeiro plano | Fundo | Contraste | Nível |
|---|---|---|---|
| `neutral-900` texto | `neutral-0` fundo | **12.8:1** | AAA |
| `neutral-700` texto | `neutral-0` fundo | **5.3:1** | AA |
| `petrol-500` texto/ícone | `neutral-0` fundo | **7.2:1** | AAA |
| Branco texto | `petrol-500` fundo (botão) | **7.7:1** | AAA |
| `neutral-900` texto | `amber-500` fundo (botão) | **5.6:1** | AA |
| Branco texto | `amber-500` fundo | 2.4:1 | ❌ Não usar |
| Branco texto | `vinculo-700` fundo | **5.7:1** | AA |
| `neutral-900` texto | `vinculo-500` fundo | usar `vinculo-700` acima em vez disso | — |
| Branco texto | `error-500` fundo (SOS) | **5.1:1** | AA |
| Branco texto | `success-700` fundo | **6.3:1** | AA |

Regra prática: **`amber-500` nunca leva texto branco em cima** — sempre `neutral-900`. Para `vinculo`, use `vinculo-700` (não `-500`) sempre que o texto por cima for branco.

### 2.5 Modo escuro (fase 2 — tokens de referência)

| Token claro | Equivalente escuro |
|---|---|
| `neutral-0` (fundo) | `#14201D` |
| `white` (superfície) | `#1D2A26` |
| `neutral-900` (texto) | `#F3F0EB` |
| `petrol-500` | `#4FA592` (clareado para manter contraste em fundo escuro) |
| `amber-500` | `#E8B364` |
| `vinculo-500` | `#DB84A0` |

---

## 3. Tipografia

**Fontes escolhidas:**

- **Títulos/Display — Bricolage Grotesque** (SemiBold/Medium): sans com personalidade própria, formas levemente inesperadas nas letras — dá caráter sem recorrer a serifa editorial (que soaria "app de notícias", não de cuidado). Gratuita, variável, ótimo suporte a acentuação em português.
- **Corpo de texto — Public Sans** (Regular/Medium): fonte desenvolvida para uso governamental nos EUA com foco pesado em legibilidade e testes de acessibilidade — exatamente o perfil que precisamos para usuários idosos lendo bula de remédio às 22h. Neutra, mas não genérica como a fonte-padrão de qualquer app.
- **Números e dados — IBM Plex Mono** (Medium, algarismos tabulares): usada especificamente para dosagem, horários e sinais vitais (pressão, glicemia). Fonte monoespaçada elimina ambiguidade entre "1", "l" e "I" — relevante quando o número errado numa dose importa de verdade.

Todas open-source (SIL OFL / domínio público), disponíveis via Google Fonts — fáceis de embutir em Flutter (`google_fonts`) ou React Native.

### 3.1 Escala tipográfica

| Estilo | Fonte / peso | Tamanho / entrelinha | Uso |
|---|---|---|---|
| Display | Bricolage Grotesque SemiBold | 32px / 40px | Tela de boas-vindas, onboarding |
| H1 | Bricolage Grotesque SemiBold | 26px / 34px | Título de tela |
| H2 | Bricolage Grotesque Medium | 21px / 28px | Título de seção |
| H3 | Bricolage Grotesque Medium | 18px / 24px | Título de card |
| Body Large | Public Sans Regular | 17px / 26px | Texto principal — padrão do app, não 15px |
| Body | Public Sans Regular | 15px / 22px | Texto de apoio, descrições |
| Caption | Public Sans Medium | 13px / 18px | Legendas, timestamps |
| Overline | Public Sans SemiBold, versalete | 11px / 14px, +0.8px tracking | Tags de perfil ("CUIDADOR"), rótulos funcionais — nunca decorativo |
| Dado numérico | IBM Plex Mono Medium, tabular | herda tamanho do contexto | Dosagem, horário, sinais vitais |

### 3.2 Regras de uso

- **Body Large (17px) é o corpo-padrão do app**, não 15px — a maioria dos design systems mobile usa 14–15px como base; aqui subimos porque parte relevante do público é idosa.
- Comprimento de linha máximo: ~65 caracteres em cards e balões de chat.
- Nunca usar peso "Light" ou "Thin" em texto abaixo de 18px — prejudica leitura em telas pequenas e sob luz solar.
- **Respeitar Dynamic Type (iOS) e escala de fonte do sistema (Android) até pelo menos 150%** sem quebrar layout. Usuários idosos frequentemente aumentam a fonte do sistema — se o app ignora isso, ele os exclui.

---

## 4. Grid e espaçamento

Grid de 8pt, com passo extra de 4pt para ajustes finos.

| Token | Valor | Uso típico |
|---|---|---|
| `space-1` | 4px | Espaço entre ícone e label |
| `space-2` | 8px | Padding interno de chip |
| `space-3` | 12px | Espaço entre elementos relacionados |
| `space-4` | 16px | Padding padrão de card, margem de tela |
| `space-5` | 20px | Espaço entre blocos de conteúdo |
| `space-6` | 24px | Separação entre seções |
| `space-8` | 32px | Espaço acima de título de tela |
| `space-10` | 40px | Respiro entre grandes blocos |
| `space-16` | 64px | Espaço de destaque (ex: acima do CTA final de uma tela) |

Margem lateral de tela: `16px` em telas pequenas, `20px` em telas grandes. Área de toque segura respeitando notch/gestos do sistema.

---

## 5. Formas, raio e elevação

| Token | Valor | Uso |
|---|---|---|
| `radius-sm` | 10px | Inputs, chips retangulares |
| `radius-md` | 16px | Cards — acolhedor, mas não infantil |
| `radius-lg` | 24px | Modais, bottom sheets |
| `radius-pill` | 999px | Badges, tags, filtros |
| `radius-full` | 50% (círculo) | Botão SOS, avatares — forma universalmente reconhecida como "emergência" quando aplicada ao SOS |

**Elevação:** sombras levemente tingidas com a cor primária em vez de cinza puro — reforça identidade sem que o usuário perceba conscientemente.

```
elevation-1: 0 1px 3px rgba(28, 93, 82, 0.08)   /* cards em repouso */
elevation-2: 0 4px 12px rgba(28, 93, 82, 0.12)  /* cards elevados, dropdowns */
elevation-3: 0 8px 24px rgba(28, 93, 82, 0.16)  /* modais, FAB, botão SOS */
```

---

## 6. Iconografia

- **Estilo:** traço arredondado, peso médio (não fino demais para não sumir em telas pequenas). Recomendado: *Phosphor Icons* (peso "Regular") ou *Material Symbols Rounded* — ambos gratuitos e com cobertura ampla.
- **Tamanhos:** 20px (inline com texto) · 24px (padrão de UI) · 32px (ações primárias de card) · 48px (SOS e ações críticas).
- **Regra de ouro:** nenhum ícone crítico (SOS, confirmar remédio, ligar) aparece sozinho — sempre acompanhado de rótulo em texto. Ícone isolado é aceitável só em ações secundárias e reversíveis (ex: editar, favoritar).

---

## 7. Componentes-chave

### 7.1 Botões

| Estado | Primário | Secundário | Destrutivo/SOS |
|---|---|---|---|
| Padrão | Fundo `petrol-500`, texto branco | Borda `petrol-500` 1.5px, texto `petrol-500`, fundo transparente | Fundo `error-500`, texto branco |
| Pressionado | Fundo `petrol-700` | Fundo `petrol-100` | Fundo `#9C331F` |
| Desabilitado | Fundo `neutral-200`, texto `neutral-500` | Borda `neutral-200`, texto `neutral-500` | — (SOS nunca é desabilitado) |
| Altura mínima | 52px | 52px | 64px (ver seção 8) |

### 7.2 Cartão de perfil (badge por tipo de usuário)

```
┌─────────────────────────────┐
│ ●──┐  Maria Silva            │  ← anel colorido no avatar
│ │👤│  CUIDADOR ✓ Verificado   │     (petrol / amber / vinculo
│ └──┘  ★ 4.9 · 12 avaliações  │      conforme o perfil)
└─────────────────────────────┘
```

- Anel do avatar: 3px, cor do perfil correspondente.
- Selo "Verificado": ícone de check dentro de círculo `petrol-500`, sempre com texto ao lado — nunca só o ícone.
- Selo "Destaque": estrela `amber-500` com contorno, usado com critério (avaliação alta ou tempo de plataforma), nunca como padrão visual repetido em excesso.

### 7.3 Cartão de remédio

Layout: nome do remédio em H3, dosagem e horário em **IBM Plex Mono** (para eliminar ambiguidade), estado (pendente/tomado) como chip colorido (`amber-100`→`success-100` ao confirmar), com quem confirmou em Caption abaixo.

### 7.4 Botão SOS

```
        ╭───────────╮
       │      📞      │   ← círculo, error-500,
       │     SOS      │      64px mínimo, sempre
        ╰───────────╯      visível sem rolar a tela
```

Fixo na tela inicial da Pessoa cuidada. Um toque (não exige confirmação extra — em emergência real, cada segundo conta) dispara notificação push + opção de ligação direta 192/SAMU. Confirmação pós-envio sempre factual e calma: *"Alerta enviado para Ana às 14:32."*

### 7.5 Balão de chat

Balão do remetente tingido com a cor do perfil dele (`petrol-100` fundo + `petrol-700` texto para Cuidador, e assim por diante) — em chats de grupo com múltiplos responsáveis, isso substitui a necessidade de reler o nome a cada mensagem.

### 7.6 Inputs e formulários

- Altura mínima 52px, borda `neutral-200` 1px, foco em `petrol-500` 2px + leve `elevation-1`.
- Label sempre visível acima do campo (nunca placeholder-only — usuário idoso perde a referência ao digitar).
- Erro de validação: borda `error-500`, mensagem abaixo do campo em texto, nunca só cor.

### 7.7 Tab bar

4–5 itens no máximo, ícone 24px + label sempre visível (nunca ícone sozinho), item ativo em `petrol-500`, inativo em `neutral-500`.

---

## 8. Acessibilidade (não-negociável)

Dado o público (idosos, pessoas com deficiência, cuidadores em situação de estresse), isto não é um adendo — é parte do core do produto.

- **Toque mínimo 48×48px** em qualquer elemento interativo; **64×64px no botão SOS** especificamente.
- **Contraste mínimo AA (4.5:1)** em todo texto de corpo; AAA sempre que possível em telas de saúde/dosagem.
- **Nunca comunicar estado só por cor** — sempre cor + ícone + texto.
- **Dynamic Type / escala de fonte do sistema** suportada até 150%+ sem quebra de layout.
- **Compatibilidade com leitor de tela** (VoiceOver/TalkBack): todo ícone funcional tem `label` semântico; ordem de leitura lógica.
- **Sem dependência só de gesto complexo** (swipe, long-press) para ações críticas — sempre existe alternativa por toque simples e visível.
- **Confirmação de ações irreversíveis** (excluir vínculo, cancelar atendimento) sempre com diálogo explícito, texto claro, nunca "desfazer silencioso".

---

## 9. Movimento e animação

- Micro-interações: 150–200ms, `ease-out`.
- Transições de tela: 250–300ms, fade ou slide simples — **sem** springs exagerados ou bounce, que podem confundir/desorientar usuários idosos ou com comprometimento cognitivo leve.
- Lembrete de remédio: uma pulsação única e suave no ícone, não looping (evita ansiedade por repetição constante).
- **Sempre respeitar "reduzir movimento" do sistema operacional** — ao ativado, todas as animações não-essenciais são removidas, mantendo só as funcionais (ex: spinner de carregamento).

---

## 10. Voz e microcopy

Direto, ativo, sem infantilizar, sem se desculpar em excesso. O mesmo verbo do botão aparece na confirmação.

| Situação | Em vez de... | Use |
|---|---|---|
| Erro genérico | "Ops! Algo deu errado 😅" | "Não foi possível carregar seus dados. Verifique sua internet e tente novamente." |
| Estado vazio (sem remédios) | "Nada por aqui ainda!" | "Nenhum remédio cadastrado. Toque em **+ Remédio** para começar." |
| Confirmação de ação | Botão "Salvar" → toast "Sucesso!" | Botão "Salvar" → toast "Salvo" (mesmo verbo, sempre) |
| Alerta de SOS enviado | "Ajuda a caminho! 🚨" | "Alerta enviado para Ana às 14:32." (factual, reduz o pânico em vez de alimentá-lo) |
| Falha de verificação de cuidador | "Você não passou na verificação" | "Não foi possível confirmar seus documentos. Reenvie uma foto legível do RG para continuar." |

---

## 11. O que evitamos e por quê

- **Bege/creme + serifa editorial + terracota** — combinação que hoje é o "padrão genérico" de qualquer app gerado por IA. Não combina com a urgência funcional deste produto.
- **Azul-branco clínico de hospital** — reforça a distância institucional que o produto tenta justamente reduzir (o objetivo é parecer *casa*, não *unidade de saúde*).
- **Paleta pastel-bebê** — infantilizaria pessoas idosas ou com deficiência, o que mina a dignidade e a confiança no serviço.
- **Vermelho/laranja saturado espalhado pelo app** — se tudo parece urgente, nada é urgente. O vermelho vive só no SOS.

---

## 12. Tokens para desenvolvimento

```css
:root {
  /* Marca */
  --color-petrol-500: #1C5D52;
  --color-petrol-700: #123D36;
  --color-petrol-100: #E3F1ED;
  --color-amber-500: #D89B3C;
  --color-amber-700: #A9721F;
  --color-amber-100: #FBF0DC;
  --color-vinculo-500: #C65B76;
  --color-vinculo-700: #A8455F;
  --color-vinculo-100: #F6E4E9;

  /* Semânticas */
  --color-success-500: #3F8557;
  --color-success-700: #2F6B45;
  --color-success-100: #E7F3EA;
  --color-error-500: #C1432E;
  --color-error-100: #FBE6E2;
  --color-info-500: #4472A8;
  --color-info-100: #E7EEF5;

  /* Neutros */
  --color-neutral-0: #FAF8F5;
  --color-neutral-50: #F3F0EB;
  --color-neutral-100: #E8E4DD;
  --color-neutral-200: #DDD8D0;
  --color-neutral-300: #C7C1B7;
  --color-neutral-500: #8B8880;
  --color-neutral-700: #5C6B67;
  --color-neutral-900: #26302E;
  --color-white: #FFFFFF;

  /* Tipografia */
  --font-display: 'Bricolage Grotesque', sans-serif;
  --font-body: 'Public Sans', sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;

  /* Espaçamento */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;
  --space-4: 16px; --space-5: 20px; --space-6: 24px;
  --space-8: 32px; --space-10: 40px; --space-16: 64px;

  /* Raio */
  --radius-sm: 10px; --radius-md: 16px;
  --radius-lg: 24px; --radius-pill: 999px;
}
```

**Para Flutter:** mapear diretamente para `ColorScheme` customizado + `ThemeData.textTheme` usando os pacotes `google_fonts` para as três famílias tipográficas.
**Para React Native:** exportar este objeto como `theme.ts` (tokens de cor, espaçamento e tipografia) e consumir via Styled Components ou Tamagui/NativeWind.

---

*Próximo passo sugerido: aplicar esses tokens nas primeiras telas do roadmap do PRD — Cadastro dos 3 perfis, Busca por região e Chat — para validar o sistema com casos reais antes de expandir para o restante do app.*