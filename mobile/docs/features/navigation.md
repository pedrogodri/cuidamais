# Menu inferior (`app/(shared)/(tabs)/`)

Documenta a tab bar persistente pós-login — decisão original em
`docs/superpowers/specs/2026-08-17-bottom-tab-navigation-design.md`, este
arquivo é o registro do que ficou implementado.

## O que é

Um único `Tabs` navigator (`app/(shared)/(tabs)/_layout.tsx`), guardado só
por sessão (`useSessionGuard` — exige `session`, não um tipo de perfil
específico). As abas visíveis mudam conforme o perfil ativo
(`useActiveProfileStore`), decidido pela função pura `isTabVisible` em
`src/features/navigation/getVisibleTabs.ts`:

| Aba    | Rota         | Cuidador | Família / Pessoa cuidada | Sem perfil ativo |
| ------ | ------------ | -------- | ------------------------ | ---------------- |
| Home   | `home.tsx`   | ✅       | ✅                       | ✅               |
| Perfil | `perfil.tsx` | ✅       | —                        | —                |
| Buscar | `buscar.tsx` | —        | ✅                       | —                |
| Agenda | `agenda.tsx` | ✅       | ✅                       | —                |
| Chat   | `chat.tsx`   | ✅       | ✅                       | —                |

Home é a única aba sempre visível — sem perfil ativo, é a única forma de
navegar (o `ProfileSwitcherDropdown` de dentro da Home é quem escolhe um
perfil, e as demais abas aparecem depois disso).

## Visual

Aba ativa: ícone (variante preenchida) + label dentro de uma pill de fundo
na cor do perfil ativo (`getProfileTheme(activeType).bgClass100`/
`.textClass700` + `getProfileIconColorHex(activeType)` pro ícone). Aba
inativa: ícone outline + label em `neutral-500`, sem fundo. A cor muda
dinamicamente com o perfil ativo — não é uma cor fixa de tab bar. Sem
perfil ativo, usa petrol como tom padrão (`DEFAULT_TONE` em `_layout.tsx`).

Implementado via `tabBarShowLabel: false` + `tabBarIcon` retornando
ícone+label juntos (componente `TabBarIcon`,
`src/features/navigation/components/`), com `tabBarIconStyle: { width: 100,
height: 32 }` no `screenOptions` do `Tabs`.

**Duas armadilhas reais encontradas aqui, nessa ordem:**

1. **`tabBarIcon` sozinho corta o label.** O wrapper interno do React
   Navigation (`TabBarIcon` em
   `expo-router/build/react-navigation/bottom-tabs/views/`) força o
   conteúdo de `tabBarIcon` a caber numa caixa fixa de ~31×28px (pensada só
   pra um ícone) — qualquer label mais longo que uma letra fica cortado
   (ex: "Home" virava só "H", visto rodando no simulador). Corrigido
   passando `tabBarIconStyle` — vira o `style` que esse wrapper interno
   mescla por cima do tamanho padrão, então `{ width: 100, height: 32 }`
   sobrescreve o 31×28 travado. O componente `TabBarIcon` também precisa de
   `self-start` na `View` raiz — sem isso, o `alignItems: 'stretch'` padrão
   do RN estica a pill pra ocupar a largura toda da caixa (100px) em vez de
   abraçar só o conteúdo.
2. **`tabBarButton` (dá controle total do item, sem essa caixa) parecia a
   correção óbvia pro problema acima — mas o Expo Router recusa em runtime**
   com `Error: Cannot use \`href\` and \`tabBarButton\` together.`Como
esconder aba por perfil depende de`href: null`/`undefined`por`Tabs.Screen`(ver tabela acima),`tabBarButton` está descartado
   enquanto isso for necessário — só descoberto rodando o app de verdade,
   não pelo TypeScript nem pelos testes (nenhum dos dois pega esse tipo de
   incompatibilidade de runtime entre opções do React Navigation).

## O que é real vs. placeholder

- **Home**: real, inalterada (mesma Home adaptativa de sempre — ver
  `home.md`), só mudou de pasta (`(shared)/home.tsx` →
  `(shared)/(tabs)/home.tsx`).
- **Perfil**: real, migrada de `(caregiver)/index.tsx` (ver
  `caregiver-profile.md`) — perdeu o botão de voltar customizado (não faz
  sentido numa aba raiz).
- **Buscar, Agenda, Chat**: placeholders (`View` + `Text` fixos, mesmo
  padrão de `(shared)/settings.tsx`). Agenda tem uma variação de texto por
  perfil ("Agenda" pro Cuidador, "Remédios e agenda" pra Família/Pessoa
  cuidada) — só o texto, sem lógica além disso.

## O que foi removido

- Grupos de rota `(caregiver)` e `(family)` (cada um era um `Tabs`
  navigator próprio de uma aba só, guardado por tipo de perfil via
  `useProfileGuard` — nenhum dos dois fazia parte do fluxo principal).
- O CTA "Ver meu perfil público" na Home (existia só porque não havia
  outro jeito de chegar no Perfil; a aba resolve isso direto).

## Simplificação conhecida

Nenhuma rota dentro de `(tabs)` guarda por tipo de perfil individualmente
(`perfil.tsx` não checa que o perfil ativo é `caregiver` antes de
renderizar, por exemplo) — a proteção é só "essa aba não aparece pro
perfil errado". Suficiente por enquanto porque não há deep link direto pra
essas rotas ainda. `useProfileGuard`/`canAccessProfileRoute`
(`src/features/auth/guards/`) continuam existindo, sem uso ativo no
momento, prontos pra quando um guard por tipo dentro de uma aba específica
for necessário.

## Testes

- `getVisibleTabs.test.ts` cobre a regra de visibilidade por perfil (os 5
  nomes de aba × os 4 estados de perfil possíveis).
- `home.test.tsx` migrou de pasta, com os 2 testes do CTA removido
  trocados por 1 teste confirmando que o texto não aparece mais.
- `agenda.test.tsx` cobre a troca de texto por perfil.
- `perfil.tsx`, `buscar.tsx`, `chat.tsx` e `_layout.tsx` não têm teste
  dedicado — composição presentacional de peças já testadas, mesmo padrão
  dos cards da Home.
