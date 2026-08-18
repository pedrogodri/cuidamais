# Menu inferior (bottom tab navigation) — design

**Data:** 2026-08-17
**Status:** Aprovado para implementação

## Contexto

Hoje a experiência pós-login é uma única tela solta: `app/(shared)/home.tsx`
(um `Stack`, sem tab bar). `(caregiver)` e `(family)` já existem como
`Tabs` navigators separados, cada um guardado por `useProfileGuard`, mas
cada um só tem uma rota (`index`) e nenhum dos dois faz parte do fluxo
principal — a única forma de chegar lá era um `router.push('/(caregiver)')`
a partir de um botão na Home, sem tab bar visível nem volta fácil.

Este spec troca isso por um menu inferior persistente de verdade: uma
`Tabs` navigator único, cujas abas mudam conforme o perfil ativo
(`useActiveProfileStore`), com a Home continuando como está hoje (adaptativa,
já testada) e o "Perfil" do cuidador (`(caregiver)/index.tsx`, construído
na rodada anterior) virando uma aba em vez de uma tela empurrada.

Referência visual trazida pelo usuário: mockups de tab bar com várias
variações de estado ativo (pill de fundo, sublinhado, ícone preenchido).
Decisão: pill de fundo atrás do ícone+label da aba ativa, na cor do
**perfil ativo** (petrol/amber/vinculo via `getProfileTheme`), não uma cor
fixa — consistente com o resto do app (`ProfileSwitcherDropdown`, botões).

## Decisões

1. **Um único `Tabs`, não um por perfil.** As três abordagens consideradas
   foram: (A) um `Tabs` compartilhado com abas que mudam por perfil ativo,
   (B) manter `(caregiver)`/`(family)` como `Tabs` separados e duplicar a
   Home dentro de cada um, (C) igual à A mas sem remover os grupos antigos.
   Escolhida **A**: evita duplicar a Home adaptativa (que já existe, é
   testada, e cobre os três perfis num único componente) e evita deixar
   código morto (`(caregiver)`/`(family)` somem, conteúdo migra).
2. **Abas mudam por perfil ativo, escondidas via `options.href = null`**
   (a ser confirmado contra a doc do Expo SDK 57 na implementação, por
   causa do aviso em `mobile/AGENTS.md` de que a API do Expo Router muda
   entre versões) — não um `Tabs` navigator diferente por perfil.
3. **Guard do grupo passa a exigir só sessão, não tipo de perfil.** Hoje
   `(caregiver)`/`(family)` chamam `useProfileGuard('caregiver' | 'family')`
   cada um. O novo grupo único usa uma checagem mais simples (`session`
   existe) — quem decide o que é navegável por perfil é a lista de abas
   visíveis, não mais um redirect pra `/(auth)`.
4. **Abas por perfil** (Home é comum aos três; Pessoa cuidada usa o mesmo
   conjunto de Família):

   | Aba | Cuidador | Família / Pessoa cuidada | Conteúdo |
   |---|---|---|---|
   | Home | ✅ | ✅ | real, sem mudança (`src/features/home/`) |
   | Perfil | ✅ | — | real, migrado de `(caregiver)/index.tsx` |
   | Buscar | — | ✅ | placeholder (fica pra próxima rodada — busca de cuidadores) |
   | Agenda | ✅ | ✅ (rótulo "Remédios e agenda" pro lado família) | placeholder |
   | Chat | ✅ | ✅ | placeholder |

