# Perfil público do cuidador (`app/(caregiver)/index.tsx`)

Documenta o que existe hoje na aba "Perfil" do grupo `(caregiver)` — a
visão pública do cuidador (nome, avaliações, especialidades), correspondente
a RF03/RF04 de `../../../docs/product/vision.md`.

## O que é

Tela de leitura (sem edição) mostrando o perfil do cuidador como ele
apareceria pra uma família na busca. Composta por três seções:

```
app/(caregiver)/index.tsx                  — tela fina, monta a tela

src/features/caregiver-profile/
  components/
    ProfileHeaderCard.tsx   — avatar (iniciais), nome, selos, nota + nº de avaliações
    AboutSection.tsx        — bio, especialidades (chips), experiência, região, disponibilidade, valor/hora
    ReviewsList.tsx         — lista de avaliações (autor, nota, comentário, data); estado vazio "Sem avaliações ainda."
  mockCaregiverProfile.ts   — MOCK_CAREGIVER_PROFILE + MOCK_REVIEWS
```

Os selos "Verificado" e "Mais bem avaliado" reaproveitam
`VerificationStatusBadge` de
`src/features/caregiver-onboarding/components/` (mesmo componente do fluxo
de verificação) em vez de duplicar o padrão de badge.

**Cabeçalho próprio, header nativo desligado:** `(caregiver)` é um `Tabs`
navigator (não `Stack`), então não ganha seta de voltar automática ao ser
aberto por `router.push` a partir de outro grupo de rota — e o header
nativo do `Tabs.Screen` (título "Perfil" sozinho, sem botão de voltar)
só duplicava informação e empurrava o conteúdo pra baixo com um espaço
vazio grande. Por isso `options.headerShown: false` foi setado em
`app/(caregiver)/_layout.tsx` pra essa rota, e a tela monta seu próprio
cabeçalho: uma linha `chevron-back` (botão circular, área de toque 40×40,
`active:bg-neutral-100`) + `<H3>Perfil</H3>`, com borda inferior sutil
(`border-neutral-100`) separando do conteúdo — mesmo padrão de botão de
voltar usado em `app/(caregiver-onboarding)/intro.tsx`, mas em par com um
título em vez de sozinho.

## O que é mockado

Tudo. `MOCK_CAREGIVER_PROFILE`/`MOCK_REVIEWS` são dados fixos — não há
cadastro profissional real (RF04) nem edição desses campos, avaliação
bidirecional real (RF12/RF13), verificação de identidade/antecedentes
ligada a esse perfil (isso é o fluxo separado em
`caregiver-onboarding.md`), nem foto real (só iniciais). O valor/hora é
só informativo, sem processar pagamento (NEG04).

## Como se chega lá

Alcançável a partir da Home (`app/(shared)/home.tsx`), no modo `caregiver`:
botão secundário "Ver meu perfil público" abaixo do `TodaysTasksCard`, que
faz `router.push('/(caregiver)')`. A rota já é acessível porque
`useProfileGuard('caregiver')` (guard do grupo `(caregiver)`) só exige
sessão + perfil ativo `caregiver`, ambos reais desde que login/signup
passaram a chamar `AuthProvider.signIn` (ver `auth-flow.md`) e o
`ProfileSwitcherDropdown` passou a setar o perfil ativo de verdade (ver
`home.md`).

## Testes

- `ProfileHeaderCard.test.tsx`, `AboutSection.test.tsx`,
  `ReviewsList.test.tsx` cobrem os três componentes com dados fixos,
  incluindo o estado vazio de `ReviewsList` (lista sem avaliações).
- `home.test.tsx` cobre o link "Ver meu perfil público": aparece só no
  modo `caregiver` e chama `router.push('/(caregiver)')` ao tocar.
- `app/(caregiver)/index.test.tsx` cobre o botão de voltar chamando
  `router.back()`.