5. **"Perfil" perde o botão de voltar customizado.** Ele existe hoje
   (`chevron-back` + `router.back()`) porque a tela era alcançada por push.
   Como aba raiz de uma tab bar, voltar não faz sentido (não há "de onde
   voltar") — o cabeçalho customizado (`chevron-back` + `<H3>Perfil</H3>`)
   vira só o título, sem o botão.
6. **CTA "Ver meu perfil público" na Home some.** Ele existia só porque não
   havia outro jeito de chegar no Perfil; agora a aba resolve isso
   diretamente. Remover em vez de manter um caminho redundante.
7. **Placeholders novos seguem o padrão já usado no projeto**
   (`View` + `Text` fixos, ex: `(family)/index.tsx` hoje) — não inventar
   conteúdo falso pra Buscar/Agenda/Chat só pra preencher espaço.

## Arquitetura

```
app/(shared)/
  _layout.tsx                       — Stack (sem header), inclui (tabs) como uma rota
  (tabs)/
    _layout.tsx                     — Tabs; lê useActiveProfileStore; monta as Tabs.Screen
                                       com options={{ href: activeProfile.type === X ? undefined : null }}
                                       por aba; guard simples (session existe, senão /(auth))
    home.tsx                        — conteúdo igual ao atual app/(shared)/home.tsx (só muda de pasta)
    perfil.tsx                      — conteúdo migrado de app/(caregiver)/index.tsx, sem botão de voltar
    buscar.tsx                      — placeholder ("Buscar cuidadores (placeholder)")
    agenda.tsx                      — placeholder ("Agenda (placeholder)")
    chat.tsx                        — placeholder ("Chat (placeholder)")
  settings.tsx                      — inalterado, continua fora da tab bar (Stack)

src/features/
  home/                              — inalterado
  caregiver-profile/                 — inalterado (componentes reaproveitados por perfil.tsx)
  navigation/
    tabBarTheme.ts (ou similar)      — deriva ícone/label/cor de cada aba a partir de ProfileType,
                                        reaproveitando getProfileTheme (não duplica o mapeamento)
```

Removidos: `app/(caregiver)/_layout.tsx`, `app/(caregiver)/index.tsx`,
`app/(caregiver)/index.test.tsx`, `app/(family)/_layout.tsx`,
`app/(family)/index.tsx` (e a pasta `useProfileGuard('caregiver')` /
`useProfileGuard('family')` deixa de ser chamada nesses grupos — o hook em
si continua existindo pra outros usos futuros, só não é chamado aqui).

## Visual

- Ícones (`Ionicons`): Home → `home`/`home-outline`, Perfil →
  `person`/`person-outline`, Buscar → `search`/`search-outline`, Agenda →
  `calendar`/`calendar-outline`, Chat → `chatbubble`/`chatbubble-outline`
  (variante preenchida quando ativo, outline quando inativo — mesmo padrão
  visual de estado ativo/inativo já usado em ícones do app).
- Aba ativa: pill de fundo (`rounded-pill`, cor `-100` do perfil ativo)
  atrás do ícone+label; label e ícone na cor `-700` do perfil
  (`getProfileTheme(activeProfile.type)`).
- Aba inativa: ícone/label em `neutral-500`, sem fundo.
- Cor muda dinamicamente com o perfil ativo (petrol no modo Cuidador,
  vinculo/amber no modo Família/Pessoa cuidada) — não é uma cor fixa de
  tab bar.

## Fora de escopo (deliberado)

- Conteúdo real de Buscar, Agenda e Chat — cada um vira sua própria
  rodada de spec/plano (Buscar é a próxima, conforme conversa anterior).
- Aba de Configurações — `settings.tsx` continua existindo mas fora da tab
  bar; não há ainda um ponto de entrada decidido pra ela (fica em aberto).
- Guard por tipo de perfil dentro de cada rota da tab (`perfil.tsx` não
  checa ativamente que o perfil ativo é `caregiver` antes de renderizar) —
  a proteção é só "essa aba não aparece pro perfil errado". Suficiente pra
  agora porque não há deep link direto pra essas rotas ainda; documentar
  como simplificação conhecida.

## Testes

- `(tabs)/_layout.tsx`: teste cobrindo quais abas ficam visíveis
  (`href !== null`) para cada `ProfileType`, incluindo `cared_person`
  compartilhando o conjunto de `family`.
- `home.test.tsx` e os testes de `perfil.tsx` (antigo
  `(caregiver)/index.test.tsx`) migram de pasta; o teste do botão de
  voltar em `perfil.tsx` é removido (não existe mais).
- `home.test.tsx`: os dois testes do link "Ver meu perfil público" são
  removidos (CTA não existe mais).
- Placeholders novos (`buscar.tsx`, `agenda.tsx`, `chat.tsx`) não pedem
  teste próprio — mesmo padrão de `(family)/index.tsx` hoje (verificação
  visual).

## Documentação

Depois de implementado: novo `mobile/docs/features/navigation.md`
documentando a tab bar (mesmo formato de `home.md`); atualizar
`architecture.md` (seção Navegação — remove `(caregiver)`/`(family)` como
grupos, descreve `(shared)/(tabs)`), `home.md` (CTA removido),
`caregiver-profile.md` (rota mudou de `(caregiver)` empurrado pra aba
`perfil.tsx`, sem botão de voltar), `requirements.md` (RF02 segue em
aberto — Buscar continua placeholder) e `CLAUDE.md` (lista de docs).
